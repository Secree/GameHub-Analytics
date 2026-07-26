const API = "http://127.0.0.1:8000";

export async function getGames(
    search = "",
    genre = "",
    free: boolean | null = null,
    sort = "name",
    page = 1
) {

    const params = new URLSearchParams();

    if (search)
        params.append("search", search);

    if (genre)
        params.append("genre", genre);

    if (free !== null)
        params.append("free", String(free));

    params.append("sort", sort);
    params.append("page", String(page));

    const response = await fetch(
        `${API}/games?${params.toString()}`
    );

    if (!response.ok)
        throw new Error("Failed to load games");

    return response.json();
}