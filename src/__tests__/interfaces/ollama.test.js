const {test, expect} = require("@jest/globals");
const {test: ollamaTest} = require("../../interfaces/ollama");
test("Check if ollama is working", async () => {
    expect((await ollamaTest()).done).toBe(true);
})