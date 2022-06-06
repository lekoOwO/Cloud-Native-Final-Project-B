import {config} from "./utils.mjs"
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(config.db.uri, { useNewUrlParser: true });

try {
    await client.connect();
} catch (err) {
    console.error(err);
}

const db = client.db(config.db.db);
const recipe = db.collection("recipe");

async function addRecipe(data){
    const result = await recipe.insertOne(data);
    return result.insertedId;
}

async function loadRecipe(){
    const result = await recipe.findOne({}, {sort:{$natural:-1}}); // latest recipe
    return result;
}

async function getRecipeById(id){
    const result = await recipe.findOne({
        _id: new ObjectId(id)
    });
    return result;
}

export {
    client, db,
    addRecipe,
    loadRecipe,
    getRecipeById
}