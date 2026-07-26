import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  useEffect(() => {
    if (!appid) return;

    getGame(Number(appid))
      .then((data) => {
        console.log(data); // Debug
        setGame(data);
      })
      .catch(console.error);
  }, [appid]);

  if (!game) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="game-page">
      {game.header_image && (
        <img
          src={game.header_image}
          alt={game.name}
          className="header-image"
        />
      )}

      <h1>{game.name}</h1>

      <p>{game.short_description || "No description available."}</p>

      <hr />

      <p><strong>Developer:</strong> {game.developer || "Unknown"}</p>

      <p><strong>Publisher:</strong> {game.publisher || "Unknown"}</p>

      <p><strong>Genre:</strong> {game.genre || "Unknown"}</p>

      <p><strong>Release Date:</strong> {game.release_date || "Unknown"}</p>

      <p><strong>Price:</strong> ${game.current_price ?? game.current_price === 0 ? game.current_price : "N/A"}</p>

      <p><strong>Owners:</strong> {game.owners || "Unknown"}</p>

      <p><strong>Metacritic:</strong> {game.metacritic_score ?? "N/A"}</p>

      <p>
        <strong>Positive Reviews:</strong>{" "}
        {(game.positive_reviews ?? 0).toLocaleString()}
      </p>

      <p>
        <strong>Negative Reviews:</strong>{" "}
        {(game.negative_reviews ?? 0).toLocaleString()}
      </p>
    </div>
  );
}