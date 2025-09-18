import axios from 'axios';
import {API_CATEGORIES_URL, CATEGORIES_TARGET_KEY, TOKEN} from "../config";

export type Category = {
    id: number,
    name: string,
    output: string
}

export async function fetchCategories() {
    const {data} = await axios.get(API_CATEGORIES_URL + "?token=" + TOKEN);
    let resultArray: Category[] = [];
    for (const cat of data) {
        resultArray.push({
            id: cat.id,
            name: cat[CATEGORIES_TARGET_KEY],
            output: ""
        } as Category)
    }
    return resultArray;
}