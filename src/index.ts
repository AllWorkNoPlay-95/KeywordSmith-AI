import fetchCategories from "./fetch/categories";
import {CATEGORIES_TARGET_KEY} from "./config";
import {logDebug} from "./cli/styles";

async function main(): Promise<void> {
    const categories = await fetchCategories();
    categories.forEach((category: any) => {
        logDebug(category[CATEGORIES_TARGET_KEY]);
    });
}

main().then();