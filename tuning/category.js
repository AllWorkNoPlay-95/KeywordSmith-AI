const CATEGORY_PROMPT = `
Write a single SEO-optimized category description for this category following the system instructions.  

Constraints:
- Length: 250–300 words.
- Begin with <h2>{CATEGORY_NAME}</h2>.
- Structure the text with a short engaging intro, a clear explanation of benefits and common use cases (school, office, home, creative projects), and end with a subtle call to action.
- Use <p> for paragraphs and <strong> to emphasize key terms (but keep emphasis natural and not excessive).
- Do not include any placeholder text, explanations, or instructions — only return the ready-to-use HTML description.

The Category is: `

module.exports = CATEGORY_PROMPT;