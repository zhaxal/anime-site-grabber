
export interface Anime {
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
  kinopoist_id: string;
  imdb_id: string;
  mdl_id: string;
  worldart_link: string;
  shikimori_id: string;
  camrip: boolean;
  quality: string;
  blocked_countries: string[];
  blocked_seasons?: any;
  seasons?: any;
  material_data: any;
  created_at: string;
  updated_at: string;
  screenshots: string[];
}

export interface List {
  time: string;
  total: number;
  prev_page: string | null;
  next_page: string | null;
  results: Anime[];
}
