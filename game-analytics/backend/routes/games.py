from fastapi import APIRouter, HTTPException, Query
from database import get_connection
import math

router = APIRouter(
    prefix="/games",
    tags=["Games"]
)


# ============================================================
# GET GAMES
# ============================================================

@router.get("")
def list_games(
    page: int = 1,
    limit: int = 20,
    genre: str | None = None,
    free: bool | None = None,
    search: str | None = None,
    sort: str = "name",
    order: str = "asc",
    tags: list[str] | None = Query(None),
    tag_mode: str = "OR",
):
    # --------------------------------------------------------
    # Pagination validation
    # --------------------------------------------------------

    if page < 1:
        page = 1

    if limit < 1:
        limit = 20

    if limit > 100:
        limit = 100

    offset = (page - 1) * limit


    conn = get_connection()
    cur = conn.cursor()


    try:

        # ====================================================
        # BUILD FILTERS
        # ====================================================

        where = ["TRUE"]
        params = []


        # ----------------------------------------------------
        # Search
        # ----------------------------------------------------

        if search:

            where.append(
                "g.name ILIKE %s"
            )

            params.append(
                f"%{search}%"
            )


        # ----------------------------------------------------
        # Genre
        # ----------------------------------------------------

        if genre:

            where.append(
                "g.genre ILIKE %s"
            )

            params.append(
                f"%{genre}%"
            )


        # ----------------------------------------------------
        # Free
        # ----------------------------------------------------

        if free is not None:

            where.append(
                "g.is_free = %s"
            )

            params.append(
                free
            )


        # ----------------------------------------------------
        # Tags
        # ----------------------------------------------------

        if tags:

            tag_ids = []

            for tag in tags:

                try:
                    tag_ids.append(
                        int(tag)
                    )
                except (
                    TypeError,
                    ValueError
                ):
                    pass


            if tag_ids:

                placeholders = ", ".join(
                    ["%s"] * len(tag_ids)
                )


                if tag_mode.upper() == "AND":

                    where.append(
                        f"""
                        g.appid IN (
                            SELECT gt.appid
                            FROM gamehub_analytics.game_tags gt
                            WHERE gt.tag_id IN (
                                {placeholders}
                            )
                            GROUP BY gt.appid
                            HAVING COUNT(
                                DISTINCT gt.tag_id
                            ) = %s
                        )
                        """
                    )

                    params.extend(
                        tag_ids
                    )

                    params.append(
                        len(tag_ids)
                    )


                else:

                    where.append(
                        f"""
                        g.appid IN (
                            SELECT DISTINCT gt.appid
                            FROM gamehub_analytics.game_tags gt
                            WHERE gt.tag_id IN (
                                {placeholders}
                            )
                        )
                        """
                    )

                    params.extend(
                        tag_ids
                    )


        where_sql = " AND ".join(
            where
        )


        # ====================================================
        # TOTAL COUNT
        # ====================================================

        count_sql = f"""
            SELECT COUNT(*)
            FROM gamehub_analytics.games g
            WHERE {where_sql}
        """

        cur.execute(
            count_sql,
            params
        )

        total = cur.fetchone()[0]


        # ====================================================
        # TOTAL PAGES
        # ====================================================

        total_pages = (
            math.ceil(total / limit)
            if total > 0
            else 1
        )


        # ====================================================
        # SORT
        # ====================================================

        sort_columns = {

            "name":
                "g.name",

            "price":
                "g.current_price",

            "reviews":
                "g.positive_reviews",

            "release":
                "g.release_date",

        }


        sort_column = sort_columns.get(
            sort,
            "g.name"
        )


        sort_order = (
            "DESC"
            if order.lower() == "desc"
            else "ASC"
        )


        # ====================================================
        # GET GAMES
        # ====================================================

        sql = f"""
            SELECT
                g.appid,
                g.name,
                g.genre,
                g.current_price,
                g.is_free,
                g.positive_reviews,
                g.header_image

            FROM gamehub_analytics.games g

            WHERE {where_sql}

            ORDER BY
                {sort_column}
                {sort_order}
                NULLS LAST

            LIMIT %s
            OFFSET %s
        """


        game_params = params.copy()

        game_params.extend([
            limit,
            offset
        ])


        cur.execute(
            sql,
            game_params
        )

        rows = cur.fetchall()


        # ====================================================
        # FORMAT GAMES
        # ====================================================

        games = [

            {
                "appid": row[0],

                "name": row[1],

                "genre": row[2],

                "price": (
                    float(row[3])
                    if row[3] is not None
                    else None
                ),

                "is_free": row[4],

                "reviews": row[5] or 0,

                "header_image": row[6],

            }

            for row in rows

        ]


        # ====================================================
        # RETURN PAGINATED RESPONSE
        # ====================================================

        return {

            "games": games,

            "total": total,

            "page": page,

            "limit": limit,

            "total_pages": total_pages,

        }

    finally:

        cur.close()
        conn.close()


# ============================================================
# GET ALL TAGS
# ============================================================

@router.get("/tags")
def get_tags():

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            SELECT
                tag_id,
                tag_name
            FROM gamehub_analytics.tags
            ORDER BY tag_name ASC
        """)

        rows = cur.fetchall()

        return [

            {
                "tag_id": row[0],
                "tag_name": row[1]
            }

            for row in rows

        ]

    finally:

        cur.close()
        conn.close()


# ============================================================
# SEARCH TAGS
# ============================================================

@router.get("/tags/search")
def search_tags(
    q: str = "",
    limit: int = 20
):

    if limit < 1:
        limit = 20

    if limit > 100:
        limit = 100

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            SELECT
                tag_id,
                tag_name
            FROM gamehub_analytics.tags
            WHERE tag_name ILIKE %s
            ORDER BY tag_name ASC
            LIMIT %s
        """, (
            f"%{q}%",
            limit
        ))

        rows = cur.fetchall()

        return [

            {
                "tag_id": row[0],
                "tag_name": row[1]
            }

            for row in rows

        ]

    finally:

        cur.close()
        conn.close()


# ============================================================
# PLAYER HISTORY
# ============================================================

@router.get("/{appid}/players")
def get_player_history(
    appid: int
):

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            SELECT name
            FROM gamehub_analytics.games
            WHERE appid = %s
            """,
            (appid,)
        )

        game = cur.fetchone()

        if game is None:

            raise HTTPException(
                status_code=404,
                detail=f"Game {appid} not found"
            )


        cur.execute(
            """
            SELECT
                collected_at,
                player_count
            FROM gamehub_analytics.player_history
            WHERE appid = %s
            ORDER BY collected_at ASC
            """,
            (appid,)
        )

        rows = cur.fetchall()


        return [

            {
                "collected_at":
                    row[0].isoformat(),

                "player_count":
                    int(row[1] or 0),

            }

            for row in rows

        ]

    finally:

        cur.close()
        conn.close()


# ============================================================
# GET SINGLE GAME
# ============================================================

@router.get("/{appid}")
def get_game(
    appid: int
):

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            SELECT
                appid,
                name,
                developer,
                publisher,
                genre,
                release_date,
                current_price,
                owners,
                positive_reviews,
                negative_reviews,
                metacritic_score,
                header_image,
                short_description

            FROM gamehub_analytics.games

            WHERE appid = %s
            """,
            (appid,)
        )

        row = cur.fetchone()


        if row is None:

            raise HTTPException(
                status_code=404,
                detail=(
                    f"Game with appid "
                    f"{appid} not found"
                )
            )


        return {

            "appid": row[0],

            "name": row[1],

            "developer": row[2],

            "publisher": row[3],

            "genre": row[4],

            "release_date": row[5],

            "current_price": (
                float(row[6])
                if row[6] is not None
                else None
            ),

            "owners": row[7],

            "positive_reviews":
                row[8] or 0,

            "negative_reviews":
                row[9] or 0,

            "metacritic_score":
                row[10],

            "header_image":
                row[11],

            "short_description":
                row[12],

        }

    finally:

        cur.close()
        conn.close()