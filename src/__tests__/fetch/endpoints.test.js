const {test, expect} = require("@jest/globals");
const {fetchCategories} = require("../../fetch/categories");
const {fetchProducts} = require("../../fetch/products");
test("Check API endpoints", async () => {
    const categories = await fetchCategories();
    expect(categories).toBeDefined();
    const products = await fetchProducts();
    expect(products).toBeDefined();
});