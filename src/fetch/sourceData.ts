import axios from 'axios';
import {PAYLOAD_CONFIGS, TOKEN} from "../config";
import {Payload} from "../types/Payload";

type Result = { type: Payload["type"], data: Payload[] };

export async function fetchSource(filter: Payload["type"][] | false = false) {
    let resultArray: Result[] = [];
    for (const pay of PAYLOAD_CONFIGS) {
        if (filter && !filter.includes(pay.type)) continue;
        let thisResultArray: Result = {
            type: pay.type,
            data: []
        };
        const {data} = await axios.get(pay.down + "?token=" + TOKEN);
        for (const d of data) {
            thisResultArray.data.push({
                id: d.id,
                name: d[pay.targetKey],
                output: "",
                type: pay.type
            } as Payload)
        }
    }
    return resultArray;
}