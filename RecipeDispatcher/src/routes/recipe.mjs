import {loadRecipe, addRecipe, getRecipeById} from "../db.mjs"
import {publish} from "../nats.mjs"
import {log} from "../utils.mjs"

import {Router} from "express"

const router = Router();

router.get("/recipe", async(req, res) => {
    const {type} = req.query;
    const recipe = await loadRecipe(type);
    
    return res.json({status: "ok", result: recipe}).status(200);
});

router.post("/recipe", async(req, res) => {
    const {type, recipe} = req.body;
    try {
        const id = await addRecipe(type, recipe);
        log("POST /recipe", `recipe added: ${type}`, recipe);
        return res.json({id}).status(200);
    } catch (e) {
        error("POST /recipe", e);
        return res.json({status: "error", result: e.message}).status(500);
    }
});

router.post("/publish", async(req, res) => {
    const {id} = req.body;
    
    try {
        const {type, recipe} = await getRecipeById(id);
        publish("recipe.new", {type, recipe});
        log("POST /publish", `recipe published: ${id}`);
        return res.json({status: "ok", result: null}).status(200);
    } catch (e) {
        error("POST /publish", `Recipe ID: ${id}`, e);
        return res.json({status: "error", result: e.message}).status(500);
    }
});

export default router;