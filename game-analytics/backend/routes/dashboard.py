from fastapi import APIRouter
from database import get_connection

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def stats():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            COUNT(*),

            ROUND(AVG(current_price),2),

            ROUND(
                AVG(
                    CASE

                        WHEN positive_reviews+negative_reviews=0

                        THEN NULL

                        ELSE
                        positive_reviews::numeric/
                        (positive_reviews+negative_reviews)
                        *100

                    END
                ),
                2
            )

        FROM gamehub_analytics.games;
    """)

    result = cur.fetchone()

    cur.execute("""
        SELECT
        COALESCE(SUM(player_count),0)

        FROM
        (
            SELECT DISTINCT ON(appid)

                appid,

                player_count

            FROM gamehub_analytics.player_history

            ORDER BY
                appid,
                collected_at DESC

        ) p;
    """)

    players = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {

        "games": result[0],

        "players": players,

        "avg_price": float(result[1] or 0),

        "positive_reviews": float(result[2] or 0)

    }


@router.get("/genres")
def genres():

    conn=get_connection()
    cur=conn.cursor()

    cur.execute("""

        SELECT

            genre_name,

            COUNT(*)

        FROM gamehub_analytics.game_genres gg

        JOIN gamehub_analytics.genres g

        ON gg.genre_id=g.genre_id

        GROUP BY genre_name

        ORDER BY COUNT(*) DESC;

    """)

    rows=cur.fetchall()

    cur.close()
    conn.close()

    return [

        {

            "name":r[0],

            "value":r[1]

        }

        for r in rows

    ]


@router.get("/tags")
def tags():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            t.tag_name,
            COUNT(*) AS total
        FROM gamehub_analytics.game_tags gt
        JOIN gamehub_analytics.tags t
            ON gt.tag_id = t.tag_id
        GROUP BY t.tag_name
        ORDER BY total DESC
        LIMIT 10;
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "name": row[0],
            "value": row[1]
        }
        for row in rows
    ]

@router.get("/trending")
def trending():

    conn=get_connection()
    cur=conn.cursor()

    cur.execute("""

        SELECT

            g.appid,

            g.name,

            p.player_count,

            g.positive_reviews,

            g.current_price

        FROM gamehub_analytics.games g

        JOIN
        (
            SELECT DISTINCT ON(appid)

                appid,

                player_count

            FROM gamehub_analytics.player_history

            ORDER BY
                appid,
                collected_at DESC

        ) p

        ON g.appid=p.appid

        ORDER BY player_count DESC

        LIMIT 10;

    """)

    rows=cur.fetchall()

    cur.close()
    conn.close()

    return [

        {

            "appid":r[0],

            "name":r[1],

            "players":r[2],

            "reviews":r[3],

            "price":r[4]

        }

        for r in rows

    ]


@router.get("/discounts")
def discounts():

    conn=get_connection()
    cur=conn.cursor()

    cur.execute("""

        SELECT

            name,

            initial_price,

            current_price,

            ROUND(

                (

                initial_price-current_price

                )

                /

                NULLIF(initial_price,0)

                *100

            )

        FROM gamehub_analytics.games

        WHERE initial_price>current_price

        ORDER BY 4 DESC

        LIMIT 10;

    """)

    rows=cur.fetchall()

    cur.close()
    conn.close()

    return [

        {

            "name":r[0],

            "original":r[1],

            "current":r[2],

            "discount":r[3]

        }

        for r in rows

    ]


@router.get("/releases")
def releases():

    conn=get_connection()
    cur=conn.cursor()

    cur.execute("""

        SELECT

            name,

            release_date

        FROM gamehub_analytics.games

        WHERE release_date IS NOT NULL

        ORDER BY release_date DESC

        LIMIT 10;

    """)

    rows=cur.fetchall()

    cur.close()
    conn.close()

    return [

        {

            "name":r[0],

            "release":r[1]

        }

        for r in rows

    ]