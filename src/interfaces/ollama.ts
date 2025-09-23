import ollama from 'ollama';
import {MODEL} from "../../config";

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
        ]
    });

    if (response.message.content) {
        return response.message.content;
    } else
        throw new Error("No response from Ollama");
}