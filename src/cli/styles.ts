import chalk from "chalk";

export function logOk(str: string): void {
    console.log(chalk.bgGreen.white(" ✅ OK ") + " " + str);
}

export function logError(str: string): void {
    console.log(chalk.bgRed.white(" 💥 ERR ") + " " + str);
}

export function logWarn(str: string): void {
    console.log(chalk.bgYellow.black(" ⚠️ WARN ") + " " + str);
}

export function logInfo(str: string): void {
    console.log(chalk.bgBlue.white(" ℹ️ INFO ") + " " + str);
}

export function logDebug(str: string): void {
    console.log(chalk.bgWhite.black(" 🔧 DEBUG ") + " " + str);
}