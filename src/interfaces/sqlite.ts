import Database from "better-sqlite3";
import {SQLITE_DB_PATH} from "../config";
import {Product} from "../fetch/products";
import {Category} from "../fetch/categories";

export function connectSqLite() {
    const db = new Database(SQLITE_DB_PATH);
    db.prepare("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, output TEXT)").run();
    db.prepare("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT, output TEXT)").run();
    return db;
}

export function writeToDb(o: Product | Category, kind: "products" | "categories") {
    if (o.output.length === 0) return;
    const db = connectSqLite();
    const stmt = db.prepare(`
        INSERT INTO ${kind} (id, name, output)
        VALUES (?, ?, ?)
        ON CONFLICT
            (id)
        DO UPDATE SET
            name = excluded.name,
            output = excluded.output
    `);
    stmt.run(o.id, o.name, o.output);
}

export function readFromDb(id: number) {
}