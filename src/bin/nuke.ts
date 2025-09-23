import fs from "fs";
import {SQLITE_DB_PATH} from "../../config";
import {logError, logWarn} from "../cli/styles";

try {
    fs.unlinkSync(SQLITE_DB_PATH);
    logWarn(`Successfully deleted ${SQLITE_DB_PATH}`);
} catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logWarn(`File ${SQLITE_DB_PATH} does not exist`);
    } else {
        logError(`Error deleting ${SQLITE_DB_PATH}: ${error.message}`);
    }
}