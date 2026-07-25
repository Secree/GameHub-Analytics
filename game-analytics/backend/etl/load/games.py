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
        is_free
    )
    VALUES (
        %s,%s,%s,%s,%s,%s,
        %s,%s,%s,%s,%s,%s
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
        ),
    )

    conn.commit()

    cur.close()
    conn.close()