from database import get_connection


def load_developers(appid: int, developers: list):

    if not developers:
        return

    conn = get_connection()
    cur = conn.cursor()

    for developer in developers:

        # Insert developer if it doesn't exist
        cur.execute(
            """
            INSERT INTO gamehub_analytics.developers
            (
                developer_name
            )
            VALUES
            (
                %s
            )
            ON CONFLICT (developer_name)
            DO NOTHING;
            """,
            (developer,),
        )

        # Get developer_id
        cur.execute(
            """
            SELECT developer_id
            FROM gamehub_analytics.developers
            WHERE developer_name = %s;
            """,
            (developer,),
        )

        row = cur.fetchone()

        if row is None:
            continue

        developer_id = row[0]

        # Link game to developer
        cur.execute(
            """
            INSERT INTO gamehub_analytics.game_developers
            (
                appid,
                developer_id
            )
            VALUES
            (
                %s,
                %s
            )

            ON CONFLICT (appid, developer_id)
            DO NOTHING;
            """,
            (
                appid,
                developer_id,
            ),
        )

    conn.commit()

    cur.close()
    conn.close()