export interface TitleDetails {
  id: string;
  image: string;
  images: string[];
  seasons: Season[];
}

export interface Season {
  id: string;
  name: string;
  episodes: Episode[];
}
export interface Episode {
  idx: number;
  no: string;
  title: string;
  image: string;
  image_large: string;
  plot: string;
  publishedDate: string;
  rating?: any;
}
