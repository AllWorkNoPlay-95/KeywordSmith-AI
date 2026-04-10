import chalk from "chalk";
import {prompt} from "../interfaces/ollama";
import {writeToDb} from "../interfaces/sqlite";
import {cleanOutput} from "../helpers/cleanOutput";
import {Payload} from "../types/Payload";
import {MODEL, PAYLOAD_CONFIGS, THINK} from "../../config";
import SYSTEM_PROMPT from "../../tuning/system.js";

export async function generatePayloadOutput(p: Payload): Promise<Payload> {
    const thisConfig = PAYLOAD_CONFIGS.find(c => c.type === p.type);
    let userPrompt = thisConfig.promptAfterSystem + p.name;
    if (p.type === "product") {
        if (p.brand) userPrompt += `\nBrand: ${p.brand}`;
        if (p.cod_produttore) userPrompt += `\nManufacturer code: ${p.cod_produttore}`;
        if (p.ean) userPrompt += `\nEAN: ${p.ean}`;
        if (p.full_desc) userPrompt += `\nProduct metadata: ${p.full_desc}`;
    }
    console.log(chalk.dim(`  System: ${SYSTEM_PROMPT.replaceAll("\n", " ")}`));
    console.log(chalk.dim(`  Prompt: ${userPrompt.replaceAll("\n", " ")}`));
    console.log(chalk.dim(`  Thinking: ${THINK ? "on" : "off"}`));
    let result = await prompt(
        SYSTEM_PROMPT,
        userPrompt,
    );

    result = cleanOutput(result);

    p.output = result;
    p.model = MODEL;
    p.think = THINK;
    writeToDb(p);
    return p;
}