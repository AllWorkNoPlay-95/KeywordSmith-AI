import axios from 'axios';
import {API_CATEGORIES_URL, TOKEN} from "../config";

export async function fetchCategories() {
    const {data} = await axios.get(API_CATEGORIES_URL + "?token=" + TOKEN);
    return data;
}