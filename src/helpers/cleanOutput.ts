export function cleanOutput(output: string) {
    output = output.replace(/```/g, "");
    output = output.replace(/^html|html$/g, "");
    output = output.trim()
    return output;
}