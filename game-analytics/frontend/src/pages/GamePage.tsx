import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGame } from "../services/api";
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

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!appid) return;

    setLoading(true);
    setError("");

    getGame(Number(appid))
      .then((data) => {
        setGame(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load game information.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appid]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="game-page-state">
        <div className="loading-spinner"></div>
        <p>Loading game...</p>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !game) {
    return (
      <div className="game-page-state">
        <h2>Game not found</h2>
        <p>{error || "This game could not be found."}</p>

        <Link to="/games" className="back-button">
          ← Back to Games
        </Link>
      </div>
    );
  }

  // ==========================================================
  // REVIEW CALCULATIONS
  // ==========================================================

  const positive = game.positive_reviews ?? 0;
  const negative = game.negative_reviews ?? 0;

  const totalReviews = positive + negative;

  const positivePercentage =
    totalReviews > 0
      ? ((positive / totalReviews) * 100).toFixed(1)
      : "0.0";

  const negativePercentage =
    totalReviews > 0
      ? ((negative / totalReviews) * 100).toFixed(1)
      : "0.0";

  // ==========================================================
  // PRICE
  // ==========================================================

  const price =
    game.current_price === 0
      ? "Free"
      : game.current_price !== null
      ? `$${Number(game.current_price).toFixed(2)}`
      : "N/A";

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="game-page">

      {/* ======================================================
          BACK BUTTON
      ====================================================== */}

      <div className="game-page-container">

        <Link to="/games" className="back-button">
          ← Back to Games
        </Link>


        {/* ====================================================
            GAME HERO
        ==================================================== */}

        <section className="game-hero">

          <div className="game-image-wrapper">

            {game.header_image ? (
              <img
                src={game.header_image}
                alt={game.name}
                className="game-header-image"
              />
            ) : (
              <div className="no-image">
                No Image
              </div>
            )}

          </div>


          <div className="game-hero-info">

            <h1>{game.name}</h1>

            <p className="game-description">
              {game.short_description ||
                "No description available for this game."}
            </p>

            <div className="game-price">
              {price}
            </div>

          </div>

        </section>


        {/* ====================================================
            GAME INFORMATION
        ==================================================== */}

        <section className="game-section">

          <h2>Game Information</h2>

          <div className="info-grid">

            <div className="info-item">
              <span className="info-label">
                Developer
              </span>

              <span className="info-value">
                {game.developer || "Unknown"}
              </span>
            </div>


            <div className="info-item">
              <span className="info-label">
                Publisher
              </span>

              <span className="info-value">
                {game.publisher || "Unknown"}
              </span>
            </div>


            <div className="info-item">
              <span className="info-label">
                Genre
              </span>

              <span className="info-value">
                {game.genre || "Unknown"}
              </span>
            </div>


            <div className="info-item">
              <span className="info-label">
                Release Date
              </span>

              <span className="info-value">
                {game.release_date || "Unknown"}
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
                {game.owners || "Unknown"}
              </span>
            </div>


            <div className="info-item">
              <span className="info-label">
                Metacritic
              </span>

              <span className="info-value">
                {game.metacritic_score ?? "N/A"}
              </span>
            </div>

          </div>

        </section>


        {/* ====================================================
            REVIEW SUMMARY
        ==================================================== */}

        <section className="game-section">

          <h2>Review Summary</h2>

          <div className="review-grid">

            {/* Positive */}

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


            {/* Negative */}

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


            {/* Total */}

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


          {/* Review Bar */}

          <div className="review-bar-container">

            <div className="review-bar">

              <div
                className="review-positive-bar"
                style={{
                  width: `${positivePercentage}%`,
                }}
              />

              <div
                className="review-negative-bar"
                style={{
                  width: `${negativePercentage}%`,
                }}
              />

            </div>

          </div>

        </section>


        {/* ====================================================
            REVIEW DETAILS
        ==================================================== */}

        <section className="review-details">

          <div>
            <span>Positive Reviews</span>
            <strong>
              {positive.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Negative Reviews</span>
            <strong>
              {negative.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Total Reviews</span>
            <strong>
              {totalReviews.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Positive Rating</span>
            <strong>
              {positivePercentage}%
            </strong>
          </div>

        </section>

      </div>

    </div>
  );
}