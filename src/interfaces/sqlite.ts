import Database from "better-sqlite3";
import {SQLITE_DB_PATH} from "../../config";
import {Payload} from "../types/Payload";
import {TechCacheRow} from "../types/TechSource";

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
                    source_desc    TEXT,
                    web_desc       TEXT,
                    model          TEXT,
                    think          INTEGER DEFAULT 0,
                    created_at     TEXT DEFAULT (datetime('now')),
                    updated_at     TEXT DEFAULT (datetime('now')),
                    sent_at        TEXT
                );
    `).run();

    // Add columns if migrating from old schema
    const cols = (db.pragma('table_info(ai_descriptions)') as any[]).map((c: any) => c.name);
    for (const col of ['ean', 'cod_produttore', 'brand', 'full_desc', 'source_desc', 'web_desc', 'model', 'think', 'created_at', 'updated_at', 'sent_at']) {
        if (!cols.includes(col)) {
            db.prepare(`ALTER TABLE ai_descriptions ADD COLUMN ${col} TEXT`).run();
        }
    }

    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS control
        ON ai_descriptions (id, type);`).run();

    // Cache of web-crawled technical descriptions, keyed by EAN, so a product is
    // only searched for once (see src/crawl/technicalSource.ts).
    db.prepare(`CREATE TABLE IF NOT EXISTS product_tech_sources
                (
                    pk              INTEGER PRIMARY KEY,
                    ean             TEXT,
                    product_id      INTEGER,
                    name            TEXT,
                    cod_produttore  TEXT,
                    brand           TEXT,
                    description     TEXT,
                    source_url      TEXT,
                    status          TEXT,
                    confidence      REAL,
                    model           TEXT,
                    created_at      TEXT DEFAULT (datetime('now')),
                    updated_at      TEXT DEFAULT (datetime('now'))
                );
    `).run();

    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS product_tech_sources_ean
        ON product_tech_sources (ean);`).run();

    return db;
}

export function writeToDb(pay: Payload) {
    if (pay.output.length === 0) return;
    const db = connectSqLite();
    const stmt = db.prepare(`
        INSERT INTO ai_descriptions (id, name, output, type, ean, cod_produttore, brand, full_desc, source_desc, web_desc, model, think)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT
            (id, type)
        DO UPDATE SET
            name = excluded.name,
            output = excluded.output,
            ean = excluded.ean,
            cod_produttore = excluded.cod_produttore,
            brand = excluded.brand,
            full_desc = excluded.full_desc,
            source_desc = excluded.source_desc,
            web_desc = excluded.web_desc,
            model = excluded.model,
            think = excluded.think,
            updated_at = datetime('now'),
            sent_at = NULL
    `);
    stmt.run(pay.id, pay.name, pay.output, pay.type, pay.ean ?? null, pay.cod_produttore ?? null, pay.brand ?? null, pay.full_desc ?? null, pay.source_desc ?? null, pay.web_desc ?? null, pay.model ?? null, pay.think ? 1 : 0);
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

export function getUnsentDb(type: Payload["type"]): Payload[] {
    const db = connectSqLite();
    const stmt = db.prepare(`
        SELECT id, name, output, type, sent_at
        FROM ai_descriptions
        WHERE type = ?
          AND sent_at IS NULL
          AND output IS NOT NULL
          AND output != ''
    `);
    return stmt.all(type) as Payload[];
}

export function markSentDb(id: number, type: Payload["type"]): void {
    const db = connectSqLite();
    db.prepare(`
        UPDATE ai_descriptions
        SET sent_at = datetime('now')
        WHERE id = ?
          AND type = ?
    `).run(id, type);
}

// --- Web-crawled technical description cache (product_tech_sources) ---
// Keyed by EAN so a product is only web-searched once; see src/crawl/technicalSource.ts.

export function writeTechCache(row: TechCacheRow): void {
    const db = connectSqLite();
    const stmt = db.prepare(`
        INSERT INTO product_tech_sources (ean, product_id, name, cod_produttore, brand, description, source_url, status, confidence, model)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT
            (ean)
        DO UPDATE SET
            product_id = excluded.product_id,
            name = excluded.name,
            cod_produttore = excluded.cod_produttore,
            brand = excluded.brand,
            description = excluded.description,
            source_url = excluded.source_url,
            status = excluded.status,
            confidence = excluded.confidence,
            model = excluded.model,
            updated_at = datetime('now')
    `);
    stmt.run(row.ean, row.product_id ?? null, row.name ?? null, row.cod_produttore ?? null, row.brand ?? null, row.description ?? null, row.source_url ?? null, row.status, row.confidence ?? null, row.model ?? null);
}

export function readTechCache(ean: string): TechCacheRow | undefined {
    const db = connectSqLite();
    const stmt = db.prepare(`
        SELECT *
        FROM product_tech_sources
        WHERE ean = ?
    `);
    return stmt.get(ean) as TechCacheRow | undefined;
}

// Convenience accessor for the generation pipeline: returns the cached
// technical description text only if a verified match was found, else undefined.
export function getCachedTechDescription(ean: string | undefined): string | undefined {
    if (!ean) return undefined;
    const row = readTechCache(ean);
    if (row && row.status === "found" && row.description) return row.description;
    return undefined;
}