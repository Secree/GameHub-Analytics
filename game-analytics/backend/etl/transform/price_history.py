def transform_price_history(game: dict):

    return {
        "appid": game["appid"],
        "price": game["current_price"],
        "discount_percent": game.get("discount_percent", 0),
    }