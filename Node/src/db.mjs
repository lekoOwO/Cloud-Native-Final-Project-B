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
};

function add(type, data){
    if (!collections.hasOwnProperty(type)) {
        throw new Error(`unknown collection: ${type}`);
    }

    const result = await collections[type].insertOne(data);
    return result.insertedId;
}

export {
    client, db,
    add,
}