import {fetchSource} from "../fetch/sourceData";
import {findTechnicalDescription} from "../crawl/technicalSource";
import {readTechCache} from "../interfaces/sqlite";
import {logInfo, logOk, logWarn} from "../cli/styles";
import {OLLAMA_API_KEY} from "../../config";

// Opt-in backfill: for every product with an EAN but no supplier source_desc,
// search the web (Ollama Web Search), verify the match, and materialize the
// result into product_tech_sources — so the normal `npm run dev` pipeline can
// pick it up from cache without ever searching live itself.
async function main(): Promise<void> {
    if (!OLLAMA_API_KEY) {
        logWarn("OLLAMA_API_KEY is not set. Web search requires an Ollama API key — create one at https://ollama.com/settings/keys and set it in .env. Aborting.");
        return;
    }

    const products = await fetchSource(["product"]);
    const eligible = products.filter(p => p.ean && !p.source_desc);
    const withCache = eligible.map(p => ({p, cached: readTechCache(p.ean!)}));
    const alreadyCached = withCache.filter(x => x.cached);
    const toSearch = withCache.filter(x => !x.cached).map(x => x.p);

    logInfo(`${products.length} products fetched, ${eligible.length} missing a supplier description (with EAN), ${alreadyCached.length} already cached, ${toSearch.length} to search`);

    let found = 0, notFound = 0, skipped = 0;
    for (let i = 0; i < toSearch.length; i++) {
        const p = toSearch[i];
        logInfo(`(${i + 1}/${toSearch.length}) Searching EAN ${p.ean} — ${p.name}`);
        const row = await findTechnicalDescription(p);
        if (!row) skipped++;
        else if (row.status === "found") found++;
        else notFound++;
    }

    logOk(`Done! ${found} found, ${notFound} not found, ${skipped} skipped, ${alreadyCached.length} already cached from a previous run.`);
}

main().then();
