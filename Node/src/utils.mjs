import * as fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILENAME = process.env.CONFIG_FILENAME ?? "config.json";
const CONFIG_PATH = path.join(__dirname, "../config", CONFIG_FILENAME);
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, {encoding: "utf8"}));

if (process.env.NODE_ID) config.node.id = Number(process.env.NODE_ID);
if (process.env.PORT) config.http.port = Number(process.env.PORT);

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomItem(items){
    return items[Math.floor(Math.random()*items.length)];
}

export {config, randomIntFromInterval, sleep, randomItem};