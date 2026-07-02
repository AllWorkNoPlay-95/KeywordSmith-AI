import ollama from "ollama";
import {WEB_SEARCH_MAX_RESULTS} from "../../config";
import {logWarn} from "../cli/styles";
import {sleep} from "../helpers/sleep";

// Ollama's official ollama.com web-search API. Uses the OLLAMA_API_KEY env var
// automatically (ollama-js attaches it as a Bearer token whenever a request
// targets https://ollama.com) — no manual client/header wiring needed here.

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 2000;

// The shipped ollama-js types only declare `content` on search results, but the
// live API also returns `title`/`url` per result — keep them optional so we can
// use them when present without fighting the package's own (incomplete) types.
export type WebSearchResultItem = {
    content: string;
    title?: string;
    url?: string;
};

export type WebFetchResult = {
    title: string;
    url: string;
    content: string;
    links: string[];
};

async function withRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            if (attempt === MAX_RETRIES) break;
            const backoff = BASE_BACKOFF_MS * attempt;
            logWarn(`${label} failed (attempt ${attempt}/${MAX_RETRIES}): ${(err as Error).message}. Retrying in ${backoff}ms...`);
            await sleep(backoff);
        }
    }
    throw new Error(`${label} failed after ${MAX_RETRIES} attempts: ${(lastError as Error).message}`);
}

export async function webSearch(query: string, maxResults: number = WEB_SEARCH_MAX_RESULTS): Promise<WebSearchResultItem[]> {
    const response = await withRetry("Ollama web search", () => ollama.webSearch({query, maxResults}));
    return response.results ?? [];
}

export async function webFetch(url: string): Promise<WebFetchResult> {
    return withRetry("Ollama web fetch", () => ollama.webFetch({url}));
}
