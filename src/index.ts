import {fetchCategories} from "./fetch/categories";
import {logDebug} from "./cli/styles";
import {generateCategoriesOutput} from "./prompts/categories";

async function main(): Promise<void> {
    const categories = await fetchCategories();
    for (const cat of categories) {
        logDebug(cat.name);
        await generateCategoriesOutput(cat);
    }
    // const products = await fetchProducts();
}

main().then();