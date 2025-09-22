import Database from "better-sqlite3";
import {SQLITE_DB_PATH} from "../config";
import {Payload} from "../types/Payload";

export function connectSqLite() {
    const db = new Database(SQLITE_DB_PATH);
    db.prepare(`CREATE TABLE IF NOT EXISTS ai_descriptions
                (
                    pk     INTEGER PRIMARY KEY,
                    id     INTEGER,
                    name   TEXT,
                    output TEXT,
                    type   VARCHAR(255) NOT NULL
                );
    `).run();

    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS control
        ON ai_descriptions (id, type);`).run();
    return db;
}

export function writeToDb(pay: Payload) {
    if (pay.output.length === 0) return;
    const db = connectSqLite();
    const stmt = db.prepare(`
        INSERT INTO ai_descriptions (id, name, output)
        VALUES (?, ?, ?)
        ON CONFLICT
            (id)
        DO UPDATE SET
            name = excluded.name,
            output = excluded.output
    `);
    stmt.run(pay.id, pay.name, pay.output);
}

export function readFromDb(id: number, type: Payload["type"]): Payload {
    const db = connectSqLite();
    const stmt = db.prepare(`
        SELECT *
        FROM ai_descriptions
        WHERE id = ?
          AND type = ?
    `);
    const result = stmt.get(id, type);
    return result as Payload;
}

export function getAllIdsDb(type: Payload["type"]): number[] {
    const db = connectSqLite();
    const stmt = db.prepare(`
        SELECT id
        FROM ai_descriptions
        WHERE type = ?
    `);
    return stmt.pluck().all(type) as number[];
}