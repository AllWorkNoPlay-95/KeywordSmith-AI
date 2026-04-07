import axios from 'axios';
import {PAYLOAD_CONFIGS, TOKEN} from "../../config";
import {Payload} from "../types/Payload";

type Result = { type: Payload["type"], data: Payload[] };

export async function fetchSource(filter: Payload["type"][] | false = false) {
    let resultArray: Payload[] = [];
    for (const pay of PAYLOAD_CONFIGS) {
        if (filter && !filter.includes(pay.type)) continue;
        const {data} = await axios.get(pay.down + "?token=" + TOKEN);
        for (const d of data) {
            const payload: Payload = {
                id: d.id,
                name: pay.type === "product" ? (d.short_desc || d[pay.targetKey]) : d[pay.targetKey],
                output: "",
                type: pay.type
            };
            if (pay.type === "product") {
                payload.ean = d.ean || undefined;
                payload.cod_produttore = d.cod_produttore || undefined;
                payload.brand = d.brand || undefined;
                payload.full_desc = d[pay.targetKey] || undefined;
            }
            resultArray.push(payload);
        }
    }
    return resultArray;
}