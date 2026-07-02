# KeywordSmith AI 🧠

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## A 100% Local SEO-optimized Description Generator for E-commerce

KeywordSmith AI is a CLI pipeline that leverages Ollama and open-source Large Language Models to generate
SEO-optimized product and category descriptions for e-commerce platforms. It fetches items from a remote API,
generates HTML descriptions via a local LLM, stores results in SQLite, and can upload them back to the API.
Everything runs on your machine — no cloud, no data leaks.

## Key Features

- **100% Local**: All processing stays on your machine via Ollama — no third-party cloud calls
- **Multi-type Generation**: Supports product descriptions, category descriptions, and compact category summaries (`category_short`)
- **SEO-optimized HTML Output**: Clean HTML using only `<h2>`, `<strong>`, `<p>`, `<ul>`, and `<li>` tags — no classes or IDs
- **Technical Description Awareness**: Uses the supplier's sanitized source description (`source_desc`) as an authoritative technical reference, weaving real specs into the prose and optionally adding a bulleted technical characteristics section for technical products
- **Web Crawler Fallback** (opt-in): When a product has no supplier description, searches the web by EAN via Ollama Web Search, verifies the match (EAN / manufacturer code / brand), and caches a verified technical description in SQLite — so the same EAN is never searched twice
- **Flexible Pipeline**: Fetch -> Generate -> Store -> Upload, with CLI flags for fine-grained control
- **Smart Deduplication**: Skips already-generated items using SQLite tracking with upsert-on-conflict
- **Upload Modes**: Upload descriptions one-by-one during generation (`--upload=during`) or batch after (`--upload=after`)
- **Preview Mode**: Test LLM output on a sample before running the full pipeline
- **Rich CLI Output**: Color-coded logging with progress percentages via Chalk

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollama.ai/) installed and running on your system
- A supported LLM model (recommended: `gemma4:26b`, alternatives: `llama3.1:8b`, `mixtral:8x22b`, `qwen2.5:7b`)

### Installing Ollama

1. Visit [Ollama.ai](https://ollama.ai/)
2. Download and install for your operating system
3. Pull the recommended model: `ollama pull gemma4:26b`

## Installation

```bash
# Clone the repository
git clone https://github.com/AllWorkNoPlay-95/KeywordSmith-AI.git

# Navigate to the project directory
cd KeywordSmith-AI

# Install dependencies
npm install

# Create the .env file based on .env.example
cp .env.example .env
```

## Configuration

Edit the `.env` file to configure the following parameters:

| Variable | Description | Default |
|---|---|---|
| `API_TOKEN` | API authentication token | — |
| `API_DOWN_ROOT` | Base URL for fetching data | — |
| `API_UP_ROOT` | Base URL for uploading descriptions | Falls back to `API_DOWN_ROOT` |
| `API_CATEGORIES_DOWN_URL` | Categories fetch endpoint path | — |
| `API_PRODUCTS_DOWN_URL` | Products fetch endpoint path | — |
| `API_CATEGORIES_UP_URL` | Categories upload endpoint path | — |
| `API_PRODUCTS_UP_URL` | Products upload endpoint path | — |
| `CATEGORIES_TARGET_KEY` | JSON key to extract category name | `name` |
| `PRODUCTS_TARGET_KEY` | JSON key to extract product name | `name` |
| `MODEL` | Ollama model to use | `gemma4:26b` |
| `LANGUAGE` | Content generation language | `en` |
| `COMPANY_NAME` | Your company name for contextual generation | — |
| `THINK` | Enable LLM thinking/reasoning mode | `false` |
| `SQLITE_DB_PATH` | Local database path | `./db.sqlite` |
| `OLLAMA_API_KEY` | Ollama API key, required for Ollama's web search capability | — |
| `WEB_SEARCH` | Enable the web-crawler fallback inline during `npm run dev` (opt-in — see [Web Crawler](#web-crawler-fallback)) | `false` |
| `WEB_SEARCH_MAX_RESULTS` | Max search results requested per EAN lookup | `5` |

## Usage

### Core Commands

```bash
npm run dev              # Run full pipeline (fetch + generate for all types)
npm run products         # Generate product descriptions only
npm run categories       # Generate category descriptions only
npm run categoriesShort  # Generate compact category summaries only
npm run preview          # Preview LLM output on a small product sample
```

### Upload Commands

```bash
npm run sendCategories   # Upload all generated category descriptions to API
npm run sendProducts     # Upload all generated product descriptions to API (stub)
```

### CLI Flags

Flags are passed via `node-args` syntax:

```bash
# Filter to specific type(s)
npm run dev -- --only=product
npm run dev -- --only=category,category_short

# Upload as each description is generated
npm run dev -- --upload=during

# Batch upload everything after generation completes
npm run dev -- --upload=after
```

### Utility Commands

```bash
npm run prompts          # Print all resolved prompts and current model/settings
npm run nuke             # Delete the local SQLite database
npm run migrate          # Apply any pending SQLite schema migrations
npm test                 # Run Jest tests
```

### Web Crawler Fallback

Many products don't have a supplier-provided technical description (`source_desc`). For those, KeywordSmith can
search the web by EAN, verify the result actually matches the product (EAN / manufacturer code / brand
corroboration), extract a technical description, and cache it in SQLite (`product_tech_sources`) so the same
EAN is never searched twice. It's **opt-in** — it never runs during a plain `npm run dev`:

```bash
npm run webSearch                  # Backfill: search + cache for all eligible products, then exit
npm run dev -- --web-search        # Search+cache inline, live, during the normal pipeline
WEB_SEARCH=true npm run dev        # Same as --web-search, via .env
```

Requires an [Ollama API key](https://ollama.com/settings/keys) set as `OLLAMA_API_KEY` (Ollama's web search is a
cloud capability, not local). Once a product's EAN is cached, subsequent `npm run dev` runs reuse the cached
result at no extra cost — no flag needed.

## Architecture

The pipeline follows a **Fetch -> Generate -> Store -> Upload** flow:

```
Remote API ──fetch──> Item list ──LLM──> HTML description ──save──> SQLite
                                                                      │
                                                            (optional upload)
                                                                      │
                                                                      v
                                                                 Remote API
```

## Project Structure

```
KeywordSmith-AI/
├── config.ts            # Central registry — env vars, API URLs, payload type configs
├── tuning/              # Prompt templates (CommonJS)
│   ├── system.js        # Shared system prompt (company name, language, excluded words)
│   ├── product.js       # Product-specific user prompt
│   ├── category.js      # Category-specific user prompt
│   ├── category_short.js # Compact category summary prompt
│   ├── webExtract.js    # Verification + extraction prompt for the web crawler
│   └── exclude.js       # Words/phrases to exclude from output
├── src/
│   ├── index.ts         # Main entry point & pipeline orchestrator
│   ├── types/           # TypeScript type definitions (Payload, PayloadType, TechCacheRow)
│   ├── cli/             # Styled CLI logging (chalk-based)
│   ├── fetch/           # API data retrieval
│   ├── prompts/         # LLM prompt assembly & generation orchestration
│   ├── interfaces/      # Ollama, Ollama web search, and SQLite wrappers
│   ├── crawl/           # EAN web-search crawler (search, verify, extract, cache)
│   ├── helpers/         # Output cleaning (strips markdown fences from LLM output)
│   ├── send/            # Upload generated descriptions to API
│   ├── bin/             # Standalone scripts (sendCategories, sendProducts, nuke, preview, webSearch)
│   └── __tests__/       # Jest tests
├── .env                 # Environment variables (not in repo)
├── .env.example         # Template for .env
└── db.sqlite            # Local SQLite database (ephemeral, deletable via npm run nuke)
```

## SQLite Schema

### `ai_descriptions`

Generated descriptions, with automatic schema migration for older databases:

| Column | Type | Notes |
|---|---|---|
| `pk` | INTEGER | Primary key |
| `id` | INTEGER | Item ID from API |
| `name` | TEXT | Item name |
| `output` | TEXT | Generated HTML description |
| `type` | VARCHAR(255) | `product`, `category`, or `category_short` |
| `ean` | TEXT | Product EAN code |
| `cod_produttore` | TEXT | Manufacturer code |
| `brand` | TEXT | Product brand |
| `full_desc` | TEXT | Original full description from API |
| `source_desc` | TEXT | Sanitized supplier technical description from API, used as an authoritative technical source in the prompt |
| `web_desc` | TEXT | Technical description found and verified by the [web crawler](#web-crawler-fallback), used only when `source_desc` is absent |
| `model` | TEXT | LLM model used for generation |
| `think` | INTEGER | Whether thinking/reasoning mode was enabled (0/1) |
| `created_at` | TEXT | Row creation timestamp |
| `updated_at` | TEXT | Last update timestamp |

Unique index on `(id, type)` — upserts on conflict.

### `product_tech_sources`

Cache of web-crawler results, keyed by EAN, so a product is only searched for once (see
[Web Crawler Fallback](#web-crawler-fallback)):

| Column | Type | Notes |
|---|---|---|
| `pk` | INTEGER | Primary key |
| `ean` | TEXT | Search key (unique) |
| `product_id` | INTEGER | Product ID from API |
| `name`, `cod_produttore`, `brand` | TEXT | Product identity snapshot at search time |
| `description` | TEXT | Extracted technical description (`NULL` if no verified match) |
| `source_url` | TEXT | URL the description was extracted from |
| `status` | TEXT | `found` or `not_found` |
| `confidence` | REAL | LLM-reported match confidence (0–1) |
| `model` | TEXT | LLM model used for verification/extraction |
| `created_at` / `updated_at` | TEXT | Timestamps |

Unique index on `ean` — upserts on conflict. Negative results (`not_found`) are cached too, so unmatched
products aren't re-searched on every run.

## How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Contact

Samuele Mancuso - [@AllWorkNoPlay-95](https://github.com/AllWorkNoPlay-95)

Project Link: [https://github.com/AllWorkNoPlay-95/KeywordSmith-AI](https://github.com/AllWorkNoPlay-95/KeywordSmith-AI)

## Production Use

KeywordSmith AI is actively used in production by [KartoClick](https://kartoclick.it), powering SEO content generation
for their e-commerce catalog.

---

</> with <3 by [AllWorkNoPlay-95](https://github.com/AllWorkNoPlay-95)