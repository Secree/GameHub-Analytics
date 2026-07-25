import requests

URL = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/"


def get_current_players(appid: int):

    response = requests.get(
        URL,
        params={"appid": appid},
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    return {
        "appid": appid,
        "player_count": data["response"]["player_count"],
    }