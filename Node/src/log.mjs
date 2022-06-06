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

function tagAndDataToPoint({tags, datas}){
    const point = new Point(`log`)
        .timestamp(Date.now())
        .tag('node', config.node.id);

    for(const tag of tags) point.tag(tag, "1");
    for(let i = 1; i <= datas.length; i++) {
        point.stringField(i.toString(), JSON.stringify(datas[i-1], null, 2));
    }

    return point;
}

function log(...x){
    console.log(`[Node ${config.node.id}]`, ...x);
    const {tags, datas} = splitTagAndData(x);
    const point = tagAndDataToPoint({tags, datas});
    writeApi.writePoint(point);
}

function error(...x){
    console.error(`[Node ${config.node.id}]`, ...x);
    const {tags, datas} = splitTagAndData(x);
    const point = tagAndDataToPoint({tags, datas});
    writeApi.writePoint(point);
}

export {log, error, writeApi};