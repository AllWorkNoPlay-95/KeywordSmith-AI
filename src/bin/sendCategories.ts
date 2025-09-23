import {logOk} from "../cli/styles";
import {getAllIdsDb, readFromDb} from "../interfaces/sqlite";
import {Payload} from "../types/Payload";
import {sendGeneratedDescriptions} from "../send/generatedDescriptions";

(async () => {
    const ids = getAllIdsDb("category");
    for (const id of ids) {
        const tc = readFromDb(parseInt(String(id)), "category") as Payload;
        await sendGeneratedDescriptions(tc);
        logOk(`${tc.name} sent!`);
    }
})().then(() => logOk("Categories sent!"));