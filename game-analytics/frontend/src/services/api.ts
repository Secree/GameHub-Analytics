const API = "http://127.0.0.1:8000";

export async function searchGames(query: string) {
  const res = await fetch(
    `${API}/games/search?q=${encodeURIComponent(query)}`
  );

  return res.json();
}

export async function getGame(appid: number) {
  const res = await fetch(
    `${API}/games/${appid}`
  );

  return res.json();
}