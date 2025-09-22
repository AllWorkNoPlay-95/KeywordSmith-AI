const {expect, test} = require("@jest/globals");
const {API_DOWN_ROOT, COMPANY_NAME} = require("../config");

test("check config", () => {
    expect(COMPANY_NAME).toBeDefined();
})