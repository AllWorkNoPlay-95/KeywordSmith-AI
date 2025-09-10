import axios from "axios";
import {API_PRODUCTS_URL, TOKEN} from "../config";

export default async function fetchProducts() {
    const {data} = await axios.get(API_PRODUCTS_URL + "?token=" + TOKEN);
    return data;
}