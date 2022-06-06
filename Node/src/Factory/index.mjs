import { subscribe } from "./nats.mjs";
import {log, error} from "./utils.mjs"
import {config} from "../utils.mjs"
import {Oven} from "./oven.mjs"

const oven = new Oven(config.node.id);

subscribe("recipe.new", async (recipe) => {
    log(`[subscribe.recipe.new] Receive new recipe from dispatcher.`, recipe);
    oven.setRecipe(recipe);
});

export {oven};