import { api } from "./api";

// ============================================================
// TYPES
// ============================================================

export interface Game {
  appid: number;
  name: string;
  genre: string | null;
  price: number | null;
  is_free: boolean;
  reviews: number;
  header_image: string | null;
}

export interface Tag {
  tag_id: number;
  tag_name: string;
}

export interface GamesResponse {
  games: Game[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface GetGamesParams {
  page?: number;
  limit?: number;

  search?: string;

  genre?: string;

  free?: boolean;

  tags?: string[];

  tag_mode?: "OR" | "AND";

  sort?: "name" | "price" | "reviews" | "release";

  order?: "asc" | "desc";
}


// ============================================================
// GET GAMES
// ============================================================

export async function getGames(
  params: GetGamesParams = {}
): Promise<GamesResponse> {

  const searchParams = new URLSearchParams();

  // ----------------------------------------------------------
  // Pagination
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // Search
  // ----------------------------------------------------------

  if (params.search) {
    searchParams.append(
      "search",
      params.search
    );
  }

  // ----------------------------------------------------------
  // Genre
  // ----------------------------------------------------------

  if (params.genre) {
    searchParams.append(
      "genre",
      params.genre
    );
  }

  // ----------------------------------------------------------
  // Free
  // ----------------------------------------------------------

  if (params.free !== undefined) {
    searchParams.append(
      "free",
      String(params.free)
    );
  }

  // ----------------------------------------------------------
  // Tags
  // ----------------------------------------------------------

  if (
    params.tags &&
    params.tags.length > 0
  ) {

    params.tags.forEach((tag) => {

      searchParams.append(
        "tags",
        tag
      );

    });

  }

  // ----------------------------------------------------------
  // Tag mode
  // ----------------------------------------------------------

  if (params.tag_mode) {
    searchParams.append(
      "tag_mode",
      params.tag_mode
    );
  }

  // ----------------------------------------------------------
  // Sort
  // ----------------------------------------------------------

  if (params.sort) {
    searchParams.append(
      "sort",
      params.sort
    );
  }

  // ----------------------------------------------------------
  // Order
  // ----------------------------------------------------------

  if (params.order) {
    searchParams.append(
      "order",
      params.order
    );
  }

  // ----------------------------------------------------------
  // REQUEST
  // ----------------------------------------------------------

  const response = await api.get(
    `/games?${searchParams.toString()}`
  );

  return response.data;
}


// ============================================================
// GET TAGS
// ============================================================

export async function getTags(): Promise<Tag[]> {

  const response = await api.get(
    "/games/tags"
  );

  return response.data;
}


// ============================================================
// SEARCH TAGS
// ============================================================

export async function searchTags(
  query: string
): Promise<Tag[]> {

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