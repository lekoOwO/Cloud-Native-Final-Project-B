import {loadOne, remove} from "../db.mjs"
import {config} from "../utils.mjs"
import {log, error} from "./utils.mjs"
// Init constants

let S1_CONST = (await loadOne("strategy", {type: "1", node: config.node.id, removed: false}, {sort:{$natural:-1}}))?.s;
let S2_CONST = (await loadOne("strategy", {type: "2", node: config.node.id, removed: false}, {sort:{$natural:-1}}))?.s;

async function reloadConst(x){
    if (x == 1) S1_CONST = (await loadOne("strategy", {type: "1", node: config.node.id, removed: false}, {sort:{$natural:-1}}))?.s;
    if (x == 2) S2_CONST = (await loadOne("strategy", {type: "2", node: config.node.id, removed: false}, {sort:{$natural:-1}}))?.s;
}

async function removeAllData(){
    await remove("strategy", {node: config.node.id});
    await remove("result", {node: config.node.id});
}

async function getConst(type){
    const small = (await loadOne("result", {type, node: config.node.id, completeness: {$lte: 100}, removed: false}, {sort:{completeness:-1}}))?.s || 1;
    const big = (await loadOne("result", {type, node: config.node.id, completeness: {$gte: 100}, removed: false}, {sort:{completeness:1}}))?.s || small*10;
    const result = (small + big) / 2

    log("[getConst]", {type, small, big, result});
    return result;
}

async function calcS1Temp({moisture, thickness}){
    const mc = 1/moisture;
    const tc = 1/thickness;
    const tmc = 20; // 20 min

    const c1 = 1 / (mc * tc * tmc);

    const s1 = S1_CONST ?? await getConst("1");

    const temp = ((s1 * c1) ** (1/2)) - 273;

    const result = {s1, temp, time: 20};
    log("[calcS1Temp]", result);

    return result;
};

async function calcS2Time({moisture, thickness}){
    const mc = 1/moisture;
    const tc = 1/thickness;
    const temp = 100;  // 100 C
    const tpc = (temp + 273) ** 2;

    const c1 = 1 / (mc * tc * tpc);

    const s2 = S2_CONST ?? await getConst("2");

    const time = s2 * c1;

    const result = {s2, time, temp: 100};
    log("[calcS2Time]", result);

    return result;
};

export {calcS1Temp, calcS2Time, reloadConst, removeAllData}