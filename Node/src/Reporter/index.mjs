import {add} from "../db.mjs"
import {config} from "../utils.mjs"
import {log, error} from "./utils.mjs"
import {writeApi} from "../log.mjs"
import {Point} from '@influxdata/influxdb-client'

async function report({type, s, steak, patchId, recipe}){
    const data = {
        type, s, completeness: steak.done,
        node: config.node.id
    };
    log("[report]", data);
    await add("result", data);

    if (Math.abs(steak.done - 100) < 0.1){
        await add("strategy", {type, s, node: config.node.id});
    }

    const point = new Point(`steak`)
        .tag('type', type)
        .tag('node', config.node.id)
        .tag("patch", patchId)
        .stringField("id", steak.id)
        .floatField('value', 100 - Math.abs(steak.done - 100))
        .floatField('recipe', recipe);
    writeApi.writePoint(point);
}

export {report};