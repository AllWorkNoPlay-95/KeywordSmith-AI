import {fetchSource} from "../fetch/sourceData";
import {generatePayloadOutput} from "../prompts/payload";
import {logInfo, logOk, logWarn} from "../cli/styles";
import chalk from "chalk";

(async () => {
    const products = await fetchSource(["product"]);
    const sample = products.slice(0, 3);

    for (const p of sample) {
        console.log(chalk.bgCyan.white(" PRODUCT ") + ` ID: ${p.id}`);
        logInfo(`Name:       ${p.name}`);
        logInfo(`Brand:      ${p.brand ?? "—"}`);
        logInfo(`Cod. prod.: ${p.cod_produttore ?? "—"}`);
        logInfo(`EAN:        ${p.ean ?? "—"}`);
        if (p.full_desc) logInfo(`Full desc:  ${p.full_desc.slice(0, 150)}${p.full_desc.length > 150 ? "…" : ""}`);
        console.log();

        logWarn("Generating with LLM...");
        const result = await generatePayloadOutput(p);
        console.log(chalk.bgGreen.white(" LLM OUTPUT "));
        console.log(result.output);
        console.log("\n" + "─".repeat(60) + "\n");
    }

    logOk(`Preview done: ${sample.length} of ${products.length} products`);
})();
