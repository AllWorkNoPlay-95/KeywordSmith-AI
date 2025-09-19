import {fetchCategories} from "./fetch/categories";
import {logOk} from "./cli/styles";
import {generateCategoriesOutput} from "./prompts/categories";
import {getAllIdsDb} from "./interfaces/sqlite";

(async function generateCategories(): Promise<void> {
    const categories = await fetchCategories();
    const categoriesIds = getAllIdsDb("categories");
    for (const cati in categories) {
        const cat = categories[cati];
        if (categoriesIds.includes(parseInt(String(cat.id)))) continue;
        logOk(`Processing ${parseInt(cati) + 1}/${categories.length} (${((parseInt(cati) + 1) / categories.length * 100).toFixed(1)}%): ${cat.name}`);
        await generateCategoriesOutput(cat);
    }
})().then(() => logOk("Done!"));