import Database from "better-sqlite3";
import {SQLITE_DB_PATH} from "../config";

export function connectSqLite() {
    const db = new Database(SQLITE_DB_PATH);
    return db;
}
