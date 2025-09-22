import {getAllIdsDb} from "./interfaces/sqlite";
import {logOk} from "./cli/styles";
import {fetchSource} from "./fetch/sourceData";
import {PAYLOAD_CONFIGS} from "./config";
import {generatePayloadOutput} from "./prompts/payload";

async function main(): Promise<void> {
    for (const conf of PAYLOAD_CONFIGS) {
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