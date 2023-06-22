import { MongoClient } from "mongodb";
import { PlayerLink } from "./models/player-link";
import { Anime } from "./models/anime";

const uri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri);
client.connect();
const db = client.db(process.env.DB_NAME || "anime-site");

export const playerLinksCol = db.collection<PlayerLink>("playerLinks");
export const animeCol = db.collection<Anime>("anime");

export { db };
