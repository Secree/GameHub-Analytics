from database import get_connection


def load_game(game: dict):

    query = """
    INSERT INTO gamehub_analytics.games (
        appid,
        name,
        developer,
        publisher,
        release_date,
        price,
        genre,
        steam_url,
        header_image,
        short_description,
        metacritic_score,
        is_free,

        owners,
        average_forever,
        median_forever,
        positive_reviews,
        negative_reviews,
        score_rank,
        initial_price,
        current_price
    )
    VALUES (
        %s,%s,%s,%s,%s,%s,
        %s,%s,%s,%s,%s,%s,
        %s,%s,%s,%s,%s,%s,%s,%s
    )

    ON CONFLICT (appid)
    DO UPDATE SET
        name = EXCLUDED.name,
        developer = EXCLUDED.developer,
        publisher = EXCLUDED.publisher,
        release_date = EXCLUDED.release_date,
        price = EXCLUDED.price,
        genre = EXCLUDED.genre,
        steam_url = EXCLUDED.steam_url,
        header_image = EXCLUDED.header_image,
        short_description = EXCLUDED.short_description,
        metacritic_score = EXCLUDED.metacritic_score,
        is_free = EXCLUDED.is_free,

        owners = EXCLUDED.owners,
        average_forever = EXCLUDED.average_forever,
        median_forever = EXCLUDED.median_forever,
        positive_reviews = EXCLUDED.positive_reviews,
        negative_reviews = EXCLUDED.negative_reviews,
        score_rank = EXCLUDED.score_rank,
        initial_price = EXCLUDED.initial_price,
        current_price = EXCLUDED.current_price,

        updated_at = CURRENT_TIMESTAMP;
    """

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        query,
        (
            game["appid"],
            game["name"],
            game["developer"],
            game["publisher"],
            game["release_date"],
            game["price"],
            game["genre"],
            game["steam_url"],
            game["header_image"],
            game["short_description"],
            game["metacritic_score"],
            game["is_free"],

            game["owners"],
            game["average_forever"],
            game["median_forever"],
            game["positive_reviews"],
            game["negative_reviews"],
            game["score_rank"],
            game["initial_price"],
            game["current_price"],
        ),
    )

    conn.commit()

    cur.close()
    conn.close()