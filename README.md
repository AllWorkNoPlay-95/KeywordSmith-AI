# KeywordSmith AI 🧠

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## A 100% Local SEO-optimized Description Generator for E-commerce

KeywordSmith AI is a completely local tool that runs on Ollama and open-source LLMs to generate SEO-optimized category
and product descriptions. It works entirely on your machine: no cloud, no data leaks, just fast, private, and consistent
copywriting.

## Key Features

- **100% Local**: All data remains on your device
- **Privacy Guaranteed**: No connections to third-party cloud services
- **SEO-optimized**: Generates content designed to improve organic ranking
- **Customizable**: Easily configure behavior through environment variables
- **Efficient**: Uses Ollama for optimal performance even on standard hardware

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Ollama](https://ollama.ai/) installed and configured on your system
- A supported LLM model (default: qwen2.5:7b)

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

Edit the `.env` file to configure:

- API token (if needed)
- API URLs
- Ollama LLM model to use
- Language for content generation
- Other custom parameters

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