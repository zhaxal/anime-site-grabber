import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { animeCol, playerLinksCol } from "./mongodb";
import rateLimit from "axios-rate-limit";
import * as winston from "winston";
import { TitleDetails } from "./models/imdb";
import {  PlayerLink } from "./models/player-link";

dotenv.config();

const kodikToken = process.env.KODIK_TOKEN;

const limitedAxios = rateLimit(axios.create(), {
  maxRPS: 2,
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "error",
      filename: "logs/errors.log",
    }),
  ],
});

const imdbLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "error",
      filename: "logs/imdb-logs.log",
    }),
  ],
});

export const grabberFunction = async () => {
  try {
    let page = `https://kodikapi.com/list?token=${kodikToken}&types=anime,anime-serial&sort=imdb_rating&with_material_data=true&limit=100`;
    let complete = false;

    // while (!complete) {
    //   const res = await axios.get<List>(page);

    //   res.data.results.map(async (anime) => {
    //     await playerLinksCol.replaceOne({ id: anime.id }, anime, {
    //       upsert: true,
    //     });
    //   });

    //   if (res.data.next_page === null) {
    //     complete = true;
    //   } else {
    //     page = res.data.next_page;
    //   }
    // }

    const links = await playerLinksCol
      .aggregate([
        {
          $group: {
            _id: "$imdb_id",
            anime: {
              $first: "$$ROOT",
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: "$anime",
          },
        },
        {
          $sort: {
            "material_data.imdb_rating": -1,
          },
        },
      ])
      .toArray();

    links.map(async (link) => {
      const animeRes = await limitedAxios
        .get<TitleDetails>(`http://localhost:3005/title/${link.imdb_id}`)
        .catch((err) => {
          const e = err as AxiosError;
          imdbLogger.error(e);
        });

      if (!animeRes) return;

      const anime = animeRes.data;

      const seasons = await playerLinksCol
        .aggregate<PlayerLink>([
          {
            $group: {
              _id: "$shikimori_id",
              anime: {
                $first: "$$ROOT",
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: "$anime",
            },
          },
          {
            $match: {
              imdb_id: link.imdb_id,
            },
          },
          {
            $sort: {
              year: 1,
            },
          },
          {
            $project: {
              shikimori_id: "$shikimori_id",
            },
          },
        ])
        .toArray();

      await animeCol.replaceOne(
        { imdb_id: link.imdb_id },
        {
          imdb_id: anime.id,
          image: anime.image,
          images: anime.images,
          seasons: anime.seasons,
          seasons_shikimori_ids: seasons.map((season) => season.shikimori_id),
        },
        { upsert: true }
      );
    });
  } catch (err) {
    const e = err as Error;
    logger.error(e.message);
  }
};
