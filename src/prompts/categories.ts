import {COMPANY_NAME, LANGUAGE} from "../config";
import {prompt} from "../interfaces/ollama";
import {Category} from "../fetch/categories";
import {writeToDb} from "../interfaces/sqlite";

export const CATEGORIES_KEYWORD_GENERATION_PROMPT = `
You are an expert SEO copywriter for an ${LANGUAGE} e-commerce of stationery and school supplies.
Your job: write concise, high-converting, semantically-rich category descriptions in ${LANGUAGE}.
Target audience: parents, students, small offices, schools.
Goals: uniqueness, clarity, internal relevance, and natural keyword usage.
Constraints:
- Length: 250–300 words.
- Use one H2 with the exact category name.
- Mention typical products and use cases (school, office, home).
- Add subtle semantic variants.
- Avoid keyword stuffing and brand mentions (unless provided).
- No competitor names, no fluff.
- Add the company name somewhere in the description for SEO purposes: ${COMPANY_NAME}.
- Reply with only the the html to copy and paste, stop immediately, no follow ups.

The category, written in ${LANGUAGE}, is: 
`;

export async function generateCategoriesOutput(cat: Category) {
    const steps = [

        // `Find eventual markup language signs and rewrite it in HTML, ready for copy and paste: `,
    ];

    let result = "";

    // logDebug(step);
    result = await prompt(CATEGORIES_KEYWORD_GENERATION_PROMPT + cat.name);

    result = result.replace(/```|```html/, "");

    cat.output = result;
    writeToDb(cat, "category");
}