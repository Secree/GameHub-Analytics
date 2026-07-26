import "../styles/Dashboard.css";

import { useEffect, useState } from "react";

import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";

import GenrePieChart from "../components/GameChart_Pie";
import TagBarChart from "../components/GameChart_Bar";

import {
  getDashboardStats,
  getGenres,
  getTags,
  getTrendingGames,
  getDiscounts,
  getReleases,
} from "../services/dashboard";

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  const [genres, setGenres] = useState<any[]>([]);

  const [tags, setTags] = useState<any[]>([]);

  const [trending, setTrending] = useState<any[]>([]);

  const [discounts, setDiscounts] = useState<any[]>([]);

  const [releases, setReleases] = useState<any[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);

    getGenres().then(setGenres);

    getTags().then(setTags);

    getTrendingGames().then(setTrending);

    getDiscounts().then(setDiscounts);

    getReleases().then(setReleases);
  }, []);

  return (
    <div className="dashboard">

      {/* Hero */}

      <section className="hero">

        <h1>🎮 GameHub Analytics</h1>

        <p>
          Explore Steam games, player trends, genres,
          community tags, pricing and review analytics.
        </p>

        <SearchBar />

      </section>

      {/* Stats */}

      <main className="dashboard-content">

        <section className="stats-grid">

          <StatCard
            title="Games"
            value={stats?.games?.toLocaleString() ?? "..."}
            icon="🎮"
          />

          <StatCard
            title="Players"
            value={stats?.players?.toLocaleString() ?? "..."}
            icon="👥"
          />

          <StatCard
            title="Average Price"
            value={`$${stats?.avg_price ?? 0}`}
            icon="💲"
          />

          <StatCard
            title="Positive Reviews"
            value={`${stats?.positive_reviews ?? 0}%`}
            icon="⭐"
          />

        </section>

        {/* Charts */}

        <section className="chart-grid">

          <div className="chart">

            <h2>Genre Distribution</h2>

            <GenrePieChart data={genres} />

          </div>

          <div className="chart">

            <h2>Top Community Tags</h2>

            <TagBarChart data={tags} />

          </div>

        </section>

        {/* Trending + Releases */}

        <section className="bottom-grid">

          <div className="panel">

            <h2>🔥 Trending Games</h2>

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

                {trending.map((game) => (

                  <tr key={game.appid}>

                    <td>{game.name}</td>

                    <td>{game.players.toLocaleString()}</td>

                    <td>{game.reviews.toLocaleString()}</td>

                    <td>

                      {game.price === 0

                        ? "Free"

                        : `$${Number(game.price).toFixed(2)}`}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <div className="panel">

            <h2>🆕 Recently Released</h2>

            <table>

              <thead>

                <tr>

                  <th>Game</th>

                  <th>Release</th>

                </tr>

              </thead>

              <tbody>

                {releases.map((game) => (

                  <tr key={game.name}>

                    <td>{game.name}</td>

                    <td>{game.release}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

        {/* Discounts */}

        <section className="panel">

          <h2>💸 Biggest Discounts</h2>

          <table>

            <thead>

              <tr>

                <th>Game</th>

                <th>Original</th>

                <th>Current</th>

                <th>Discount</th>

              </tr>

            </thead>

            <tbody>

              {discounts.map((game) => (

                <tr key={game.name}>

                  <td>{game.name}</td>

                  <td>

                    {game.original === 0

                      ? "Free"

                      : `$${Number(game.original).toFixed(2)}`}

                  </td>

                  <td>

                    {game.current === 0

                      ? "Free"

                      : `$${Number(game.current).toFixed(2)}`}

                  </td>

                  <td>

                    {game.discount}%

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </section>

      </main>

    </div>
  );
}