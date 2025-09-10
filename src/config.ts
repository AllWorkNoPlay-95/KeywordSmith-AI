import * as dotenv from "dotenv"

dotenv.config();

export const TOKEN = process.env.API_TOKEN || "";
export const API_ROOT = process.env.API_ROOT || "";
export const API_CATEGORIES_URL = API_ROOT + process.env.API_CATEGORIES_URL;
export const API_PRODUCTS_URL = API_ROOT + process.env.API_PRODUCTS_URL;