import requests
from datetime import datetime


STEAM_PLAYER_URL = (
    "https://api.steampowered.com/"
    "ISteamUserStats/GetNumberOfCurrentPlayers/v1/"
)


def get_player_history(appid: int):

    try:
        response = requests.get(
            STEAM_PLAYER_URL,
            params={
                "appid": appid
            },
            timeout=10,
        )

        # Some Steam games do not provide player-count data
        if response.status_code == 404:
            print(f"No player data for {appid}")
            return None

        response.raise_for_status()

        data = response.json()

        response_data = data.get("response")

        if not response_data:
            print(f"No player data for {appid}")
            return None

        player_count = response_data.get("player_count")

        if player_count is None:
            print(f"No player count for {appid}")
            return None

        return {
            "appid": appid,
            "player_count": player_count,
            "collected_at": datetime.now(),
        }

    except requests.RequestException as e:

        print(f"Request failed for {appid}: {e}")

        return None