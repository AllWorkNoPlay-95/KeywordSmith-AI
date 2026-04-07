const PRODUCT_PROMPT = `
Write a single SEO-optimized product description following the system instructions.
You will receive the product name, and optionally additional metadata. Use them as follows:
- Brand: mention it naturally in the text.
- EAN / Manufacturer code: use only for identification context, do not include in the output.
- Product metadata: use to inform the description, but do not copy it verbatim.

Constraints:
- Length: 180–220 words.
- Begin with an <h2> tag containing the exact product name provided below.
- Structure the text with:
  1. <p> An engaging opening highlighting what the product is and why it’s useful. </p>
  2. <p> A clear description of benefits and typical contexts where the product shines. </p>
  3. <p> A persuasive closing with a subtle call to action. </p>
- Naturally weave in semantic keyword variants of the product name (synonyms, related terms).

The Product is: `
module.exports = PRODUCT_PROMPT;