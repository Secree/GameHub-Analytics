from database import get_connection


def load_price_history(price):

    if not price:
        return

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            INSERT INTO gamehub_analytics.price_history
            (
                appid,
                price,
                discount_percent
            )
            VALUES
            (
                %s,
                %s,
                %s
            );
            """,
            (
                price["appid"],
                price["price"],
                price["discount_percent"],
            )
        )

        conn.commit()

    finally:

        cur.close()
        conn.close()