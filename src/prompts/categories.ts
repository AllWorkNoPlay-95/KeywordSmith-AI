import {prompt} from "../interfaces/ollama";
import {Category} from "../fetch/categories";
import {writeToDb} from "../interfaces/sqlite";
import {cleanOutput} from "../helpers/cleanOutput";
import {SYSTEM_PROMPT} from "./system";

export const CATEGORIES_KEYWORD_GENERATION_PROMPT = SYSTEM_PROMPT + `
- Length: 250–300 words.
- Start with a short engaging intro about the product’s main purpose/benefit.
`;

export async function generateCategoriesOutput(cat: Category) {
    let result = await prompt(
        CATEGORIES_KEYWORD_GENERATION_PROMPT,
        "The category: " + cat.name
    );

    result = cleanOutput(result);

    cat.output = result;
    writeToDb(cat, "categories");
}