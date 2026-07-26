import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchGames } from "../services/api";
import "../styles/SearchBar.css";

interface Game {
  appid: number;
  name: string;
  image: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        const data = await searchGames(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Steam games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {results.length > 0 && (
        <div className="search-results">
          {results.map((game) => (
            <div
              key={game.appid}
              className="search-item"
              onClick={() => navigate(`/game/${game.appid}`)}
            >
              <img
                src={game.image}
                alt={game.name}
                className="search-image"
              />

              <span>{game.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}