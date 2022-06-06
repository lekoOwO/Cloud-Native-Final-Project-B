import express from 'express';
import {sleep, randomItem, config} from "./utils.mjs"
import {log, error} from "./log.mjs"
import {oven} from "./Factory/index.mjs"
import {generateMaterialPatch} from "./PreLayer/index.mjs"
import {calcS1Temp, calcS2Time, reloadConst} from "./Adjuster/index.mjs"
import {report} from "./Reporter/index.mjs"

const router = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let perform = false;

(async() => {
    await oven.init();
    while (true) {
        if (!perform) {
            await sleep(1000);
            continue;
        }

        try {
            log("[Main]", "Stage 0.");

            const patch = await generateMaterialPatch();

            log("[Main]", "Stage 1: Generate material patch.", patch);

            for(const steakId of patch.materials){
                const strategyIndex = randomItem([1,1,1,1,1,1,1,2,2,2]);
                let strategy = {time: null, temp: null};
                let c = null;

                const steakTemplate = {thickness: patch.thickness, moisture: patch.moisture};
                switch(strategyIndex) {
                    case 1:
                        const s1 = await calcS1Temp(steakTemplate);
                        strategy.time = s1.time;
                        strategy.temp = s1.temp;
                        c = s1.s1;
                        break;
                    case 2:
                        const s2 = await calcS2Time(steakTemplate);
                        strategy.time = s2.time;
                        strategy.temp = s2.temp;
                        c = s2.s2;
                        break;
                }

                log("[Main]", "Stage 2: Calculate strategy.", {steakId, strategyIndex, ...strategy, c});
                
                const rawSteak = {steakId, thickness: patch.thickness, moisture: patch.moisture};
                const steak = await oven.perform(rawSteak, strategy);

                log("[Main]", "Stage 3: Perform.", steak);

                await report({type: strategyIndex.toString(), s: c, completeness: steak.done});

                log("[Main]", "Stage 4: Report.", steak);

                if (Math.abs(steak.done - 100) < 0.1) {
                    await reloadConst();
                }
            }
        } catch (e) {
            error("[Main]", e);
        }
    }
})();

router.post("/perform", (req, res) => {
    perform = req.body?.perform ?? true;
    res.json({status: "ok"});
})

app.use("/api/v1", router);

app.listen(config.http.port, () => {
    console.log(`listening on port ${config.http.port}`);
});