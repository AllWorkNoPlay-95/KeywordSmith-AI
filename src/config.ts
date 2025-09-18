import * as dotenv from "dotenv"

dotenv.config();

export const TOKEN = process.env.API_TOKEN || "";
export const API_ROOT = process.env.API_ROOT;
export const API_CATEGORIES_URL = API_ROOT + process.env.API_CATEGORIES_URL;
export const API_PRODUCTS_URL = API_ROOT + process.env.API_PRODUCTS_URL;
export const CATEGORIES_TARGET_KEY = process.env.CATEGORIES_TARGET_KEY || "name";
export const PRODUCTS_TARGET_KEY = process.env.PRODUCTS_TARGET_KEY || "name";
export const LANGUAGE = process.env.LANGUAGE || "en";
export const MODEL = process.env.MODEL || "qwen2.5:7b";

export const COMPANY_NAME = process.env.COMPANY_NAME;