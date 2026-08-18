from database import get_connection


def load_player_history(player):

    if not player:
        return

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            INSERT INTO gamehub_analytics.player_history
            (
                appid,
                player_count,
                collected_at
            )
            VALUES
            (
                %s,
                %s,
                %s
            );
            """,
            (
                player["appid"],
                player["player_count"],
                player["collected_at"],
            )
        )

        conn.commit()

    finally:

        cur.close()
        conn.close()