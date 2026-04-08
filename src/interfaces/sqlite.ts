import Database from "better-sqlite3";
import {SQLITE_DB_PATH} from "../../config";
import {Payload} from "../types/Payload";

export function connectSqLite() {
    const db = new Database(SQLITE_DB_PATH);
    db.prepare(`CREATE TABLE IF NOT EXISTS ai_descriptions
                (
                    pk         INTEGER PRIMARY KEY,
                    id         INTEGER,
                    name       TEXT,
                    output     TEXT,
                    type       VARCHAR(255) NOT NULL,
                    ean             TEXT,
                    cod_produttore  TEXT,
                    brand           TEXT,
                    full_desc      TEXT,
                    model          TEXT,
                    think          INTEGER DEFAULT 0,
                    created_at     TEXT DEFAULT (datetime('now')),
                    updated_at     TEXT DEFAULT (datetime('now'))
                );
    `).run();

    // Add columns if migrating from old schema
    const cols = (db.pragma('table_info(ai_descriptions)') as any[]).map((c: any) => c.name);
    for (const col of ['ean', 'cod_produttore', 'brand', 'full_desc', 'model', 'think', 'created_at', 'updated_at']) {
        if (!cols.includes(col)) {
            db.prepare(`ALTER TABLE ai_descriptions ADD COLUMN ${col} TEXT`).run();
        }
    }

    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS control
        ON ai_descriptions (id, type);`).run();
    return db;
}

export function writeToDb(pay: Payload) {
    if (pay.output.length === 0) return;
    const db = connectSqLite();
    const stmt = db.prepare(`
        INSERT INTO ai_descriptions (id, name, output, type, ean, cod_produttore, brand, full_desc, model, think)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT
            (id, type)
        DO UPDATE SET
            name = excluded.name,
            output = excluded.output,
            ean = excluded.ean,
            cod_produttore = excluded.cod_produttore,
            brand = excluded.brand,
            full_desc = excluded.full_desc,
            model = excluded.model,
            think = excluded.think,
            updated_at = datetime('now')
    `);
    stmt.run(pay.id, pay.name, pay.output, pay.type, pay.ean ?? null, pay.cod_produttore ?? null, pay.brand ?? null, pay.full_desc ?? null, pay.model ?? null, pay.think ? 1 : 0);
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

export function dumpDb(type: Payload["type"]): Payload[] {
    const db = connectSqLite();
    const stmt = db.prepare(`
        SELECT id, name, output, type
        FROM ai_descriptions
        WHERE type = ?
    `);
    return stmt.all(type) as Payload[];
}