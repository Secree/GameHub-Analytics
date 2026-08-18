import axios from "axios";


// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000",

  headers: {
    "Content-Type": "application/json",
  },
});


// ============================================================
// SEARCH GAMES
// Used by SearchBar.tsx
// ============================================================

export async function searchGames(
  query: string
) {
  const response = await api.get(
    "/games/search",
    {
      params: {
        q: query,
      },
    }
  );

  return response.data;
}


// ============================================================
// GET SINGLE GAME
// Used by GamePage.tsx
// ============================================================

export async function getGame(
  appid: number | string
) {
  const response = await api.get(
    `/games/${appid}`
  );

  return response.data;
}


// ============================================================
// GET GAMES
// Used by Games Catalog
// ============================================================

export async function getGames(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
    free?: boolean;
    tags?: string[];
    tag_mode?: "OR" | "AND";
    sort?: string;
    order?: "asc" | "desc";
  } = {}
) {

  const searchParams =
    new URLSearchParams();


  if (params.page !== undefined) {
    searchParams.append(
      "page",
      String(params.page)
    );
  }


  if (params.limit !== undefined) {
    searchParams.append(
      "limit",
      String(params.limit)
    );
  }


  if (params.search) {
    searchParams.append(
      "search",
      params.search
    );
  }


  if (params.genre) {
    searchParams.append(
      "genre",
      params.genre
    );
  }


  if (params.free !== undefined) {
    searchParams.append(
      "free",
      String(params.free)
    );
  }


  // Multiple tags
  if (params.tags) {

    params.tags.forEach(tag => {

      searchParams.append(
        "tags",
        tag
      );

    });

  }


  if (params.tag_mode) {
    searchParams.append(
      "tag_mode",
      params.tag_mode
    );
  }


  if (params.sort) {
    searchParams.append(
      "sort",
      params.sort
    );
  }


  if (params.order) {
    searchParams.append(
      "order",
      params.order
    );
  }


  const response = await api.get(
    `/games?${searchParams.toString()}`
  );


  return response.data;
}


// ============================================================
// SEARCH TAGS
// ============================================================

export async function searchTags(
  query: string
) {

  const response = await api.get(
    "/games/tags/search",
    {
      params: {
        q: query,
        limit: 20,
      },
    }
  );


  return response.data;
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export { api };

export default api;