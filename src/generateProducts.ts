import {fetchProducts} from "./fetch/products";
import {logOk} from "./cli/styles";
import {generateProductsOutput} from "./prompts/products";
import {getAllIdsDb} from "./interfaces/sqlite";

(async function generateProducts(): Promise<void> {
    const products = await fetchProducts();
    const productsIds = getAllIdsDb("products");
    for (const cat of products) {
        if (productsIds.includes(cat.id)) continue;
        logOk("Processing: " + cat.name);
        await generateProductsOutput(cat);
    }
})().then(() => logOk("Done!"));