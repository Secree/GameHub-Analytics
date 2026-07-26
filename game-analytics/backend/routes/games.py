from fastapi import APIRouter
from database import get_connection

router = APIRouter(
    prefix="/games",
    tags=["Games"]
)


@router.get("/search")
def search_games(q: str):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT
            appid,
            name,
            header_image
        FROM gamehub_analytics.games
        WHERE LOWER(name) LIKE LOWER(%s)
        ORDER BY name
        LIMIT 20;
        """,
        (f"%{q}%",)
    )

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "appid": row[0],
            "name": row[1],
            "image": row[2],
        }
        for row in rows
    ]


@router.get("/{appid}")
def get_game(appid: int):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT *
        FROM gamehub_analytics.games
        WHERE appid = %s;
        """,
        (appid,)
    )

    row = cur.fetchone()

    if row is None:

        cur.close()
        conn.close()

        return {
            "error": "Game not found"
        }

    columns = [desc[0] for desc in cur.description]

    game = dict(zip(columns, row))

    cur.close()
    conn.close()

    return game