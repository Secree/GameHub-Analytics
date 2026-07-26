import json
from pathlib import Path

import requests

URL = "https://store.steampowered.com/api/appdetails"


def get_game_details(appid: int):

    response = requests.get(
        URL,
        params={
            "appids": appid,
            "l": "english",          # Force English
        },
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    raw_dir = Path("etl/raw/steam")
    raw_dir.mkdir(parents=True, exist_ok=True)

    with open(raw_dir / f"{appid}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    return data