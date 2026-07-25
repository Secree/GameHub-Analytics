from database import get_connection


def load_tags(appid: int, tags):

    if not tags:
        print(f"No SteamSpy tags found for appid {appid}")
        return

    conn = get_connection()
    cur = conn.cursor()

    if isinstance(tags, dict):
        iterable = tags.items()

    elif isinstance(tags, list):
        iterable = [(tag, None) for tag in tags]

    else:
        iterable = []

    for tag_name, votes in iterable:

        cur.execute(
            """
            INSERT INTO gamehub_analytics.tags(tag_name)
            VALUES (%s)
            ON CONFLICT(tag_name)
            DO NOTHING;
            """,
            (tag_name,),
        )

        cur.execute(
            """
            SELECT tag_id
            FROM gamehub_analytics.tags
            WHERE tag_name=%s;
            """,
            (tag_name,),
        )

        tag_id = cur.fetchone()[0]

        cur.execute(
            """
            INSERT INTO gamehub_analytics.game_tags
            (
                appid,
                tag_id,
                votes
            )
            VALUES (%s,%s,%s)

            ON CONFLICT (appid, tag_id)
            DO UPDATE SET
                votes = EXCLUDED.votes;
            """,
            (appid, tag_id, votes),
        )

    conn.commit()

    cur.close()
    conn.close()