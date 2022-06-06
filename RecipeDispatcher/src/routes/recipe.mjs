import {loadRecipe, addRecipe, getRecipeById} from "../db.mjs"
import {publish} from "../nats.mjs"
import {log, error} from "../utils.mjs"

import {Router} from "express"

const router = Router();

router.get("/", async(req, res) => {
    const recipe = await loadRecipe();
    
    return res.json({status: "ok", result: recipe}).status(200);
});

router.post("/", async(req, res) => {
    const {recipe} = req.body;
    try {
        const id = await addRecipe(recipe);
        log("POST /recipe", `recipe added:`, recipe);
        return res.json({id}).status(200);
    } catch (e) {
        error("POST /recipe", e);
        return res.json({status: "error", result: e.message}).status(500);
    }
});

router.post("/publish", async(req, res) => {
    const {id} = req.body;
    
    try {
        const data = await getRecipeById(id);
        publish("recipe.new", data);
        log("POST /publish", `recipe published: ${id}`);
        return res.json({status: "ok", result: null}).status(200);
    } catch (e) {
        error("POST /publish", `Recipe ID: ${id}`, e);
        return res.json({status: "error", result: e.message}).status(500);
    }
});

export default router;