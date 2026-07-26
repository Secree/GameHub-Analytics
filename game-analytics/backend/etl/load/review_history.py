from database import get_connection


def load_review_history(review):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO gamehub_analytics.review_history
        (
            appid,
            positive_reviews,
            negative_reviews
        )
        VALUES (%s, %s, %s);
        """,
        (
            review["appid"],
            review["positive_reviews"],
            review["negative_reviews"],
        ),
    )

    conn.commit()
    cur.close()
    conn.close()