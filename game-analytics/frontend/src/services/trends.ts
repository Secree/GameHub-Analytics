import { api } from "./api";


// ============================================================
// TYPES
// ============================================================

export interface PlayerActivity {
  date: string;
  players: number;
}

export interface TopGame {
  appid: number;
  name: string;
  players: number;
}

export interface ReviewTrend {
  positive: number;
  negative: number;
}

export interface PriceTrend {
  name: string;
  value: number;
}


// ============================================================
// PLAYER ACTIVITY
// ============================================================

export async function getPlayerActivity(): Promise<
  PlayerActivity[]
> {
  const response = await api.get(
    "/trends/player-activity"
  );

  return response.data;
}


// ============================================================
// TOP GAMES
// ============================================================

export async function getTopTrendGames(
  limit = 10
): Promise<TopGame[]> {
  const response = await api.get(
    "/trends/top-games",
    {
      params: {
        limit,
      },
    }
  );

  return response.data;
}


// ============================================================
// REVIEWS
// ============================================================

export async function getReviewTrends(): Promise<ReviewTrend> {
  const response = await api.get(
    "/trends/reviews"
  );

  return response.data;
}


// ============================================================
// PRICES
// ============================================================

export async function getPriceTrends(): Promise<PriceTrend[]> {
  const response = await api.get(
    "/trends/prices"
  );

  return response.data;
}