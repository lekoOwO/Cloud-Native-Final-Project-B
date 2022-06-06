import express from 'express';
import {sleep, randomItem, config} from "./utils.mjs"
import {log, error, writeApi} from "./log.mjs"
import {oven} from "./Factory/index.mjs"
import {generateMaterialPatch} from "./PreLayer/index.mjs"
import {calcS1Temp, calcS2Time, reloadConst, removeAllData} from "./Adjuster/index.mjs"
import {report} from "./Reporter/index.mjs"
import {subscribe} from "./nats.mjs"
import {Point} from '@influxdata/influxdb-client'

subscribe("recipe.new", async (recipe) => {
    log(`[subscribe.recipe.new] Receive new recipe from dispatcher.`, recipe);
    oven.setRecipe(recipe);
    await removeAllData();
    await reloadConst();
});

const router = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let perform = false;

(async() => {
    await oven.init();
    (async() => {
        while (true) {
            const point = new Point(`oven`)
                .tag('nodeId', config.node.id)
                .tag("id", oven.id)
                .floatField('temperature', oven.temp)
            writeApi.writePoint(point);

            await sleep(3000);
        }
    })();
    while (true) {
        if (!perform) {
            await sleep(1000);
            continue;
        }

        try {
            log("[Main]", "Stage 0.");

            const patch = await generateMaterialPatch();

            const point = new Point(`patch`)
                .tag('node', config.node.id)
                .tag("ovenId", oven.id)
                .stringField("id", patch.id)
                .floatField('thickness', patch.thickness)
                .floatField('moisture', patch.moisture)
                .floatField('recipe', oven.c1)
            writeApi.writePoint(point);

            log("[Main]", "Stage 1: Generate material patch.", patch);

            for(let c = 0; c < patch.materials.length; c++){
                const steak = patch.materials[c];
                if (c < patch.materials.length * 0.3){ // Strategy 2 30%
                    steak.strategy = 2;
                } else {
                    steak.strategy = 1;
                }
            }

            for(const {id: steakId, strategy: strategyIndex} of patch.materials){
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
                let steak = {...rawSteak}
                steak.done = await oven.perform(rawSteak, strategy);

                log("[Main]", "Stage 3: Perform.", steak);

                steak = {type: strategyIndex.toString(), s: c, steak, patchId: patch.id, recipe: oven.c1};
                await report(steak);

                log("[Main]", "Stage 4: Report.", steak);

                if (Math.abs(steak.done - 100) < 0.1) {
                    await reloadConst(strategyIndex);
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

process.on('exit', async function() {
    await writeApi.flush();
});