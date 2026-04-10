import chalk from "chalk";
import {prompt} from "../interfaces/ollama";
import {writeToDb} from "../interfaces/sqlite";
import {cleanOutput} from "../helpers/cleanOutput";
import {Payload} from "../types/Payload";
import {MODEL, PAYLOAD_CONFIGS, THINK} from "../../config";
import SYSTEM_PROMPT from "../../tuning/system.js";

const recentTimes: number[] = [];
const MAX_HISTORY = 10;

function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3_600_000) return `${(ms / 60_000).toFixed(1)}min`;
    return `${(ms / 3_600_000).toFixed(1)}h`;
}

function median(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export async function generatePayloadOutput(p: Payload, remaining?: number): Promise<Payload> {
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
    const start = Date.now();
    let result = await prompt(
        SYSTEM_PROMPT,
        userPrompt,
    );
    const elapsed = Date.now() - start;
    recentTimes.push(elapsed);
    if (recentTimes.length > MAX_HISTORY) recentTimes.shift();

    let doneMsg = `  Done in ${formatDuration(elapsed)}`;
    if (remaining != null && remaining > 0 && recentTimes.length > 0) {
        const eta = median(recentTimes) * remaining;
        doneMsg += ` — ETA ${formatDuration(eta)}`;
    }
    console.log(chalk.dim(doneMsg));

    result = cleanOutput(result);

    p.output = result;
    p.model = MODEL;
    p.think = THINK;
    writeToDb(p);
    return p;
}