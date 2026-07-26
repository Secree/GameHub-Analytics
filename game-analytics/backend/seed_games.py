from etl.extract.app_loader import load_app_list
from etl.load.batch import seed_games

apps = load_app_list()

seed_games(apps)

print(f"Inserted {len(apps)} Steam apps.")