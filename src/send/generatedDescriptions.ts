import axios from "axios";
import {PAYLOAD_CONFIGS, TOKEN} from "../../config";
import {Payload} from "../types/Payload";

export async function sendGeneratedDescriptions(pay: Payload): Promise<void> {
    try {
        const data = {
            token: TOKEN,
            id: pay.id,
            description: pay.output
        };
        await axios.post(PAYLOAD_CONFIGS.find(
            p => p.type === pay.type).up, data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to send ${pay.type}: ${error.message}`);
        }
        throw error;
    }
}