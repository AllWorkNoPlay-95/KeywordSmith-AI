import {fetchProducts} from "./fetch/products";
import {logOk} from "./cli/styles";
import {generateProductsOutput} from "./prompts/products";
import {getAllIdsDb} from "./interfaces/sqlite";

(async function generateProducts(): Promise<void> {
    const products = await fetchProducts();
    const productsIds = getAllIdsDb("products");
    for (const p of products) {
        if (productsIds.includes(parseInt(String(p.id)))) continue;
        logOk("Processing: " + p.name);
        await generateProductsOutput(p);
    }
})().then(() => logOk("Done!"));