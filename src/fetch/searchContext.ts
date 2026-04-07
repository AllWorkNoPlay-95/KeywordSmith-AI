import { search, SafeSearchType } from "duck-duck-scrape";
import { logWarn } from "../cli/styles";

export async function searchContext(query: string, maxResults: number = 3): Promise<string> {
    try {
        const results = await search(query, { safeSearch: SafeSearchType.STRICT });
        if (results.noResults || !results.results.length) return "";

        return results.results
            .slice(0, maxResults)
            .map((r: any) => `- ${r.title}: ${r.description ?? ""}`.trim())
            .join("\n");
    } catch (e: any) {
        logWarn(`Web search failed: ${e.message ?? e}`);
        return "";
    }
}
