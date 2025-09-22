const {test, expect} = require("@jest/globals");
const {fetchSource} = require("../../fetch/sourceData");
const {fetchProducts} = require("../../fetch/products");
test("Check API endpoints", async () => {
    const categories = await fetchSource();
    expect(categories).toBeDefined();
    const products = await fetchProducts();
    expect(products).toBeDefined();
});