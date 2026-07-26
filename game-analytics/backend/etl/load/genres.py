from database import get_connection


def load_genres(appid: int, genres: list):

    if not genres:
        return

    conn = get_connection()
    cur = conn.cursor()

    for genre in genres:

        # Insert genre if it doesn't exist
        cur.execute(
            """
            INSERT INTO gamehub_analytics.genres
            (
                genre_name
            )
            VALUES
            (
                %s
            )
            ON CONFLICT (genre_name)
            DO NOTHING;
            """,
            (genre,),
        )

        # Get genre_id
        cur.execute(
            """
            SELECT genre_id
            FROM gamehub_analytics.genres
            WHERE genre_name = %s;
            """,
            (genre,),
        )

        row = cur.fetchone()

        if row is None:
            continue

        genre_id = row[0]

        # Link game to genre
        cur.execute(
            """
            INSERT INTO gamehub_analytics.game_genres
            (
                appid,
                genre_id
            )
            VALUES
            (
                %s,
                %s
            )

            ON CONFLICT (appid, genre_id)
            DO NOTHING;
            """,
            (
                appid,
                genre_id,
            ),
        )

    conn.commit()

    cur.close()
    conn.close()