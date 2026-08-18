import "../styles/Dashboard.css";

import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";

import GenrePieChart from "../components/GameChart_Pie";
import TagBarChart from "../components/GameChart_Bar";

import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getGenres,
  getTags,
  getTrendingGames,
} from "../services/dashboard";

interface DashboardStats {
  games: number;
  players: number;
  avg_price: number;
  positive_reviews: number;
}

interface GenreData {
  name: string;
  value: number;
}

interface TagData {
  name: string;
  value: number;
}

interface TrendingGame {
  appid: number;
  name: string;
  players: number;
  reviews: number;
  price: number;
}

export function Dashboard() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [genres, setGenres] =
    useState<GenreData[]>([]);

  const [tags, setTags] =
    useState<TagData[]>([]);

  const [trending, setTrending] =
    useState<TrendingGame[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          statsData,
          genresData,
          tagsData,
          trendingData,
        ] = await Promise.all([
          getDashboardStats(),
          getGenres(),
          getTags(),
          getTrendingGames(),
        ]);

        setStats(statsData);

        setGenres(
          Array.isArray(genresData)
            ? genresData
            : []
        );

        setTags(
          Array.isArray(tagsData)
            ? tagsData
            : []
        );

        setTrending(
          Array.isArray(trendingData)
            ? trendingData
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load dashboard:",
          err
        );

        setError(
          "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* =========================
          HERO
      ========================= */}

      <section className="hero">
        <h1>
          🎮 GameHub Analytics
        </h1>

        <p>
          Explore Steam games, player trends,
          genres, community tags, pricing and
          review analytics.
        </p>

        <SearchBar />
      </section>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* =========================
          STATS
      ========================= */}

      <section className="stats-grid">
        <StatCard
          title="Games"
          value={
            stats?.games?.toLocaleString() ?? "0"
          }
        />

        <StatCard
          title="Players"
          value={
            stats?.players?.toLocaleString() ?? "0"
          }
        />

        <StatCard
          title="Avg Price"
          value={`$${(
            stats?.avg_price ?? 0
          ).toFixed(2)}`}
        />

        <StatCard
          title="Positive Reviews"
          value={`${(
            stats?.positive_reviews ?? 0
          ).toFixed(2)}%`}
        />
      </section>


      {/* =========================
          CHARTS
      ========================= */}

      <section className="chart-grid">

        {/* GENRES */}

        <div className="chart">
          <div className="chart-header">
            <h2>
              Genre Distribution
            </h2>
          </div>

          <div className="chart-body">
            {genres.length > 0 ? (
              <GenrePieChart
                data={genres}
              />
            ) : (
              <div className="no-chart-data">
                No genre data available.
              </div>
            )}
          </div>
        </div>


        {/* TAGS */}

        <div className="chart">
          <div className="chart-header">
            <h2>
              Top Community Tags
            </h2>
          </div>

          <div className="chart-body">
            {tags.length > 0 ? (
              <TagBarChart
                data={tags}
              />
            ) : (
              <div className="no-chart-data">
                No tag data available.
              </div>
            )}
          </div>
        </div>

      </section>


      {/* =========================
          TRENDING GAMES
      ========================= */}

      <section className="bottom-grid">
        <div className="panel">

          <div className="panel-header">
            <h2>
              🔥 Trending Games
            </h2>
          </div>

          {trending.length === 0 ? (
            <div className="no-data">
              No trending games available.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Players</th>
                    <th>Reviews</th>
                    <th>Price</th>
                  </tr>
                </thead>

                <tbody>
                  {trending.map(
                    (game) => (
                      <tr
                        key={game.appid}
                      >
                        <td>
                          {game.name}
                        </td>

                        <td>
                          {(
                            game.players ?? 0
                          ).toLocaleString()}
                        </td>

                        <td>
                          {(
                            game.reviews ?? 0
                          ).toLocaleString()}
                        </td>

                        <td>
                          {game.price === 0
                            ? "Free"
                            : `$${Number(
                                game.price
                              ).toFixed(2)}`}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}