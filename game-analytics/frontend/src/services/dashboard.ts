import type {
  DashboardStats,
  ChartData,
  TrendingGame,
  DiscountGame,
  ReleaseGame,
} from "../types/dashboard";

const API = "http://127.0.0.1:8000";

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API}/dashboard/stats`);
  return res.json();
}

export async function getGenres(): Promise<ChartData[]> {
  const res = await fetch(`${API}/dashboard/genres`);
  return res.json();
}

export async function getTags(): Promise<ChartData[]> {
  const res = await fetch(`${API}/dashboard/tags`);
  return res.json();
}

export async function getTrendingGames(): Promise<TrendingGame[]> {
  const res = await fetch(`${API}/dashboard/trending`);
  return res.json();
}

export async function getDiscounts(): Promise<DiscountGame[]> {
  const res = await fetch(`${API}/dashboard/discounts`);
  return res.json();
}

export async function getReleases(): Promise<ReleaseGame[]> {
  const res = await fetch(`${API}/dashboard/releases`);
  return res.json();
}