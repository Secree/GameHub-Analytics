from datetime import datetime


def transform_game(appid: int, store_raw: dict):

    game = store_raw[str(appid)]["data"]

    if game.get("is_free"):
        price = 0
    elif game.get("price_overview"):
        price = game["price_overview"]["final"] / 100
    else:
        price = None

    release_date = None

    try:
        release_date = datetime.strptime(
            game["release_date"]["date"],
            "%d %b, %Y",
        ).date()
    except Exception:
        pass

    return {
        "appid": appid,
        "name": game.get("name"),
        "developer": ", ".join(game.get("developers", [])),
        "publisher": ", ".join(game.get("publishers", [])),
        "release_date": release_date,
        "price": price,
        "genre": ", ".join(
            g["description"]
            for g in game.get("genres", [])
        ),
        "steam_url": f"https://store.steampowered.com/app/{appid}",
        "header_image": game.get("header_image"),
        "short_description": game.get("short_description"),
        "metacritic_score": (
            game.get("metacritic", {}).get("score")
        ),
        "is_free": game.get("is_free"),
    }