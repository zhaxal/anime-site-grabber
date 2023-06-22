// create interface from shikimori api

import { Season } from "./imdb";

//shikimori variant

export interface Anime {
  imdb_id: string;

  //imdb

  image: string;
  images: string[];
  seasons: Season[];
  seasons_shikimori_ids: string[];
}
