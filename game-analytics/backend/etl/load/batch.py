from database import get_connection
from psycopg2.extras import execute_values


SEED_BATCH_SIZE = 200000


def seed_games(apps):

    conn = get_connection()
    cur = conn.cursor()

    total = len(apps)

    for start in range(0, total, SEED_BATCH_SIZE):
        batch = apps[start:start + SEED_BATCH_SIZE]
        values = [
            (app["appid"], app["name"], False)
            for app in batch
        ]

        execute_values(
            cur,
            """
            INSERT INTO gamehub_analytics.games
            (
                appid,
                name,
                processed
            )
            VALUES %s
            ON CONFLICT (appid)
            DO NOTHING;
            """,
            values,
            page_size=SEED_BATCH_SIZE,
        )
        conn.commit()
        print(
            f"Seeded {min(start + len(batch), total)}/{total} apps",
            flush=True,
        )

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