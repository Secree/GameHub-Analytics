import json


def load_app_list():

    with open(
        "etl/raw/steam_apps/steam_apps.json",
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)