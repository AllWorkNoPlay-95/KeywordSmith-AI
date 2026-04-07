const CATEGORY_PROMPT = `
Write a single SEO-optimized category description following the system instructions.

Constraints:
- Length: 250–300 words.
- Begin with an <h2> tag containing the exact category name provided below.
- Structure the text with:
  1. <p> An engaging introduction that defines the category and its relevance to the reader. </p>
  2. <p> Key benefits and characteristics of products in this category, mentioning contexts where they are most useful. </p>
  3. <p> The variety and range available within the category — what types of options the customer can expect. </p>
  4. <p> A persuasive closing with a subtle call to action encouraging the reader to explore. </p>
- Naturally weave in semantic keyword variants of the category name (synonyms, related terms, specific subtypes).

The Category is: `

module.exports = CATEGORY_PROMPT;