import fetchCategories from "./fetch/categories";
import {CATEGORIES_TARGET_KEY, PRODUCTS_TARGET_KEY} from "./config";
import {logDebug} from "./cli/styles";
import fetchProducts from "./fetch/products";

async function main(): Promise<void> {
    const categories = await fetchCategories();
    categories.forEach((category: any) => {
        logDebug(category[CATEGORIES_TARGET_KEY]);
    });

    const products = await fetchProducts();
    products.forEach((product: any) => {
        logDebug(product[PRODUCTS_TARGET_KEY]);
    })
}

main().then();