import {Payload} from "../types/Payload";
import {TechCacheRow} from "../types/TechSource";
import {webSearch, webFetch, WebSearchResultItem, WebFetchResult} from "../interfaces/ollamaWeb";
import {readTechCache, writeTechCache} from "../interfaces/sqlite";
import {promptJson} from "../interfaces/ollama";
import {MODEL} from "../../config";
import WEB_EXTRACT_SYSTEM_PROMPT from "../../tuning/webExtract.js";
import {logInfo, logWarn} from "../cli/styles";

// Minimum confidence returned by the LLM verification step before a found
// description is trusted enough to cache/use.
const MIN_CONFIDENCE = 0.6;

// How many distinct result pages to fetch in full. Search-result snippets are
// often too short to contain a page's bullet points / "General Information" /
// "Product Information" sections, so we fetch more than just the top hit.
const MAX_FETCH_CANDIDATES = 3;

type ExtractResult = {
    matches: boolean;
    confidence: number;
    source_url: string;
    description: string;
};

function buildIdentityBlock(p: Payload): string {
    let block = `Product identity:\n- Name: ${p.name}\n- EAN: ${p.ean}`;
    if (p.cod_produttore) block += `\n- Manufacturer code: ${p.cod_produttore}`;
    if (p.brand) block += `\n- Brand: ${p.brand}`;
    if (p.full_desc) block += `\n- Existing description: ${p.full_desc}`;
    return block;
}

function buildWebContentBlock(results: WebSearchResultItem[], fetchedPages: WebFetchResult[]): string {
    let block = "Web content collected:";
    results.forEach((r, i) => {
        const label = [r.title, r.url].filter(Boolean).join(" — ");
        block += `\n\n[Result ${i + 1}]${label ? ` ${label}` : ""}\n${r.content}`;
    });
    fetchedPages.forEach((f, i) => {
        block += `\n\n[Fetched page ${i + 1}] ${f.title} (${f.url})\n${f.content}`;
    });
    return block;
}

function containsIdentifier(text: string, value?: string): boolean {
    if (!value) return false;
    return text.toLowerCase().includes(value.toLowerCase());
}

function buildNotFoundRow(p: Payload): TechCacheRow {
    return {
        ean: p.ean!,
        product_id: p.id,
        name: p.name ?? null,
        cod_produttore: p.cod_produttore ?? null,
        brand: p.brand ?? null,
        description: null,
        source_url: null,
        status: "not_found",
        confidence: null,
        model: MODEL,
    };
}

// Cache-first: searches the web for a product by EAN, verifies the result is
// really the same product (EAN / manufacturer code / brand corroboration),
// extracts a technical description, and materializes the outcome (positive or
// negative) into product_tech_sources so the same EAN is never searched twice.
export async function findTechnicalDescription(p: Payload): Promise<TechCacheRow | null> {
    if (!p.ean) {
        logWarn(`Skipping web search for "${p.name}": no EAN available`);
        return null;
    }

    const cached = readTechCache(p.ean);
    if (cached) return cached;

    logInfo(`Web-searching technical description for EAN ${p.ean} (${p.name})`);

    let searchResults: WebSearchResultItem[];
    try {
        searchResults = await webSearch(p.ean);
    } catch (e: any) {
        logWarn(`Web search failed for EAN ${p.ean}: ${e.message ?? e}`);
        return null;
    }

    if (!searchResults.length) {
        const row = buildNotFoundRow(p);
        writeTechCache(row);
        return row;
    }

    // Best-effort: fetch several candidate pages in full, not just the top hit —
    // search-result snippets are usually too short to contain a page's bullet
    // points / "General Information" / "Product Information" sections.
    const candidateUrls = Array.from(new Set(
        searchResults.map(r => r.url).filter((u): u is string => Boolean(u))
    )).slice(0, MAX_FETCH_CANDIDATES);

    const fetchedPages: WebFetchResult[] = [];
    for (const url of candidateUrls) {
        try {
            fetchedPages.push(await webFetch(url));
        } catch (e: any) {
            logWarn(`Web fetch failed for ${url}: ${e.message ?? e}`);
        }
    }

    const userPrompt = `${buildIdentityBlock(p)}\n\n${buildWebContentBlock(searchResults, fetchedPages)}`;

    let extracted: ExtractResult;
    try {
        extracted = await promptJson<ExtractResult>(WEB_EXTRACT_SYSTEM_PROMPT, userPrompt);
    } catch (e: any) {
        logWarn(`Verification/extraction failed for EAN ${p.ean}: ${e.message ?? e}`);
        const row = buildNotFoundRow(p);
        writeTechCache(row);
        return row;
    }

    const combinedContent = [...searchResults.map(r => r.content), ...fetchedPages.map(f => f.content)].join("\n");
    // Corroborate the LLM's verdict deterministically: the EAN or manufacturer
    // code must actually appear in the raw content, to guard against hallucinated matches.
    const corroborated = containsIdentifier(combinedContent, p.ean) || containsIdentifier(combinedContent, p.cod_produttore);

    const isVerified = Boolean(
        extracted.matches
        && extracted.confidence >= MIN_CONFIDENCE
        && extracted.description
        && extracted.description.trim().length > 0
        && corroborated
    );

    const row: TechCacheRow = {
        ean: p.ean,
        product_id: p.id,
        name: p.name ?? null,
        cod_produttore: p.cod_produttore ?? null,
        brand: p.brand ?? null,
        description: isVerified ? extracted.description.trim() : null,
        source_url: isVerified ? (extracted.source_url || fetchedPages[0]?.url || candidateUrls[0] || null) : null,
        status: isVerified ? "found" : "not_found",
        confidence: typeof extracted.confidence === "number" ? extracted.confidence : null,
        model: MODEL,
    };

    writeTechCache(row);
    if (isVerified) {
        logInfo(`Found verified technical description for EAN ${p.ean} (confidence ${extracted.confidence})`);
    } else {
        logWarn(`No verified match for EAN ${p.ean} (matches=${extracted.matches}, confidence=${extracted.confidence})`);
    }
    return row;
}
