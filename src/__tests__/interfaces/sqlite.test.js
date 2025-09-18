const {expect, test} = require("@jest/globals");
const {connectSqLite} = require("../../interfaces/sqlite");

test("sqlite connection", async () => {
    expect(connectSqLite().open).toBe(true);
});