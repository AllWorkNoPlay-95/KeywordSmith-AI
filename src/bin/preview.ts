import {fetchSource} from "../fetch/sourceData";
import {generatePayloadOutput} from "../prompts/payload";
import {logInfo, logOk, logWarn} from "../cli/styles";
import {getCachedTechDescription} from "../interfaces/sqlite";
import {findTechnicalDescription} from "../crawl/technicalSource";
import {WEB_SEARCH} from "../../config";
import args from "node-args";
import chalk from "chalk";

const webSearchEnabled = WEB_SEARCH || args["web-search"] === true || args["web-search"] === "true";

(async () => {
    const products = await fetchSource(["product"]);
    const sample = products.slice(0, 3);

    for (const p of sample) {
        // Same cache-first / opt-in-live logic as the main pipeline (src/index.ts),
        // so the preview prompt reflects what `npm run dev` would actually send.
        if (p.ean && !p.source_desc) {
            if (webSearchEnabled) {
                try {
                    const row = await findTechnicalDescription(p);
                    if (row?.status === "found" && row.description) p.web_desc = row.description;
                } catch (e: any) {
                    logWarn(`Web crawl failed for EAN ${p.ean}: ${e.message ?? e}`);
                }
            } else {
                p.web_desc = getCachedTechDescription(p.ean);
            }
        }

        console.log(chalk.bgCyan.white(" PRODUCT ") + ` ID: ${p.id}`);
        logInfo(`Name:       ${p.name}`);
        logInfo(`Brand:      ${p.brand ?? "—"}`);
        logInfo(`Cod. prod.: ${p.cod_produttore ?? "—"}`);
        logInfo(`EAN:        ${p.ean ?? "—"}`);
        if (p.full_desc) logInfo(`Full desc:  ${p.full_desc.slice(0, 150)}${p.full_desc.length > 150 ? "…" : ""}`);
        if (p.source_desc) logInfo(`Source desc: ${p.source_desc.slice(0, 150)}${p.source_desc.length > 150 ? "…" : ""}`);
        if (p.web_desc) logInfo(`Web desc:   ${p.web_desc.slice(0, 150)}${p.web_desc.length > 150 ? "…" : ""}`);
        console.log();

        logWarn("Generating with LLM...");
        const result = await generatePayloadOutput(p);
        console.log(chalk.bgGreen.white(" LLM OUTPUT "));
        console.log(result.output);
        console.log("\n" + "─".repeat(60) + "\n");
    }

    logOk(`Preview done: ${sample.length} of ${products.length} products`);
})();
