
export interface MaterialData {
  title?: string;
  anime_title?: string;
  title_en?: string;
  other_titles?: string[];
  other_titles_en?: string[];
  other_titles_jp?: string[];
  anime_license_name?: string;
  anime_licensed_by?: string[];
  anime_kind?: string;
  all_status?: string;
  anime_status?: string;
  drama_status?: string;
  year?: number;
  tagline?: string;
  description?: string;
  anime_description?: string;
  poster_url?: string;
  screenshots?: string[];
  duration?: number;
  countries?: string[];
  all_genres?: string[];
  genres?: string[];
  anime_genres?: string[];
  drama_genres?: string[];
  anime_studios?: string[];
  kinopoisk_rating?: number;
  kinopoisk_votes?: number;
  imdb_rating?: number;
  imdb_votes?: number;
  shikimori_rating?: number;
  shikimori_votes?: number;
  mydramalist_rating?: number;
  mydramalist_votes?: number;
  premiere_ru?: string;
  premiere_world?: string;
  aired_at?: string;
  released_at?: string;
  next_episode_at?: string;
  rating_mpaa?: string;
  minimal_age?: number;
  episodes_total?: number;
  episodes_aired?: number;
  actors?: string[];
  directors?: string[];
  producers?: string[];
  writers?: string[];
  composers?: string[];
  editors?: string[];
  designers?: string[];
  operators?: string[];
}

export interface PlayerLink {
  id: string;
  type: string;
  link: string;
  title: string;
  title_orig: string;
  other_title: string;
  translation: any;
  year: number;
  last_season?: number;
  last_episode?: number;
  episodes_count?: number;
  kinopoisk_id: string;
  imdb_id: string;
  mdl_id: string;
  worldart_link: string;
  shikimori_id: string;
  camrip: boolean;
  quality: string;
  blocked_countries: string[];
  blocked_seasons?: any;
  seasons?: any;
  material_data: MaterialData;
  created_at: string;
  updated_at: string;
  screenshots: string[];
}

export interface List {
  time: string;
  total: number;
  prev_page: string | null;
  next_page: string | null;
  results: PlayerLink[];
}
