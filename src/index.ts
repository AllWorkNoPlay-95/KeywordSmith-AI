import {getUnsentDb, markSentDb, readFromDb} from "./interfaces/sqlite";
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
        const norm = (v: string | null | undefined) => (v ?? "").toString();
        for (const payloadIndex in thisPayload) {
            const thisPayloadItem = thisPayload[payloadIndex];
            const itemId = parseInt(String(thisPayloadItem.id));
            const prior = readFromDb(itemId, conf.type);
            if (
                prior
                && prior.name === thisPayloadItem.name
                && norm(prior.full_desc) === norm(thisPayloadItem.full_desc)
            ) {
                logInfo(`Skipping unchanged ${conf.type} ${itemId}: ${thisPayloadItem.name}`);
                continue;
            }
            const current = parseInt(payloadIndex) + 1;
            const remaining = thisPayload.length - current;
            logInfo(`Processing ${conf.type} ${current}/${thisPayload.length} (${(current / thisPayload.length * 100).toFixed(1)}%): ${thisPayloadItem.name}`);
            let completeP = await generatePayloadOutput(thisPayloadItem, remaining);
            if (args["upload"] === "during") {
                logInfo(`Uploading ${conf.type} ${completeP.id}: ${completeP.name}`);
                await sendGeneratedDescriptions(completeP);
                markSentDb(completeP.id, conf.type);
            }
        }
    }

    if (args["upload"] === "after") {
        for (const conf of eligible_configs) {
            logInfo(`Dumping unsent ${conf.type} rows and uploading Everything, Everywhere, All at once...`); // EE
            const dump = getUnsentDb(conf.type);
            logOk(`Dumped ${dump.length} unsent ${conf.type} payloads`);
            for (const d of dump) {
                await sendGeneratedDescriptions(d);
                markSentDb(d.id, conf.type);
            }
        }
    }

    logOk("Done!");
}

main().then();