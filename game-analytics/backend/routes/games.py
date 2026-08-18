from fastapi import APIRouter
from database import get_connection
import math

router = APIRouter(
    prefix="/games",
    tags=["Games"]
)


@router.get("")
def list_games(
    page: int = 1,
    limit: int = 20,
    genre: str | None = None,
    free: bool | None = None,
    search: str | None = None,
    tags: list[str] | None = None,
    tag_mode: str = "OR",
    sort: str = "name",
    order: str = "asc"
):

    # ============================================================
    # VALIDATE PAGINATION
    # ============================================================

    if page < 1:
        page = 1

    if limit < 1:
        limit = 20

    if limit > 100:
        limit = 100


    offset = (page - 1) * limit


    # ============================================================
    # DATABASE
    # ============================================================

    conn = get_connection()
    cur = conn.cursor()


    # ============================================================
    # BASE WHERE
    # ============================================================

    where = """
        WHERE TRUE
    """

    params = []


    # ============================================================
    # GENRE
    # ============================================================

    if genre:

        where += """
            AND genre ILIKE %s
        """

        params.append(
            f"%{genre}%"
        )


    # ============================================================
    # FREE
    # ============================================================

    if free is not None:

        where += """
            AND is_free = %s
        """

        params.append(
            free
        )


    # ============================================================
    # SEARCH
    # ============================================================

    if search:

        where += """
            AND name ILIKE %s
        """

        params.append(
            f"%{search}%"
        )


    # ============================================================
    # TAG FILTER
    # ============================================================

    if tags:

        tag_ids = []

        for tag in tags:

            try:

                tag_ids.append(
                    int(tag)
                )

            except ValueError:

                continue


        if tag_ids:

            if tag_mode.upper() == "AND":

                placeholders = ",".join(
                    ["%s"] * len(tag_ids)
                )

                where += f"""
                    AND appid IN (
                        SELECT gt.appid
                        FROM gamehub_analytics.game_tags gt
                        WHERE gt.tag_id IN ({placeholders})
                        GROUP BY gt.appid
                        HAVING COUNT(DISTINCT gt.tag_id) = %s
                    )
                """

                params.extend(
                    tag_ids
                )

                params.append(
                    len(tag_ids)
                )

            else:

                placeholders = ",".join(
                    ["%s"] * len(tag_ids)
                )

                where += f"""
                    AND appid IN (
                        SELECT DISTINCT gt.appid
                        FROM gamehub_analytics.game_tags gt
                        WHERE gt.tag_id IN ({placeholders})
                    )
                """

                params.extend(
                    tag_ids
                )


    # ============================================================
    # COUNT TOTAL GAMES
    # ============================================================

    count_sql = f"""
        SELECT COUNT(*)
        FROM gamehub_analytics.games
        {where}
    """

    cur.execute(
        count_sql,
        params
    )

    total = cur.fetchone()[0]


    # ============================================================
    # TOTAL PAGES
    # ============================================================

    total_pages = math.ceil(
        total / limit
    )


    # Always have at least 1 page
    if total_pages == 0:
        total_pages = 1


    # ============================================================
    # SORT
    # ============================================================

    sort_columns = {

        "name":
            "name",

        "price":
            "current_price",

        "reviews":
            "positive_reviews",

        "release":
            "release_date",

    }


    sort_column = sort_columns.get(
        sort,
        "name"
    )


    # Prevent arbitrary SQL injection
    if order.lower() == "desc":

        sort_order = "DESC"

    else:

        sort_order = "ASC"


    # ============================================================
    # GET GAMES
    # ============================================================

    sql = f"""
        SELECT

            appid,

            name,

            genre,

            current_price,

            is_free,

            positive_reviews,

            header_image

        FROM gamehub_analytics.games

        {where}

        ORDER BY
            {sort_column}
            {sort_order}

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


    # ============================================================
    # CLOSE DATABASE
    # ============================================================

    cur.close()

    conn.close()


    # ============================================================
    # RETURN
    # ============================================================

    return {

        "games": [

            {

                "appid": row[0],

                "name": row[1],

                "genre": row[2],

                "price": row[3],

                "is_free": row[4],

                "reviews": row[5],

                "header_image": row[6],

            }

            for row in rows

        ],

        "total": total,

        "page": page,

        "limit": limit,

        "total_pages": total_pages,

    }


# ============================================================
# GET TAGS
# ============================================================

@router.get("/tags")
def get_tags():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            tag_id,
            tag_name
        FROM gamehub_analytics.tags
        ORDER BY tag_name ASC
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "tag_id": row[0],
            "tag_name": row[1]
        }
        for row in rows
    ]