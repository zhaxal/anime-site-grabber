import axios, { AxiosError, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { animeCol, playerLinksCol } from "./mongodb";
import rateLimit from "axios-rate-limit";
import * as winston from "winston";
import { TitleDetails } from "./models/imdb";
import { List, PlayerLink } from "./models/player-link";

dotenv.config();

const kodikToken = process.env.KODIK_TOKEN;

const limitedAxios = rateLimit(axios.create(), {
  maxRPS: 2,
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      level: "error",
      filename: "logs/errors.log",
    }),
  ],
});

const imdbLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      level: "error",
      filename: "logs/imdb-logs.log",
    }),
  ],
});

const fetchList = async (page: string): Promise<[List | null, any]> => {
  try {
    const res = await axios.get<List>(page);

    return [res.data, null];
  } catch (error) {
    const e = error as AxiosError;
    return [null, e.response?.data];
  }
};

const fetchImdb = async (
  imdbId: string
): Promise<[TitleDetails | null, any]> => {
  try {
    const res = await limitedAxios.get<TitleDetails>(
      `http://localhost:3005/title/${imdbId}`
    );
    return [res.data, null];
  } catch (error) {
    const e = error as AxiosError;
    return [null, e.response?.data];
  }
};

export const grabberFunction = async () => {
  try {
    let page = `https://kodikapi.com/list?token=${kodikToken}&types=anime,anime-serial&with_material_data=true&limit=100`;
    let complete = false;

    while (!complete) {
      const [res, err] = await fetchList(page);

      if (err) {
        logger.error(err);
        continue;
      }

      if (res === null) {
        continue;
      }

      res.results.map(async (anime) => {
        await playerLinksCol.replaceOne({ id: anime.id }, anime, {
          upsert: true,
        });
      });

      if (res.next_page === null) {
        complete = true;
      } else {
        page = res.next_page;
      }
    }

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
      const [animeRes, err] = await fetchImdb(link.imdb_id);

      if (err) {
        imdbLogger.error(err);
        return;
      }

      if (!animeRes) return;

      const anime = animeRes;

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

    console.log("parsed");
  } catch (err) {
    const e = err as Error;
    logger.error(e);
  }
};
