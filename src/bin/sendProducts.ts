import {logOk} from "../cli/styles";
import {getAllIdsDb, readFromDb} from "../interfaces/sqlite";
import {Payload} from "../types/Payload";
import {sendGeneratedDescriptions} from "../send/generatedDescriptions";

(async () => {
    const ids = getAllIdsDb("product");
    for (const id of ids) {
        const tc = readFromDb(parseInt(String(id)), "product") as Payload;
        await sendGeneratedDescriptions(tc);
        logOk(`${tc.name} sent!`);
    }
})().then(() => logOk("Products sent!"));