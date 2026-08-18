from fastapi import APIRouter
from database import get_connection

router = APIRouter(
    prefix="/trends",
    tags=["Trends"]
)


# ============================================================
# PLAYER ACTIVITY OVER TIME
# ============================================================

@router.get("/player-activity")
def player_activity():

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            SELECT
                DATE(collected_at) AS date,
                SUM(player_count) AS players
            FROM gamehub_analytics.player_history
            GROUP BY DATE(collected_at)
            ORDER BY DATE(collected_at) ASC
            LIMIT 30;
        """)

        rows = cur.fetchall()

        return [
            {
                "date": row[0].isoformat(),
                "players": int(row[1] or 0),
            }
            for row in rows
        ]

    finally:

        cur.close()
        conn.close()


# ============================================================
# TOP GAMES BY CURRENT PLAYERS
# ============================================================

@router.get("/top-games")
def top_games(limit: int = 10):

    if limit < 1:
        limit = 10

    if limit > 50:
        limit = 50

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            SELECT
                g.appid,
                g.name,
                latest.player_count
            FROM gamehub_analytics.games g

            JOIN (
                SELECT DISTINCT ON (appid)
                    appid,
                    player_count,
                    collected_at
                FROM gamehub_analytics.player_history
                ORDER BY
                    appid,
                    collected_at DESC
            ) latest
                ON g.appid = latest.appid

            ORDER BY latest.player_count DESC

            LIMIT %s;
        """, (limit,))

        rows = cur.fetchall()

        return [
            {
                "appid": row[0],
                "name": row[1],
                "players": int(row[2] or 0),
            }
            for row in rows
        ]

    finally:

        cur.close()
        conn.close()


# ============================================================
# REVIEW SENTIMENT
# ============================================================

@router.get("/reviews")
def review_trends():

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            SELECT
                COALESCE(SUM(positive_reviews), 0),
                COALESCE(SUM(negative_reviews), 0)
            FROM gamehub_analytics.games;
        """)

        row = cur.fetchone()

        positive = int(row[0] or 0)
        negative = int(row[1] or 0)

        return {
            "positive": positive,
            "negative": negative,
        }

    finally:

        cur.close()
        conn.close()


# ============================================================
# PRICE DISTRIBUTION
# ============================================================

@router.get("/prices")
def price_distribution():

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            SELECT
                COUNT(
                    CASE
                        WHEN is_free = TRUE
                             OR COALESCE(current_price, 0) = 0
                        THEN 1
                    END
                ) AS free_games,

                COUNT(
                    CASE
                        WHEN current_price > 0
                             AND current_price < 5
                        THEN 1
                    END
                ) AS under_5,

                COUNT(
                    CASE
                        WHEN current_price >= 5
                             AND current_price < 10
                        THEN 1
                    END
                ) AS five_to_ten,

                COUNT(
                    CASE
                        WHEN current_price >= 10
                             AND current_price < 20
                        THEN 1
                    END
                ) AS ten_to_twenty,

                COUNT(
                    CASE
                        WHEN current_price >= 20
                        THEN 1
                    END
                ) AS twenty_plus

            FROM gamehub_analytics.games;
        """)

        row = cur.fetchone()

        return [
            {
                "name": "Free",
                "value": int(row[0] or 0),
            },
            {
                "name": "$0–$5",
                "value": int(row[1] or 0),
            },
            {
                "name": "$5–$10",
                "value": int(row[2] or 0),
            },
            {
                "name": "$10–$20",
                "value": int(row[3] or 0),
            },
            {
                "name": "$20+",
                "value": int(row[4] or 0),
            },
        ]

    finally:

        cur.close()
        conn.close()