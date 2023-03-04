import { MongoClient } from "mongodb";
import { Anime } from "./models/kodik";

const uri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri);
client.connect();
const db = client.db(process.env.DB_NAME || "anime-site");

export const animeCol = db.collection<Anime>("anime");

export { db };
