import {add} from "../db.mjs"
import {config} from "../utils.mjs"
import {log, error} from "./utils.mjs"

async function report({type, s, completeness}){
    const data = {
        type, s, completeness,
        node: config.node.id
    };
    log("[report]", data);
    await add("result", data);
    
    if (Math.abs(completeness - 100) < 0.1){
        await add("strategy", {type, s, node: config.node.id});
    }
}

export {report};