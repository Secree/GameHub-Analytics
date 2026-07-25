from database import get_connection


def load_player_history(data: dict):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO gamehub_analytics.player_history
        (
            appid,
            player_count
        )
        VALUES (%s, %s);
        """,
        (
            data["appid"],
            data["player_count"],
        ),
    )

    conn.commit()

    cur.close()
    conn.close()