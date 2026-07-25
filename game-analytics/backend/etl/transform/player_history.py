def transform_player_history(appid: int, raw: dict):

    return {
        "appid": appid,
        "player_count": raw["response"]["player_count"],
    }