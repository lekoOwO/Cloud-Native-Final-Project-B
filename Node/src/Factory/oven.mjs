import {randomIntFromInterval} from "../utils.mjs"
import {log, error} from "./utils.mjs"
import {sleep} from "../utils.mjs"
import {loadOne, add} from "../db.mjs"

class Oven {
    constructor(id, c1){
        this.#id = id;
        this.#c1 = c1 ?? 10.5708245;

        this.init()
    };

    #id;
    #isInited = false;
    #envMoistureOffset;
    #envTempOffset;
    #c1;

    async init(){
        if (this.#isInited) return;
        const id = this.#id;

        const oven = await loadOne("oven", {id});
        if (oven) {
            this.#envMoistureOffset = oven.envMoistureOffset;
            this.#envTempOffset = oven.envTempOffset;
        } else {
            this.#envMoistureOffset = randomIntFromInterval(10, 100) / 100;
            this.#envTempOffset = randomIntFromInterval(10, 100) / 100;
            await add("oven", {id, envMoistureOffset: this.#envMoistureOffset, envTempOffset: this.#envTempOffset});
        }
    }

    setRecipe(recipe){
        this.#c1 = recipe.c1 ?? this.#c1;
    }
    
    async perform(steak, strategy){
        // on thickness = 25mm, time = 25min, moisture = 50%, temp = 200 C, we have done = 100 (%)
        const {moisture, thickness} = steak;
        const {time, temp} = strategy;

        const mc = (1/moisture) * this.#envMoistureOffset;
        const tc = (1/thickness);
        const tmc = time;
        const tpc = (temp + 273) * this.#envTempOffset;

        const done = mc * tc * tmc * tpc * this.#c1;

        log("[Oven.perform]", `Performing...`);
        await sleep(3000); // Skip Waiting

        return {done};
    }
};

export {Oven};