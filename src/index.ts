import {dumpDb, getAllIdsDb} from "./interfaces/sqlite";
import {logInfo, logOk, logWarn} from "./cli/styles";
import {fetchSource} from "./fetch/sourceData";
import {PAYLOAD_CONFIGS} from "../config";
import {generatePayloadOutput} from "./prompts/payload";
import args from "node-args";
import {sendGeneratedDescriptions} from "./send/generatedDescriptions";

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
        logWarn(
            `Only processing ${filter.join(", ")}`
        )
    }
    let eligible_configs = PAYLOAD_CONFIGS;
    if (filter.length > 0) eligible_configs = eligible_configs.filter(c => filter.includes(c.type));
    for (const conf of eligible_configs) {
        const thisPayload = await fetchSource([conf.type]);
        const thisPayloadIds = getAllIdsDb(conf.type);
        for (const payloadIndex in thisPayload) {
            const thisPayloadItem = thisPayload[payloadIndex];
            if (thisPayloadIds.includes(parseInt(String(thisPayloadItem.id)))) continue;
            logInfo(`Processing ${conf.type} ${parseInt(payloadIndex) + 1}/${thisPayload.length} (${((parseInt(payloadIndex) + 1) / thisPayload.length * 100).toFixed(1)}%): ${thisPayloadItem.name}`);
            let completeP = await generatePayloadOutput(thisPayloadItem);
            if (args["upload"] === "during") {
                logInfo(`Uploading ${conf.type} ${completeP.id}: ${completeP.name}`);
                await sendGeneratedDescriptions(completeP);
            }
        }
    }

    if (args["upload"] === "after") {
        for (const conf of eligible_configs) {
            logInfo(`Dumping ${conf.type} DB and uploading Everything, Everywhere, All at once...`); // EE
            const dump = dumpDb(conf.type);
            logOk(`Dumped ${dump.length} ${conf.type} payloads`);
            for (const d of dump) {
                await sendGeneratedDescriptions(d);
            }
        }
    }

    logOk("Done!");
}

main().then();