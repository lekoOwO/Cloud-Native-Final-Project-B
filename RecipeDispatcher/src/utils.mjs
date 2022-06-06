import * as fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILENAME = process.env.CONFIG_FILENAME ?? "config.json";
const CONFIG_PATH = path.join(__dirname, "../config", CONFIG_FILENAME);
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, {encoding: "utf8"}));

function log(...args) {
    console.log(`[*] [RecipeDispatcher]`, ...args);
}

function error(...args){
    console.error(`[-] [RecipeDispatcher]`, ...args);
}

export {config, log, error};