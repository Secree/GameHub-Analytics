from database import get_connection


def seed_games(apps):

    conn = get_connection()
    cur = conn.cursor()

    for app in apps:

        cur.execute(
            """
            INSERT INTO gamehub_analytics.games
            (
                appid,
                name,
                processed
            )
            VALUES
            (
                %s,
                %s,
                FALSE
            )

            ON CONFLICT (appid)
            DO NOTHING;
            """,
            (
                app["appid"],
                app["name"]
            )
        )

    conn.commit()

    cur.close()
    conn.close()


def get_unprocessed_games(limit=100):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT appid
        FROM gamehub_analytics.games
        WHERE processed = FALSE
        ORDER BY appid
        LIMIT %s;
        """,
        (limit,)
    )

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [row[0] for row in rows]


def mark_processed(appid):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE gamehub_analytics.games
        SET
            processed = TRUE,
            processed_at = CURRENT_TIMESTAMP
        WHERE appid = %s;
        """,
        (appid,)
    )

    conn.commit()

    cur.close()
    conn.close()