import ollama from 'ollama';
import {MODEL, THINK} from "../../config";
import {logWarn} from "../cli/styles";
import {sleep} from "../helpers/sleep";

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 2000;

export async function test() {
    const response = await ollama.chat({
        model: MODEL,
        messages: [
            {
                role: 'user',
                content: "Hello World! Reply with 3 words."
            }
        ]
    });

    if (response.message.content) {
        return response;
    } else
        throw new Error("No response from Ollama");
}

export async function prompt(sys: string, p: string) {
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await ollama.chat({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: sys
                    },
                    {
                        role: 'user',
                        content: p
                    }
                ],
                think: THINK,
            });

            const content = response.message.content || response.message.thinking || "";
            if (content) {
                return content;
            }
            throw new Error("Empty response from Ollama");
        } catch (err) {
            lastError = err;
            if (attempt === MAX_RETRIES) break;
            const backoff = BASE_BACKOFF_MS * attempt;
            logWarn(`Ollama call failed (attempt ${attempt}/${MAX_RETRIES}): ${(err as Error).message}. Retrying in ${backoff}ms...`);
            await sleep(backoff);
        }
    }
    throw new Error(`Ollama failed after ${MAX_RETRIES} attempts: ${(lastError as Error).message}`);
}

export async function promptJson<T = any>(sys: string, p: string): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await ollama.chat({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: sys
                    },
                    {
                        role: 'user',
                        content: p
                    }
                ],
                format: "json",
                think: THINK,
                // Structured extraction can legitimately produce a long JSON payload
                // (e.g. a comprehensive technical description) — never let the
                // server's default output-length cap silently truncate it.
                options: {num_predict: -1},
            });

            const content = response.message.content || response.message.thinking || "";
            if (!content) throw new Error("Empty response from Ollama");
            return JSON.parse(content) as T;
        } catch (err) {
            lastError = err;
            if (attempt === MAX_RETRIES) break;
            const backoff = BASE_BACKOFF_MS * attempt;
            logWarn(`Ollama JSON call failed (attempt ${attempt}/${MAX_RETRIES}): ${(err as Error).message}. Retrying in ${backoff}ms...`);
            await sleep(backoff);
        }
    }
    throw new Error(`Ollama JSON call failed after ${MAX_RETRIES} attempts: ${(lastError as Error).message}`);
}