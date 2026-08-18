def transform_price_history(game):

    if not game:
        return None

    initial_price = game.get("initial_price")
    current_price = game.get("current_price")

    discount_percent = 0

    if (
        initial_price is not None
        and current_price is not None
        and initial_price > 0
    ):
        discount_percent = round(
            (
                (initial_price - current_price)
                / initial_price
            ) * 100
        )

    return {
        "appid": game["appid"],
        "price": current_price,
        "discount_percent": discount_percent,
    }