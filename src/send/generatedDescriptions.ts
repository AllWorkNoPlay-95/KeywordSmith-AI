import axios from "axios";
import {PAYLOAD_CONFIGS, TOKEN} from "../../config";
import {Payload} from "../types/Payload";
import {logWarn} from "../cli/styles";
import {sleep} from "../helpers/sleep";

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 2000;

export async function sendGeneratedDescriptions(pay: Payload): Promise<void> {
    const config = PAYLOAD_CONFIGS.find(p => p.type === pay.type);
    if (!config) {
        throw new Error(`No config found for payload type: ${pay.type}`);
    }
    const data = {
        token: TOKEN,
        id: pay.id,
        description: pay.output
    };
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await axios.post(config.up, data);
            return;
        } catch (err) {
            lastError = err;
            if (attempt === MAX_RETRIES) break;
            const backoff = BASE_BACKOFF_MS * attempt;
            const msg = axios.isAxiosError(err) ? err.message : (err as Error).message;
            logWarn(`Failed to send ${pay.type} ${pay.id} (attempt ${attempt}/${MAX_RETRIES}): ${msg}. Retrying in ${backoff}ms...`);
            await sleep(backoff);
        }
    }
    const msg = axios.isAxiosError(lastError) ? lastError.message : (lastError as Error).message;
    throw new Error(`Failed to send ${pay.type} ${pay.id} after ${MAX_RETRIES} attempts: ${msg}`);
}