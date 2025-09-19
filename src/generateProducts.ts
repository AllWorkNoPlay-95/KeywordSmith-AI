import {fetchProducts} from "./fetch/products";
import {logOk} from "./cli/styles";
import {generateProductsOutput} from "./prompts/products";
import {getAllIdsDb} from "./interfaces/sqlite";

(async function generateProducts(): Promise<void> {
    const products = await fetchProducts();
    const productsIds = getAllIdsDb("products");
    for (const pi in products) {
        const p = products[pi];
        if (productsIds.includes(parseInt(String(p.id)))) continue;
        logOk(`Processing: ${parseInt(pi) + 1}/${products.length} (${((parseInt(pi) + 1) / products.length * 100).toFixed(1)}%): ${p.name}`);
        await generateProductsOutput(p);
    }
})().then(() => logOk("Done!"));