import json
from pathlib import Path
import requests

URL = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/"


def get_player_history(appid: int):

    response = requests.get(
        URL,
        params={"appid": appid},
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    raw_dir = Path("etl/raw/player_history")
    raw_dir.mkdir(parents=True, exist_ok=True)

    with open(raw_dir / f"{appid}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    return data