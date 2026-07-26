from etl.extract.steam_apps import get_app_list

apps = get_app_list()

print(f"Downloaded {len(apps)} apps successfully!")