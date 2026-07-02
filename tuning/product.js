const PRODUCT_PROMPT = `
Write a single SEO-optimized product description following the system instructions.
You will receive the product name, and optionally additional metadata. Use them as follows:
- Brand: mention it naturally in the text.
- EAN / Manufacturer code: use only for identification context, do not include in the output.
- Product metadata: use to inform the description, but do not copy it verbatim.
- Supplier technical description: authoritative technical source. Extract real specs (materials, dimensions, capacity, compatibility, technical features) from it; never invent specs not present here.
- Technical description found online (verified authoritative source): used only when the supplier did not provide one. Treat it exactly like the supplier technical description above — same authority, same extraction rules.

Constraints:
- Length: 180–220 words by default — this is indicative, not a hard cap. If a technical description (from the supplier or found online) is provided, scale the length up based on its complexity and richness: a short or simple source only justifies a modest extension, while a long or highly detailed technical source can justify a much longer, essentially unbounded description, as long as every extra word covers real content from the source. Do not exceed roughly 3000 words under any circumstances. Never pad with invented or repeated content just to reach a higher word count.
- Begin with an <h2> tag containing the exact product name provided below.
- Structure the text with:
  1. <p> An engaging opening highlighting what the product is and why it’s useful. </p>
  2. <p> A clear description of benefits and typical contexts where the product shines. </p>
  3. <p> A persuasive closing with a subtle call to action. </p>
- Naturally weave in semantic keyword variants of the product name (synonyms, related terms).
- Weave the technical facts from the provided technical description (supplier or web-sourced) naturally into the persuasive paragraphs (highlight key specs with <strong>).
- Only for technical/technological products (or when a structured spec overview clearly adds value), append a final section: an <h2> with a "technical characteristics" heading (in the target language) followed by a <ul> bulleted list of the specs. For simple/non-technical products, do NOT add this section — keep the info woven into the prose.
- The length constraint above applies to the prose paragraphs; an optional technical specifications list is additional and not counted toward it.

The Product is: `
module.exports = PRODUCT_PROMPT;