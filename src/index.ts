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

        // Filter out unchanged items BEFORE generation so totals and ETA are accurate
        const toGenerate: typeof thisPayload = [];
        let skipped = 0;
        for (const item of thisPayload) {
            const itemId = parseInt(String(item.id));
            const prior = readFromDb(itemId, conf.type);
            if (
                prior
                && prior.name === item.name
                && norm(prior.full_desc) === norm(item.full_desc)
            ) {
                skipped++;
                continue;
            }
            toGenerate.push(item);
        }

        logInfo(`${conf.type}: ${toGenerate.length} to generate, ${skipped} unchanged skipped (${thisPayload.length} total from API)`);

        for (let i = 0; i < toGenerate.length; i++) {
            const thisPayloadItem = toGenerate[i];
            const current = i + 1;
            const remaining = toGenerate.length - current;
            logInfo(`Processing ${conf.type} ${current}/${toGenerate.length} (${(current / toGenerate.length * 100).toFixed(1)}%): ${thisPayloadItem.name}`);
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