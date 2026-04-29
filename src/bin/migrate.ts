import Database from "better-sqlite3";
import {SQLITE_DB_PATH} from "../../config";
import {connectSqLite} from "../interfaces/sqlite";
import {logInfo, logOk} from "../cli/styles";

function listColumns(): string[] {
    const db = new Database(SQLITE_DB_PATH);
    try {
        const info = db.pragma("table_info(ai_descriptions)") as { name: string }[];
        return info.map(c => c.name);
    } finally {
        db.close();
    }
}

logInfo(`Migrating ${SQLITE_DB_PATH}`);
const before = listColumns();
connectSqLite();
const after = listColumns();
const added = after.filter(c => !before.includes(c));
if (before.length === 0) {
    logOk(`Initialized schema with ${after.length} columns`);
} else if (added.length === 0) {
    logOk("No migrations needed");
} else {
    logOk(`Added columns: ${added.join(", ")}`);
}
