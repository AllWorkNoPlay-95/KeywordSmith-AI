import axios from 'axios';
import {PAYLOAD_CONFIGS, TOKEN} from "../config";
import {Payload} from "../types/Payload";

type Result = { type: Payload["type"], data: Payload[] };

export async function fetchSource(filter: Payload["type"][] | false = false) {
    let resultArray: Payload[] = [];
    for (const pay of PAYLOAD_CONFIGS) {
        if (filter && !filter.includes(pay.type)) continue;
        const {data} = await axios.get(pay.down + "?token=" + TOKEN);
        for (const d of data) {
            resultArray.push({
                id: d.id,
                name: d[pay.targetKey],
                output: "",
                type: pay.type
            } as Payload)
        }
    }
    return resultArray;
}