const PRODUCT_PROMPT = `
Write a single SEO-optimized product description for this name following the system instructions.  

Constraints:
- Length: 180–220 words.
- Begin with <h2>{PRODUCT_NAME}</h2>.
- Structure the text with:
  1. <p> An engaging opening highlighting what the product is and why it’s useful. </p>
  2. <p> A clear description of benefits and typical contexts (school, office, home, creative projects). </p>
  3. <p> A persuasive closing with a subtle call to action. </p>
- Use <strong> to emphasize key terms naturally, without overusing it.
- Do not include any placeholder text, explanations, or instructions — only return the ready-to-use HTML description.

The Product is: `
module.exports = PRODUCT_PROMPT;