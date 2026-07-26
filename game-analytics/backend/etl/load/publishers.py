from database import get_connection


def load_publishers(appid: int, publishers: list):

    if not publishers:
        return

    conn = get_connection()
    cur = conn.cursor()

    for publisher in publishers:

        # Insert publisher if it doesn't exist
        cur.execute(
            """
            INSERT INTO gamehub_analytics.publishers
            (
                publisher_name
            )
            VALUES
            (
                %s
            )
            ON CONFLICT (publisher_name)
            DO NOTHING;
            """,
            (publisher,),
        )

        # Get publisher_id
        cur.execute(
            """
            SELECT publisher_id
            FROM gamehub_analytics.publishers
            WHERE publisher_name = %s;
            """,
            (publisher,),
        )

        row = cur.fetchone()

        if row is None:
            continue

        publisher_id = row[0]

        # Link game to publisher
        cur.execute(
            """
            INSERT INTO gamehub_analytics.game_publishers
            (
                appid,
                publisher_id
            )
            VALUES
            (
                %s,
                %s
            )

            ON CONFLICT (appid, publisher_id)
            DO NOTHING;
            """,
            (
                appid,
                publisher_id,
            ),
        )

    conn.commit()

    cur.close()
    conn.close()