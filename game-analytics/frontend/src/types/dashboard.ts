export interface DashboardStats {
  games: number;
  players: number;
  avg_price: number;
  positive_reviews: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TrendingGame {
  appid: number;
  name: string;
  players: number;
  reviews: number;
  price: number;
}

export interface DiscountGame {
  name: string;
  original: number;
  current: number;
  discount: number;
}

export interface ReleaseGame {
  name: string;
  release: string;
}