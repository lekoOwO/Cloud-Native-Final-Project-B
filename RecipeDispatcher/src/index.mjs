import {config} from "./utils.mjs"
import * as express from "express"
import recipeRouter from "./routes/recipe.mjs"

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();
router.use("/recipe", recipeRouter);

app.use("/api/v1", router);

app.listen(config.http.port, () => {
    console.log(`listening on port ${config.http.port}`);
});