const {expect, test} = require("@jest/globals");
const {API_ROOT, COMPANY_NAME} = require("../config");

test("check config", () => {
    expect(API_ROOT).toBeDefined();
    expect(COMPANY_NAME).toBeDefined();
})