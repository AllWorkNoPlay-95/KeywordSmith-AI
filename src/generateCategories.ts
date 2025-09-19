import {fetchCategories} from "./fetch/categories";
import {logOk} from "./cli/styles";
import {generateCategoriesOutput} from "./prompts/categories";
import {getAllIdsDb} from "./interfaces/sqlite";

(async function generateCategories(): Promise<void> {
    const categories = await fetchCategories();
    const categoriesIds = getAllIdsDb("categories");
    for (const cat of categories) {
        if (categoriesIds.includes(parseInt(String(cat.id)))) continue;
        logOk("Processing: " + cat.name);
        await generateCategoriesOutput(cat);
    }
})().then(() => logOk("Done!"));