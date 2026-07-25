import json
from pathlib import Path

import requests

STEAMSPY_URL = "https://steamspy.com/api.php"


def get_steamspy_details(appid: int):

    response = requests.get(
        STEAMSPY_URL,
        params={
            "request": "appdetails",
            "appid": appid,
        },
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    raw_dir = Path("etl/raw/steamspy")
    raw_dir.mkdir(parents=True, exist_ok=True)

    with open(raw_dir / f"{appid}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    return data