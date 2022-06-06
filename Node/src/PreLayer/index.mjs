import {add as dbAdd} from "../db.mjs";
import { v4 as uuidv4 } from 'uuid';
import {randomIntFromInterval, config} from "../utils.mjs";

async function generateMaterialPatch(){
    // Generate thickness and moisture randomly
    const thickness = randomIntFromInterval(18, 23); // mm
    const moisture = randomIntFromInterval(70, 80); // %
    const amount = randomIntFromInterval(1, 100); // pcs

    const materials = [];
    for(let i = 0; i < amount; i++) {
        materials.push({id: uuidv4()});
    }

    const patch =  {
        thickness,
        moisture,
        amount,
        materials
    }

    const patchId = await dbAdd("material", {...patch, node: config.node.id});

    return {id: patchId, ...patch};
}

export {generateMaterialPatch}