import * as dotenv from "dotenv"
import {PayloadType} from "./src/types/Payload";
import PRODUCT_PROMPT from "./tuning/product.js";
import CATEGORY_PROMPT from "./tuning/category.js";

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
        promptAfterSystem: PRODUCT_PROMPT,
    },
    {
        type: "category" as PayloadType,
        up: API_CATEGORIES_UP_URL,
        down: API_CATEGORIES_DOWN_URL,
        targetKey: CATEGORIES_TARGET_KEY,
        promptAfterSystem: CATEGORY_PROMPT
    }
];