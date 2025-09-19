import {prompt} from "../interfaces/ollama";
import {cleanOutput} from "../helpers/cleanOutput";
import {writeToDb} from "../interfaces/sqlite";
import {Product} from "../fetch/products";
import {SYSTEM_PROMPT} from "./system";

export const PRODUCT_DESCRIPTION_PROMPT =
    SYSTEM_PROMPT + `
- Length: 250–300 words.
- Start with a short engaging intro about the product’s main purpose/benefit.
`;

export async function generateProductsOutput(p: Product) {
    let result = await prompt(
        PRODUCT_DESCRIPTION_PROMPT,
        "The product:" + p.name
    );

    result = cleanOutput(result);

    p.output = result;
    writeToDb(p, "products");
}