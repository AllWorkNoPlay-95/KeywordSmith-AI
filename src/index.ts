import {getAllIdsDb} from "./interfaces/sqlite";
import {logOk} from "./cli/styles";
import {fetchSource} from "./fetch/sourceData";
import {PAYLOAD_CONFIGS} from "../config";
import {generatePayloadOutput} from "./prompts/payload";
import args from "node-args";

async function main(): Promise<void> {
    let filter: string[] = [];
    if (args["only"]) {
        filter = args["only"].split(",");
        if (filter.length === 0) throw new Error("No filter provided");
        for (const f of filter) {
            let found = false;
            for (const conf of PAYLOAD_CONFIGS) {
                if (conf.type === f) {
                    found = true;
                    break;
                }
            }
            if (!found) throw new Error(`Invalid filter: ${f}`);
        }
        logOk(
            `Only processing ${filter.join(", ")}`
        )
    }
    for (const conf of PAYLOAD_CONFIGS) {
        if (filter.length > 0 && !filter.includes(conf.type)) continue; //Apply filter here
        const thisPayload = await fetchSource([conf.type]);
        const thisPayloadIds = getAllIdsDb(conf.type);
        for (const thisPayloadi in thisPayload) {
            const thisPayloadItem = thisPayload[thisPayloadi];
            if (thisPayloadIds.includes(parseInt(String(thisPayloadItem.id)))) continue;
            logOk(`Processing ${conf.type} ${parseInt(thisPayloadi) + 1}/${thisPayload.length} (${((parseInt(thisPayloadi) + 1) / thisPayload.length * 100).toFixed(1)}%): ${thisPayloadItem.name}`);
            await generatePayloadOutput(thisPayloadItem);
        }
    }
}

main().then();