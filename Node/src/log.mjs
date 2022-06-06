import {config} from "./utils.mjs";

import {InfluxDB, Point} from '@influxdata/influxdb-client'

const writeApi = new InfluxDB(config.influx.credential).getWriteApi(config.influx.org, config.influx.bucket, 'ns')

function splitTagAndData(x){
    // split tag and data
    const tags = [`[Node ${config.node.id}]`];
    const datas = [];

    let isData = false;
    for(const xx of x) {
        if (isData) datas.push(xx);
        else {
            if (typeof xx !== 'string' && !(xx instanceof String)) isData = true;
            else if (!xx.startsWith('[') || !xx.endsWith("]")) isData = true;

            if (isData) datas.push(xx);
            else tags.push(xx.slice(1, -1));
        }
    }

    return {tags, datas}
}

function log(...x){
    console.log(`[Node ${config.node.id}]`, ...x);
    const {tags, datas} = splitTagAndData(x);
}

function error(...x){
    console.error(`[Node ${config.node.id}]`, ...x);
    const {tags, datas} = splitTagAndData(x);
}

export {log, error};