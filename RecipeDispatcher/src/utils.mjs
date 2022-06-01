import * as fs from "fs";

const config = fs.readFileSync("../config/config.json")

function log(...args) {
    console.log(`[*] [RecipeDispatcher]`, ...args);
}

function error(...args){
    console.error(`[-] [RecipeDispatcher]`, ...args);
}

export {config, log, error};