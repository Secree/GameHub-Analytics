import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getGame,
  getPlayerHistory,
  type PlayerHistory,
} from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import "../styles/GamePage.css";


interface Game {
  appid: number;
  name: string;
  developer: string | null;
  publisher: string | null;
  genre: string | null;
  release_date: string | null;
  current_price: number | null;
  owners: string | null;
  positive_reviews: number | null;
  negative_reviews: number | null;
  metacritic_score: number | null;
  header_image: string | null;
  short_description: string | null;
}


export default function GamePage() {

  const { appid } = useParams();

  const [game, setGame] =
    useState<Game | null>(null);

  const [playerHistory, setPlayerHistory] =
    useState<PlayerHistory[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [historyLoading, setHistoryLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD GAME
  // ==========================================================

  useEffect(() => {

    if (!appid) {

      setError(
        "Game ID is missing."
      );

      setLoading(false);

      return;
    }

    setLoading(true);
    setError("");

    getGame(Number(appid))
      .then((data) => {
        setGame(data);
      })
      .catch((err) => {

        console.error(
          "Failed to load game:",
          err
        );

        setError(
          err?.response?.data?.detail ||
          "Failed to load game."
        );

      })
      .finally(() => {

        setLoading(false);

      });

  }, [appid]);


  // ==========================================================
  // LOAD PLAYER HISTORY
  // ==========================================================

  useEffect(() => {

    if (!appid) {
      return;
    }

    setHistoryLoading(true);

    getPlayerHistory(Number(appid))
      .then((data) => {

        setPlayerHistory(
          Array.isArray(data)
            ? data
            : []
        );

      })
      .catch((err) => {

        console.error(
          "Failed to load player history:",
          err
        );

        setPlayerHistory([]);

      })
      .finally(() => {

        setHistoryLoading(false);

      });

  }, [appid]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="game-page-state">

        <div className="loading-spinner" />

        <p>
          Loading game...
        </p>

      </div>
    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !game) {

    return (
      <div className="game-page-state">

        <h2>
          Game Not Found
        </h2>

        <p>
          {error ||
            "This game could not be found."}
        </p>

        <Link
          to="/games"
          className="back-button"
        >
          ← Back to Games
        </Link>

      </div>
    );

  }


  // ==========================================================
  // REVIEWS
  // ==========================================================

  const positive =
    game.positive_reviews ?? 0;

  const negative =
    game.negative_reviews ?? 0;

  const totalReviews =
    positive + negative;

  const positivePercentage =
    totalReviews > 0
      ? (
          (positive /
            totalReviews) *
          100
        ).toFixed(1)
      : "0.0";

  const negativePercentage =
    totalReviews > 0
      ? (
          (negative /
            totalReviews) *
          100
        ).toFixed(1)
      : "0.0";


  // ==========================================================
  // PRICE
  // ==========================================================

  const price =
    game.current_price === 0
      ? "Free"
      : game.current_price !== null
        ? `$${Number(
            game.current_price
          ).toFixed(2)}`
        : "N/A";


  // ==========================================================
  // PLAYER CHART DATA
  // ==========================================================

  const chartData =
    playerHistory.map(
      (item) => {

        const date =
          new Date(
            item.collected_at
          );

        return {
          ...item,

          date: date.toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric",
            }
          ),

          fullDate:
            date.toLocaleString(),
        };

      }
    );


  // ==========================================================
  // CURRENT PLAYERS
  // ==========================================================

  const currentPlayers =
    playerHistory.length > 0
      ? playerHistory[
          playerHistory.length - 1
        ].player_count
      : null;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="game-page">

      <div className="game-page-container">


        {/* ====================================================
            BACK
        ==================================================== */}

        <Link
          to="/games"
          className="back-button"
        >
          ← Back to Games
        </Link>


        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="game-hero">

          <div className="game-image-wrapper">

            {game.header_image ? (

              <img
                src={
                  game.header_image
                }
                alt={game.name}
                className="game-header-image"
              />

            ) : (

              <div className="no-image">
                🎮
              </div>

            )}

          </div>


          <div className="game-hero-info">

            <h1>
              {game.name}
            </h1>

            <p className="game-description">

              {game.short_description ||
                "No description available."}

            </p>

            <div className="game-price">
              {price}
            </div>

          </div>

        </section>


        {/* ====================================================
            PLAYER SUMMARY
        ==================================================== */}

        <section className="game-section">

          <h2>
            Player Activity
          </h2>


          <div className="player-summary">

            <div className="player-stat">

              <span>
                Current Players
              </span>

              <strong>

                {currentPlayers !== null
                  ? currentPlayers.toLocaleString()
                  : "No data"}

              </strong>

            </div>


            <div className="player-stat">

              <span>
                Data Points
              </span>

              <strong>
                {playerHistory.length.toLocaleString()}
              </strong>

            </div>


            <div className="player-stat">

              <span>
                Latest Update
              </span>

              <strong>

                {playerHistory.length > 0
                  ? new Date(
                      playerHistory[
                        playerHistory.length - 1
                      ].collected_at
                    ).toLocaleString()
                  : "No data"}

              </strong>

            </div>

          </div>

        </section>


        {/* ====================================================
            PLAYER HISTORY
        ==================================================== */}

        <section className="game-section">

          <div className="section-heading">

            <div>

              <h2>
                Player History
              </h2>

              <p>
                Recorded concurrent players over time
              </p>

            </div>

          </div>


          {historyLoading ? (

            <div className="chart-message">
              Loading player history...
            </div>

          ) : chartData.length === 0 ? (

            <div className="chart-message">
              No player history available for this game.
            </div>

          ) : (

            <div className="player-history-chart">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      Number(
                        value
                      ).toLocaleString()
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "8px",
                    }}
                    labelStyle={{
                      color:
                        "#22d3ee",
                    }}
                    itemStyle={{
                      color:
                        "#f8fafc",
                    }}
                    formatter={(value) => [
                      Number(
                        value
                      ).toLocaleString(),
                      "Players",
                    ]}
                    labelFormatter={(
                      _label,
                      payload
                    ) => {

                      if (
                        payload &&
                        payload.length > 0
                      ) {

                        return payload[0]
                          .payload
                          .fullDate;

                      }

                      return "";

                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="player_count"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#22d3ee",
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          )}

        </section>


        {/* ====================================================
            GAME INFORMATION
        ==================================================== */}

        <section className="game-section">

          <h2>
            Game Information
          </h2>


          <div className="info-grid">

            <div className="info-item">

              <span className="info-label">
                Developer
              </span>

              <span className="info-value">
                {game.developer ||
                  "Unknown"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Publisher
              </span>

              <span className="info-value">
                {game.publisher ||
                  "Unknown"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Genre
              </span>

              <span className="info-value">
                {game.genre ||
                  "Unknown"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Release Date
              </span>

              <span className="info-value">
                {game.release_date ||
                  "Unknown"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Price
              </span>

              <span className="info-value price-value">
                {price}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Owners
              </span>

              <span className="info-value">
                {game.owners ||
                  "Unknown"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Metacritic
              </span>

              <span className="info-value">
                {game.metacritic_score ??
                  "N/A"}
              </span>

            </div>

          </div>

        </section>


        {/* ====================================================
            REVIEW SUMMARY
        ==================================================== */}

        <section className="game-section">

          <h2>
            Review Summary
          </h2>


          <div className="review-grid">


            <div className="review-card positive">

              <div className="review-icon">
                👍
              </div>

              <div>

                <span className="review-label">
                  Positive
                </span>

                <strong>
                  {positive.toLocaleString()}
                </strong>

                <span className="review-percentage">
                  {positivePercentage}%
                </span>

              </div>

            </div>


            <div className="review-card negative">

              <div className="review-icon">
                👎
              </div>

              <div>

                <span className="review-label">
                  Negative
                </span>

                <strong>
                  {negative.toLocaleString()}
                </strong>

                <span className="review-percentage">
                  {negativePercentage}%
                </span>

              </div>

            </div>


            <div className="review-card total">

              <div className="review-icon">
                ⭐
              </div>

              <div>

                <span className="review-label">
                  Total Reviews
                </span>

                <strong>
                  {totalReviews.toLocaleString()}
                </strong>

              </div>

            </div>

          </div>


          <div className="review-bar-container">

            <div className="review-bar">

              <div
                className="review-positive-bar"
                style={{
                  width:
                    `${positivePercentage}%`,
                }}
              />

              <div
                className="review-negative-bar"
                style={{
                  width:
                    `${negativePercentage}%`,
                }}
              />

            </div>

          </div>

        </section>

      </div>

    </div>

  );
}