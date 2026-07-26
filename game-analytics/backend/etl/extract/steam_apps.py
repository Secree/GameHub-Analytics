import json
from pathlib import Path
import requests

from config import STEAM_API_KEY

URL = "https://api.steampowered.com/IStoreService/GetAppList/v1/"


def get_app_list():

    all_apps = []
    last_appid = 0

    while True:

        response = requests.get(
            URL,
            headers={
                "x-webapi-key": STEAM_API_KEY
            },
            params={
                "include_games": True,
                "include_dlc": False,
                "include_software": False,
                "include_videos": False,
                "include_hardware": False,
                "max_results": 50000,
                "last_appid": last_appid,
            },
            timeout=60,
        )

        response.raise_for_status()

        data = response.json()

        response_data = data.get("response", {})

        apps = response_data.get("apps", [])

        if not apps:
            print("Finished downloading app list.")
            break

        all_apps.extend(apps)

        last_appid = apps[-1]["appid"]

        print(f"Downloaded {len(all_apps)} apps...")

        if not response_data.get("have_more_results", False):
            break

    raw_dir = Path("etl/raw/steam_apps")
    raw_dir.mkdir(parents=True, exist_ok=True)

    with open(raw_dir / "steam_apps.json", "w", encoding="utf-8") as f:
        json.dump(all_apps, f, indent=4)

    return all_apps