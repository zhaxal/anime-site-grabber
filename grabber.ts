import axios from "axios";
import dotenv from "dotenv";
import { List } from "./models/kodik";
import { animeCol } from "./mongodb";

dotenv.config();

const kodikToken = process.env.KODIK_TOKEN;

const kodikInstance = axios.create({
  baseURL: "https://kodikapi.com",
});

export const grabberFunction = async () => {
  try {
    let page =
      `https://kodikapi.com/list?token=${kodikToken}&types=anime,anime-serial`;
    let complete = false;

    while (!complete) {
      const res = await axios.get<List>(page);

      res.data.results.map(async (anime) => {
        await animeCol.replaceOne({ id: anime.id }, anime, { upsert: true });
      });

      if (res.data.next_page === null) {
        complete = true;
      } else {
        page = res.data.next_page;
      }
    }
  } catch (error) {
    console.error(error);
  }
};
