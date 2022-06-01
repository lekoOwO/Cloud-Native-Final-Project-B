import * as fs from "fs";

const config = fs.readFileSync("../config/config.json")

function calcDone({thickness, time, temp, moisture}){
    // on thickness = 25mm, time = 25min, moisture = 50%, temp = 200 C, we have done = 100 (%)
    const c1 = 10.5708245;

    const mc = (1/moisture);
    const tc = (1/thickness);
    const tmc = time;
    const tpc = temp + 273;

    const done = mc * tc * tmc * tpc * c1;

    return done;
}

export {config, calcDone};