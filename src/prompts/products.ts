import {COMPANY_NAME, LANGUAGE} from "../config";
import {prompt} from "../interfaces/ollama";
import {cleanOutput} from "../helpers/cleanOutput";
import {writeToDb} from "../interfaces/sqlite";
import {Product} from "../fetch/products";

export const PRODUCT_DESCRIPTION_PROMPT = `
You are an expert SEO copywriter for an ${LANGUAGE} e-commerce of stationery and school supplies.
Your task: write a compelling, detailed, SEO-friendly product description in ${LANGUAGE}.
Target audience: parents, students, teachers, professionals, small offices.
Goals: clarity, persuasion, natural keyword integration, and highlighting real benefits.

Constraints:
- Length: 180–250 words.
- Start with a short engaging intro about the product’s main purpose/benefit.
- Use one H2 with the exact product name.
- Include details such as materials, dimensions, formats, colors, and key features.
- Mention typical use cases (school, office, home, creative projects).
- Subtly introduce semantic keyword variants (e.g. pen → ballpoint pen → writing instrument).
- Avoid keyword stuffing, fluff, and competitor/brand mentions (unless provided).
- ${COMPANY_NAME} is an e-commerce that only resells products from other companies, never assume a product has the company's name in it or that ${COMPANY_NAME} is a producer.
- Reply with only the the html to copy and paste, stop immediately, no follow ups.
- Only use <h2>, <strong>, and <p> pure tags. Don't put any other meta such as class or id. Never use any other html tags than the ones I gave you.
- Use only ${LANGUAGE} as language

The product description, written in ${LANGUAGE}, is: 
`;

export async function generateProductsOutput(p: Product) {
    let result = await prompt(PRODUCT_DESCRIPTION_PROMPT + p.name);

    result = cleanOutput(result);

    p.output = result;
    writeToDb(p, "products");
}