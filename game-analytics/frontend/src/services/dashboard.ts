import type {
  DashboardStats,
  ChartData,
  TrendingGame,
  DiscountGame,
  ReleaseGame,
} from "../types/dashboard";
import { api } from "./api";

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get("/dashboard/stats");
  return res.data;
}

export async function getGenres(): Promise<ChartData[]> {
  const res = await api.get("/dashboard/genres");
  return res.data;
}

export async function getTags(): Promise<ChartData[]> {
  const res = await api.get("/dashboard/tags");
  return res.data;
}

export async function getTrendingGames(): Promise<TrendingGame[]> {
  const res = await api.get("/dashboard/trending");
  return res.data;
}

export async function getDiscounts(): Promise<DiscountGame[]> {
  const res = await api.get("/dashboard/discounts");
  return res.data;
}

export async function getReleases(): Promise<ReleaseGame[]> {
  const res = await api.get("/dashboard/releases");
  return res.data;
}