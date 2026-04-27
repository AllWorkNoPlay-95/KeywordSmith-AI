import {logInfo, logOk} from "../cli/styles";
import {getUnsentDb, markSentDb} from "../interfaces/sqlite";
import {sendGeneratedDescriptions} from "../send/generatedDescriptions";

(async () => {
    const items = getUnsentDb("product");
    const total = items.length;
    const startTime = Date.now();
    for (let i = 0; i < total; i++) {
        const tc = items[i];
        const current = i + 1;
        const elapsed = Date.now() - startTime;
        const avgMs = current > 1 ? elapsed / i : 0;
        const remaining = avgMs > 0 ? Math.ceil((total - current) * avgMs / 1000) : 0;
        const eta = remaining > 0 ? `ETA: ${remaining}s` : "";
        logInfo(`Sending product ${current}/${total} (${(current / total * 100).toFixed(1)}%): ${tc.name} ${eta}`);
        await sendGeneratedDescriptions(tc);
        markSentDb(tc.id, "product");
        logOk(`${tc.name} sent!`);
    }
})().then(() => logOk("Products sent!"));