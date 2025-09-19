import axios from "axios";
import {API_PRODUCTS_DOWN_URL, PRODUCTS_TARGET_KEY, TOKEN} from "../config";

export type Product = {
    id: number,
    name: string,
    output: string
}

export async function fetchProducts() {
    const {data} = await axios.get(API_PRODUCTS_DOWN_URL + "?token=" + TOKEN);
    let resultArray: Product[] = [];
    for (const prod of data) {
        resultArray.push({
            id: prod.id,
            name: prod[PRODUCTS_TARGET_KEY],
            output: ""
        } as Product)
    }
    return resultArray;
}