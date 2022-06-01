import { subscribe } from "./nats.mjs";
import { Router } from "express";

const router = Router();


router.get("/status", async(req, res) => {

});

router.post("/perform", async(req, res) => {
    const {material, strategy} = req.body;
    
})

subscribe("recipe.new", async (recipe) => {
    console.log(`[Factory.subscribe.recipe.new] Receive new recipe from dispatcher.`)
});