import chalk from "chalk";
import SYSTEM_PROMPT from "../../tuning/system.js";
import {PAYLOAD_CONFIGS, MODEL, THINK} from "../../config";

const sep = "─".repeat(60);

console.log(chalk.bgMagenta.white(" MODEL ") + ` ${MODEL}` + chalk.gray(` (think: ${THINK})`) + "\n");

console.log(chalk.bgCyan.white(" SYSTEM PROMPT "));
console.log(SYSTEM_PROMPT.trim());
console.log(sep + "\n");

for (const conf of PAYLOAD_CONFIGS) {
    console.log(chalk.bgYellow.black(` ${conf.type.toUpperCase()} PROMPT `));
    console.log(conf.promptAfterSystem.trim());
    console.log(sep + "\n");
}
