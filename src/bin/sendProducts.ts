import {logError, logOk} from "../cli/styles";

(async () => {
    logError("Not ready yet!");
})().then(() => logOk("Products sent!"));