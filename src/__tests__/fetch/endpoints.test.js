const {test, expect} = require("@jest/globals");
const {fetchSource} = require("../../fetch/sourceData");
test("Check API endpoints", async () => {
    const categories = await fetchSource(["category"]);
    expect(categories).toBeDefined();
    const products = await fetchSource(["product"]);
    expect(products).toBeDefined();
}, 20000);