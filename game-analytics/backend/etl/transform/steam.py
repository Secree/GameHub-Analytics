from datetime import datetime


def to_price(value):

    if value in (None, ""):
        return None

    try:
        return float(value) / 100
    except (TypeError, ValueError):
        return None


def transform_game(appid: int, store_raw: dict, spy: dict):

    app = store_raw.get(str(appid))

    if not app or not app.get("success"):
        return None

    game = app["data"]

    # Steam Store price
    if game.get("is_free"):
        price = 0

    elif game.get("price_overview"):
        price = game["price_overview"]["final"] / 100

    else:
        price = None

    # Release date
    release_date = None

    try:
        release_date = datetime.strptime(
            game["release_date"]["date"],
            "%d %b, %Y",
        ).date()

    except Exception:
        pass

    # SteamSpy values
    initial_price = to_price(spy.get("initialprice"))
    current_price = to_price(spy.get("price"))

    score_rank = spy.get("score_rank")

    if score_rank == "":
        score_rank = None

    # Lists (for normalized tables)
    developers = game.get("developers", [])

    publishers = game.get("publishers", [])

    genres = [
        genre["description"]
        for genre in game.get("genres", [])
    ]

    return {

        # -----------------------------
        # Main Game Table
        # -----------------------------
        "appid": appid,

        "name": game.get("name"),

        # Keep old text columns
        "developer": ", ".join(developers),

        "publisher": ", ".join(publishers),

        "genre": ", ".join(genres),

        "release_date": release_date,

        "price": price,

        "steam_url": f"https://store.steampowered.com/app/{appid}",

        "header_image": game.get("header_image"),

        "short_description": game.get("short_description"),

        "metacritic_score": (
            game.get("metacritic", {}).get("score")
        ),

        "is_free": game.get("is_free"),

        # -----------------------------
        # SteamSpy Columns
        # -----------------------------
        "owners": spy.get("owners"),

        "average_forever": spy.get("average_forever"),

        "median_forever": spy.get("median_forever"),

        "positive_reviews": spy.get("positive"),

        "negative_reviews": spy.get("negative"),

        "score_rank": score_rank,

        "initial_price": initial_price,

        "current_price": current_price,

        # -----------------------------
        # Normalized Tables
        # -----------------------------
        "developers": developers,

        "publishers": publishers,

        "genres": genres,
    }