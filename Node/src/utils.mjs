import * as fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, "../config/config.json");
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, {encoding: "utf8"}));

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