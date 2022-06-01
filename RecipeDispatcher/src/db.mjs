import {config} from "./utils.mjs"
import { MongoClient } from 'mongodb';

const client = new MongoClient(config.db.uri, { useNewUrlParser: true });

try {
    await client.connect();
} catch (err) {
    console.error(err);
}

const db = client.db(config.db.db);
const recipe = db.collection("recipe");

async function addRecipe({type, recipe}){
    const result = await recipe.insertOne({
        type, recipe
    });
    return result.insertedId;
}

async function loadRecipe(type){
    const result = await recipe.findOne({
        type
    }, {sort:{$natural:-1}}); // latest recipe
    return result;
}

async function getRecipeById(id){
    const result = await recipe.findOne({
        _id: id
    });
    return result;
}

export {
    client, db,
    addRecipe,
    loadRecipe,
    getRecipeById
}