import {config} from "./utils.mjs"
import { MongoClient } from 'mongodb';

const client = new MongoClient(config.db.uri, { useNewUrlParser: true });

try {
    await client.connect();
} catch (err) {
    console.error(err);
}

const db = client.db(config.db.db);
const collections = {
    material: db.collection("material"),
    strategy: db.collection("strategy"),
    result: db.collection("result"),
    oven: db.collection("oven"),
};

async function add(type, data){
    if (!collections.hasOwnProperty(type)) {
        throw new Error(`unknown collection: ${type}`);
    }

    const result = await collections[type].insertOne({...data, removed: false});
    return result.insertedId;
}

async function loadOne(type, match, option){
    if (!collections.hasOwnProperty(type)) {
        throw new Error(`unknown collection: ${type}`);
    }

    return await collections[type].findOne(match, option);
}

async function remove(type, match){
    if (!collections.hasOwnProperty(type)) {
        throw new Error(`unknown collection: ${type}`);
    }

    return await collections[type].updateMany(match, {$set: {removed: true}});
}

export {
    client, db,
    add,
    loadOne,
    remove
}