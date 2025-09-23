import {prompt} from "../interfaces/ollama";
import {writeToDb} from "../interfaces/sqlite";
import {cleanOutput} from "../helpers/cleanOutput";
import {Payload} from "../types/Payload";
import {PAYLOAD_CONFIGS} from "../../config";
import SYSTEM_PROMPT from "../../tuning/system.js";

export async function generatePayloadOutput(p: Payload): Promise<Payload> {
    const thisConfig = PAYLOAD_CONFIGS.find(c => c.type === p.type);
    let result = await prompt(
        SYSTEM_PROMPT,
        thisConfig.promptAfterSystem + p.name,
    );

    result = cleanOutput(result);

    p.output = result;
    writeToDb(p);
    return p;
}