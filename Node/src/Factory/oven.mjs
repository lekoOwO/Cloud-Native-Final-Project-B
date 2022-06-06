import {randomIntFromInterval} from "../utils.mjs"
import {log, error} from "./utils.mjs"
import {sleep} from "../utils.mjs"
import {loadOne, add} from "../db.mjs"

class Oven {
    constructor(id, c1){
        this.id = id;
        this.c1 = c1 ?? 0.02234846622;

        this.init()
    };

    id;
    #isInited = false;
    #envMoistureOffset;
    c1;
    temp = 30;

    async init(){
        if (this.#isInited) return;
        const id = this.id;

        const oven = await loadOne("oven", {id});
        if (oven) {
            this.#envMoistureOffset = oven.envMoistureOffset;
        } else {
            this.#envMoistureOffset = randomIntFromInterval(10, 100) / 100;
            await add("oven", {id, envMoistureOffset: this.#envMoistureOffset});
        }
    }

    setRecipe(recipe){
        this.c1 = recipe.c1 ?? this.c1;
    }

    async setTemp(targetTemp){
        let c = 0;
        while(this.temp != targetTemp){
            if (Math.abs(this.temp - targetTemp) < 1){
                this.temp = targetTemp;
                break;
            }

            if (c % 100 === 0) {
                log("[Oven.setTemp]", `(${this.temp} / ${targetTemp})`);
            }

            if (this.temp > targetTemp){
                this.temp -= 1;
            } else {
                this.temp += 1;
            }

            await sleep(20);
            c++;
        }
    }
    
    async perform(steak, strategy){
        // on thickness = 25mm, time = 25min, moisture = 50%, temp = 200 C, we have done = 100 (%)
        const {moisture, thickness} = steak;
        const {time, temp} = strategy;

        const mc = (1/moisture) * this.#envMoistureOffset;
        const tc = (1/thickness);
        const tmc = time;
        const tpc = ((temp + 273) ** 2);

        const done = mc * tc * tmc * tpc * this.c1;

        log("[Oven.perform]", `Adjusting Oven Temperature...`);
        await this.setTemp(temp);
        log("[Oven.perform]", `Performing...`);
        await sleep(time * 30);

        return done;
    }
};

export {Oven};