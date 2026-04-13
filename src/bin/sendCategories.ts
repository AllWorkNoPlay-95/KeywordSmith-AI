import {logInfo, logOk} from "../cli/styles";
import {getAllIdsDb, readFromDb} from "../interfaces/sqlite";
import {Payload} from "../types/Payload";
import {sendGeneratedDescriptions} from "../send/generatedDescriptions";

(async () => {
    const ids = getAllIdsDb("category");
    const total = ids.length;
    const startTime = Date.now();
    for (let i = 0; i < total; i++) {
        const tc = readFromDb(parseInt(String(ids[i])), "category") as Payload;
        const current = i + 1;
        const elapsed = Date.now() - startTime;
        const avgMs = current > 1 ? elapsed / i : 0;
        const remaining = avgMs > 0 ? Math.ceil((total - current) * avgMs / 1000) : 0;
        const eta = remaining > 0 ? `ETA: ${remaining}s` : "";
        logInfo(`Sending category ${current}/${total} (${(current / total * 100).toFixed(1)}%): ${tc.name} ${eta}`);
        await sendGeneratedDescriptions(tc);
        logOk(`${tc.name} sent!`);
    }
})().then(() => logOk("Categories sent!"));