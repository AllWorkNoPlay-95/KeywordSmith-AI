const SHORT_CATEGORY_PROMPT = `
Write a single short SEO-optimized category description following the system instructions.
This text will appear in compact UI areas such as product pages or mega menus, so it must be concise.

Constraints:
- Length: 40–60 words.
- Do NOT include any heading tags (<h2>).
- Write a single <p> that briefly describes the category, its key appeal, and naturally includes semantic keyword variants of the category name.
- Tone: informative and inviting, never salesy.

The Category is: `

module.exports = SHORT_CATEGORY_PROMPT;
