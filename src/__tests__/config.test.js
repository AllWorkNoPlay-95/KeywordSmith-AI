const {expect, test} = require("@jest/globals");
const {API_DOWN_ROOT, COMPANY_NAME} = require("../../config");
const SYSTEM_PROMPT = require("../../tuning/system");
const PRODUCT_PROMPT = require("../../tuning/product");
const CATEGORY_PROMPT = require("../../tuning/category");


test("check config", () => {
    expect(COMPANY_NAME).toBeDefined();
    expect(SYSTEM_PROMPT).toBeDefined();
    expect(PRODUCT_PROMPT).toBeDefined();
    expect(CATEGORY_PROMPT).toBeDefined();
})