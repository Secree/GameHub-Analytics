import "../styles/Games.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getGames,
  getTags,
  type Game,
  type Tag,
  type GamesResponse,
} from "../services/games";

export function Games() {

  const navigate = useNavigate();


  // ============================================================
  // GAME DATA
  // ============================================================

  const [games, setGames] = useState<Game[]>([]);

  const [tags, setTags] = useState<Tag[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // SEARCH / FILTERS
  // ============================================================

  const [search, setSearch] = useState("");

  const [selectedTags, setSelectedTags] =
    useState<number[]>([]);

  const [tagMode, setTagMode] =
    useState<"OR" | "AND">("OR");


  // ============================================================
  // SORTING
  // ============================================================

  const [sort, setSort] =
    useState<
      "name" |
      "price" |
      "reviews" |
      "release"
    >("name");

  const [order, setOrder] =
    useState<"asc" | "desc">("asc");


  // ============================================================
  // PAGINATION
  // ============================================================

  const [page, setPage] = useState(1);

  const [limit] = useState(20);

  const [totalPages, setTotalPages] = useState(1);

  const [totalGames, setTotalGames] = useState(0);


  // ============================================================
  // LOAD TAGS
  // ============================================================

  useEffect(() => {

    loadTags();

  }, []);


  async function loadTags() {

    try {

      const data = await getTags();

      setTags(data);

    } catch (err) {

      console.error(
        "Failed to load tags:",
        err
      );

    }

  }


  // ============================================================
  // LOAD GAMES
  // ============================================================

  useEffect(() => {

    loadGames();

  }, [
    page,
    search,
    selectedTags,
    tagMode,
    sort,
    order,
  ]);


  async function loadGames() {

    try {

      setLoading(true);

      setError("");


      const data: GamesResponse =
        await getGames({

          page,

          limit,

          search:
            search.trim()
              ? search.trim()
              : undefined,

          tags:
            selectedTags.length > 0
              ? selectedTags.map(String)
              : undefined,

          tag_mode:
            tagMode,

          sort,

          order,

        });


      console.log(
        "Games API response:",
        data
      );


      // ========================================================
      // SET GAMES
      // ========================================================

      setGames(
        data.games || []
      );


      // ========================================================
      // SET TOTAL
      // ========================================================

      setTotalGames(
        data.total || 0
      );


      // ========================================================
      // SET TOTAL PAGES
      // ========================================================

      setTotalPages(
        Math.max(
          1,
          data.total_pages || 1
        )
      );


    } catch (err) {

      console.error(
        "Failed to load games:",
        err
      );

      setError(
        "Failed to load games."
      );

      setGames([]);

      setTotalGames(0);

      setTotalPages(1);

    } finally {

      setLoading(false);

    }

  }


  // ============================================================
  // TAG SELECTION
  // ============================================================

  function toggleTag(
    tagId: number
  ) {

    setPage(1);

    setSelectedTags((current) => {

      if (
        current.includes(tagId)
      ) {

        return current.filter(
          id => id !== tagId
        );

      }

      return [
        ...current,
        tagId,
      ];

    });

  }


  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  function clearFilters() {

    setSearch("");

    setSelectedTags([]);

    setTagMode("OR");

    setSort("name");

    setOrder("asc");

    setPage(1);

  }


  // ============================================================
  // SEARCH
  // ============================================================

  function handleSearch(
    value: string
  ) {

    setSearch(value);

    setPage(1);

  }


  // ============================================================
  // SORT
  // ============================================================

  function handleSort(
    value:
      | "name"
      | "price"
      | "reviews"
      | "release"
  ) {

    setSort(value);

    setPage(1);

  }


  // ============================================================
  // ORDER
  // ============================================================

  function handleOrder(
    value: "asc" | "desc"
  ) {

    setOrder(value);

    setPage(1);

  }


  // ============================================================
  // GAME PROFILE
  // ============================================================

  function openGame(
    appid: number
  ) {

    navigate(
      `/games/${appid}`
    );

  }


  // ============================================================
  // PAGINATION
  // ============================================================

  function goToPage(
    newPage: number
  ) {

    if (
      newPage < 1 ||
      newPage > totalPages
    ) {

      return;

    }


    setPage(newPage);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  // ============================================================
  // PAGE NUMBERS
  // ============================================================

  function getPageNumbers() {

    const pages: number[] = [];

    const maxVisiblePages = 5;


    let start = Math.max(
      1,
      page - 2
    );


    let end =
      start +
      maxVisiblePages -
      1;


    if (
      end > totalPages
    ) {

      end = totalPages;

      start = Math.max(
        1,
        end -
          maxVisiblePages +
          1
      );

    }


    for (
      let i = start;
      i <= end;
      i++
    ) {

      pages.push(i);

    }


    return pages;

  }


  // ============================================================
  // FORMAT PRICE
  // ============================================================

  function formatPrice(
    game: Game
  ) {

    if (
      game.is_free ||
      game.price === 0
    ) {

      return "Free";

    }


    if (
      game.price === null ||
      game.price === undefined
    ) {

      return "N/A";

    }


    return `$${Number(
      game.price
    ).toFixed(2)}`;

  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="games-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="games-header">

        <h1>
          🎮 Games
        </h1>

        <p>
          Browse, search and analyze
          Steam games.
        </p>

      </section>


      {/* ======================================================
          FILTERS
      ====================================================== */}

      <section className="games-filters">


        {/* SEARCH */}

        <div className="search-group">

          <label>
            Search Games
          </label>

          <input
            type="text"
            value={search}
            placeholder="Search games..."
            onChange={(e) =>
              handleSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* SORT */}

        <div className="filter-group">

          <label>
            Sort By
          </label>

          <select
            value={sort}
            onChange={(e) =>
              handleSort(
                e.target.value as
                  | "name"
                  | "price"
                  | "reviews"
                  | "release"
              )
            }
          >

            <option value="name">
              Name
            </option>

            <option value="price">
              Price
            </option>

            <option value="reviews">
              Reviews
            </option>

            <option value="release">
              Release Date
            </option>

          </select>

        </div>


        {/* ORDER */}

        <div className="filter-group">

          <label>
            Order
          </label>

          <select
            value={order}
            onChange={(e) =>
              handleOrder(
                e.target.value as
                  | "asc"
                  | "desc"
              )
            }
          >

            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>

          </select>

        </div>


        {/* CLEAR */}

        <button
          className="clear-button"
          onClick={
            clearFilters
          }
        >
          Clear
        </button>

      </section>


      {/* ======================================================
          COMMUNITY TAGS
      ====================================================== */}

      <section className="tag-section">


        <div className="tag-header">

          <div>

            <h2>
              Community Tags
            </h2>

            <p>
              Filter games by
              community tags.
            </p>

          </div>


          {/* OR / AND */}

          <div className="tag-mode">

            <button
              className={
                tagMode === "OR"
                  ? "active"
                  : ""
              }
              onClick={() => {

                setTagMode("OR");

                setPage(1);

              }}
            >
              OR
            </button>


            <button
              className={
                tagMode === "AND"
                  ? "active"
                  : ""
              }
              onClick={() => {

                setTagMode("AND");

                setPage(1);

              }}
            >
              AND
            </button>

          </div>

        </div>


        {/* TAGS */}

        <div className="tags-container">

          {tags.length === 0 ? (

            <p className="no-tags">
              No tags available.
            </p>

          ) : (

            tags.map((tag) => (

              <button
                key={tag.tag_id}
                className={
                  `tag-button ${
                    selectedTags.includes(
                      tag.tag_id
                    )
                      ? "selected"
                      : ""
                  }`
                }
                onClick={() =>
                  toggleTag(
                    tag.tag_id
                  )
                }
              >

                {tag.tag_name}

              </button>

            ))

          )}

        </div>


        {/* SELECTED TAG COUNT */}

        {selectedTags.length > 0 && (

          <div className="selected-tags">

            {selectedTags.length}

            {" "}

            tag
            {selectedTags.length !== 1
              ? "s"
              : ""}

            {" selected"}

          </div>

        )}

      </section>


      {/* ======================================================
          RESULTS
      ====================================================== */}

      <main className="games-content">


        <div className="results-header">

          <h2>
            Games
          </h2>

          <span>

            {totalGames.toLocaleString()}

            {" "}

            games

          </span>

        </div>


        {/* ERROR */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {/* LOADING */}

        {loading ? (

          <div className="games-loading">

            Loading games...

          </div>

        ) : games.length === 0 ? (

          <div className="no-games">

            No games found.

          </div>

        ) : (

          <>


            {/* ==================================================
                GAME GRID
            ================================================== */}

            <div className="games-grid">

              {games.map((game) => (

                <article
                  className="game-card"
                  key={game.appid}
                  onClick={() =>
                    openGame(
                      game.appid
                    )
                  }
                >


                  {/* IMAGE */}

                  {game.header_image ? (

                    <img
                      src={
                        game.header_image
                      }
                      alt={
                        game.name
                      }
                    />

                  ) : (

                    <div className="game-image-placeholder">

                      🎮

                    </div>

                  )}


                  {/* INFO */}

                  <div className="game-card-content">

                    <h3>
                      {game.name}
                    </h3>


                    <p className="game-genre">

                      {game.genre ||
                        "Unknown genre"}

                    </p>


                    <div className="game-meta">

                      <span>

                        ⭐{" "}

                        {(
                          game.reviews ??
                          0
                        ).toLocaleString()}

                      </span>


                      <span>

                        {formatPrice(
                          game
                        )}

                      </span>

                    </div>

                  </div>

                </article>

              ))}

            </div>


            {/* ==================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (

              <nav
                className="pagination"
                aria-label="Games pagination"
              >


                {/* FIRST */}

                <button
                  type="button"
                  disabled={
                    page === 1
                  }
                  onClick={() =>
                    goToPage(1)
                  }
                  title="First page"
                >

                  «

                </button>


                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={
                    page === 1
                  }
                  onClick={() =>
                    goToPage(
                      page - 1
                    )
                  }
                  title="Previous page"
                >

                  ‹

                </button>


                {/* PAGE NUMBERS */}

                {getPageNumbers().map(
                  (pageNumber) => (

                    <button
                      type="button"
                      key={
                        pageNumber
                      }
                      className={
                        page ===
                        pageNumber
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        goToPage(
                          pageNumber
                        )
                      }
                    >

                      {pageNumber}

                    </button>

                  )
                )}


                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    page ===
                    totalPages
                  }
                  onClick={() =>
                    goToPage(
                      page + 1
                    )
                  }
                  title="Next page"
                >

                  ›

                </button>


                {/* LAST */}

                <button
                  type="button"
                  disabled={
                    page ===
                    totalPages
                  }
                  onClick={() =>
                    goToPage(
                      totalPages
                    )
                  }
                  title="Last page"
                >

                  »

                </button>

              </nav>

            )}

          </>

        )}

      </main>

    </div>

  );

}