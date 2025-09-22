import * as dotenv from "dotenv"
import {PayloadType} from "./types/Payload";

dotenv.config();

export const TOKEN = process.env.API_TOKEN || "";
const API_DOWN_ROOT = process.env.API_DOWN_ROOT;
const API_CATEGORIES_DOWN_URL = API_DOWN_ROOT + process.env.API_CATEGORIES_DOWN_URL;
const API_PRODUCTS_DOWN_URL = API_DOWN_ROOT + process.env.API_PRODUCTS_DOWN_URL;

const API_UP_ROOT = process.env.API_UP_ROOT || API_DOWN_ROOT;
const API_CATEGORIES_UP_URL = API_UP_ROOT + process.env.API_CATEGORIES_UP_URL || API_CATEGORIES_DOWN_URL;
const API_PRODUCTS_UP_URL = API_UP_ROOT + process.env.API_PRODUCTS_UP_URL || API_PRODUCTS_DOWN_URL;

const CATEGORIES_TARGET_KEY = process.env.CATEGORIES_TARGET_KEY || "name";
const PRODUCTS_TARGET_KEY = process.env.PRODUCTS_TARGET_KEY || "name";
export const LANGUAGE = process.env.LANGUAGE || "en";
export const MODEL = process.env.MODEL || "llama3.1:8b"; //Reccomended: llama3.1:8b | mixtral:8x22b (RAM/GPU hungry) | mixtral:8x7b (RAM hungry) | qwen2.5:7b (Unstable, occasional hallucinations with cinese chars)
export const COMPANY_NAME = process.env.COMPANY_NAME;
export const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH || "./db.sqlite";

export const PAYLOAD_CONFIGS = [
    {
        type: "product" as PayloadType,
        up: API_PRODUCTS_UP_URL,
        down: API_PRODUCTS_DOWN_URL,
        targetKey: PRODUCTS_TARGET_KEY,
        promptAfterSystem: `
        Write a single SEO-optimized product description for this name following the system instructions.  

        Constraints:
        - Length: 180–220 words.
        - Begin with <h2>{PRODUCT_NAME}</h2>.
        - Structure the text with:
          1. <p> An engaging opening highlighting what the product is and why it’s useful. </p>
          2. <p> A clear description of benefits and typical contexts (school, office, home, creative projects). </p>
          3. <p> A persuasive closing with a subtle call to action. </p>
        - Use <strong> to emphasize key terms naturally, without overusing it.
        - Do not include any placeholder text, explanations, or instructions — only return the ready-to-use HTML description.

        The Product is: `,
    },
    {
        type: "category" as PayloadType,
        up: API_CATEGORIES_UP_URL,
        down: API_CATEGORIES_DOWN_URL,
        targetKey: CATEGORIES_TARGET_KEY,
        promptAfterSystem: `
        Write a single SEO-optimized category description for this category following the system instructions.  
        
        Constraints:
        - Length: 250–300 words.
        - Begin with <h2>{CATEGORY_NAME}</h2>.
        - Structure the text with a short engaging intro, a clear explanation of benefits and common use cases (school, office, home, creative projects), and end with a subtle call to action.
        - Use <p> for paragraphs and <strong> to emphasize key terms (but keep emphasis natural and not excessive).
        - Do not include any placeholder text, explanations, or instructions — only return the ready-to-use HTML description.

        The Category is: `
    }
];