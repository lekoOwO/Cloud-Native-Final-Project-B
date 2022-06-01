import {Router} from "express";
import {add as dbAdd} from "../db.mjs";
import { v4 as uuidv4 } from 'uuid';

// utils
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const router = Router();

router.post("/material", async(req, res) => {
    // Generate thickness and moisture randomly
    const thickness = randomIntFromInterval(18, 25); // mm
    const moisture = randomIntFromInterval(50, 80); // %
    const amount = randomIntFromInterval(1, 100); // pcs

    const materials = [];
    for(let i = 0; i < amount; i++) {
        materials.push(uuidv4());
    }

    const patchId = await dbAdd("material", {
        thickness,
        moisture,
        amount,
        materials
    });

    res.json({status: "ok", result: patchId}).status(200);
})

export default router;