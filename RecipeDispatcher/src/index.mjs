import {config} from "./utils.mjs"
import express from "express";
import recipeRouter from "./routes/recipe.mjs"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = express.Router();
router.use("/recipe", recipeRouter);

app.use("/api/v1", router);

app.listen(config.http.port, () => {
    console.log(`listening on port ${config.http.port}`);
});