# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

KeywordSmith AI is a local CLI tool that generates SEO-optimized product and category descriptions for e-commerce using Ollama and open-source LLMs. It fetches items from a remote API, generates HTML descriptions via a local LLM, stores results in SQLite, and can upload them back to the API. Used in production by KartoClick (kartoclick.it).

## Commands

```bash
npm run dev              # Run main pipeline (fetch + generate for all types)
npm run products         # Generate product descriptions only
npm run categories       # Generate category descriptions only
npm run sendCategories   # Upload generated category descriptions to API
npm run sendProducts     # Upload generated product descriptions to API (not implemented yet)
npm run nuke             # Delete the local SQLite database
npm test                 # Run Jest tests
```

The main entry (`src/index.ts`) accepts CLI flags via `node-args`:
- `--only=product` or `--only=category` to filter payload types
- `--upload=during` to upload each description as it's generated
- `--upload=after` to batch-upload all descriptions after generation

## Architecture

The pipeline flow is: **Fetch -> Generate -> Store -> (optionally) Upload**.

**Config layer** (`config.ts` at project root): Loads `.env` via dotenv, defines `PAYLOAD_CONFIGS` array that maps each payload type (product/category) to its API endpoints, target key, and prompt template. This is the central registry — adding a new content type means adding an entry here.

**Prompt system** (`tuning/*.js`): CommonJS modules exporting prompt strings. `system.js` is the shared system prompt (references `COMPANY_NAME`, `LANGUAGE`, and excluded words from `exclude.js`). `product.js` and `category.js` are type-specific user prompts appended before the item name. These are JS (not TS) because they use `require()` to pull config values at load time.

**Core pipeline:**
- `src/fetch/sourceData.ts` — fetches items from the remote API based on `PAYLOAD_CONFIGS`
- `src/prompts/payload.ts` — orchestrates generation: calls Ollama, cleans output, writes to SQLite
- `src/interfaces/ollama.ts` — thin wrapper around the `ollama` npm package for chat completions
- `src/interfaces/sqlite.ts` — CRUD operations on `ai_descriptions` table using `better-sqlite3`
- `src/helpers/cleanOutput.ts` — strips markdown code fences from LLM output
- `src/send/generatedDescriptions.ts` — POSTs generated descriptions back to the API

**Standalone scripts** (`src/bin/`): `sendCategories.ts` and `nuke.ts` are independently runnable. `sendProducts.ts` is a stub.

**SQLite schema**: Single table `ai_descriptions(pk, id, name, output, type)` with a unique index on `(id, type)`. Uses upsert on conflict.

## Key Details

- Runtime: Node.js with `ts-node` (no build step, runs TypeScript directly)
- LLM output is HTML using only `<h2>`, `<strong>`, and `<p>` tags — no classes, IDs, or other tags
- The `.env` file is required; see `.env.example` for all variables
- `db.sqlite` is the local database file (checked into repo but should be treated as ephemeral — `npm run nuke` deletes it)
- Tests are in `src/__tests__/` as `.test.js` files (not TypeScript), using Jest with ts-jest transform
