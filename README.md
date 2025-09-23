# KeywordSmith AI 🧠

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## A 100% Local SEO-optimized Description Generator for E-commerce

KeywordSmith AI is a powerful local tool that leverages Ollama and open-source Large Language Models to generate
SEO-optimized category and product descriptions for e-commerce platforms. It operates entirely on your machine,
ensuring data privacy and delivering consistent, high-quality copywriting with HTML formatting and optimal length
for search engine visibility.

## Key Features

- **100% Local**: All data remains on your device
- **Privacy Guaranteed**: No connections to third-party cloud services
- **SEO-optimized**: Generates content designed to improve organic ranking
- **Customizable**: Easily configure behavior through environment variables
- **Efficient**: Uses Ollama for optimal performance even on standard hardware

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollama.ai/) installed and running on your system
- A supported LLM model (recommended: llama3.1:8b or mixtral:8x7b)

### Installing Ollama

1. Visit [Ollama.ai](https://ollama.ai/)
2. Download and install for your operating system
3. Pull the recommended model: `ollama pull llama3.1:8b`

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

- `API_TOKEN`: Your API authentication token
- `API_DOWN_ROOT`: Base URL for fetching data
- `API_UP_ROOT`: Base URL for sending generated descriptions
- `MODEL`: LLM model to use (default: llama3.1:8b)
- `LANGUAGE`: Content generation language (default: en)
- `COMPANY_NAME`: Your company name for contextual generation
- `SQLITE_DB_PATH`: Local database path (default: ./db.sqlite)

## Usage

KeywordSmith AI offers several commands for various purposes:

```bash
# Run in development mode
npm run dev

# Generate product descriptions
npm run products

# Generate category descriptions
npm run categories

# Reset database or configurations
npm run nuke

# Run tests
npm test
```

## Project Structure

```
KeywordSmith-AI/
├── src/
│   ├── __tests__/       # Unit and integration tests
│   ├── cli/             # Command-line interface
│   ├── fetch/           # API data retrieval functions
│   ├── interfaces/      # TypeScript interfaces and connections
│   ├── prompts/         # LLM prompt templates
│   ├── config.ts        # Centralized configuration
│   └── index.ts         # Main entry point
├── .env                 # Environment variables (not included in repo (duh!))
└── package.json         # NPM dependencies and scripts
```

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

---

</> with <3 by [AllWorkNoPlay-95](https://github.com/AllWorkNoPlay-95)