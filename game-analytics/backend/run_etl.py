from etl.extract.steam import get_game_details
from etl.extract.steamspy import get_steamspy_details
from etl.extract.player_history import get_player_history

from etl.transform.steam import transform_game
from etl.transform.steamspy import transform_tags
from etl.transform.player_history import transform_player_history

from etl.load.games import load_game
from etl.load.tags import load_tags
from etl.load.player_history import load_player_history

APPID = 3557620

# Games
game_raw = get_game_details(APPID)
game = transform_game(APPID, game_raw)
load_game(game)

# SteamSpy
spy_raw = get_steamspy_details(APPID)
tags = transform_tags(spy_raw)
load_tags(APPID, tags)

# Player history
player_raw = get_player_history(APPID)
player = transform_player_history(APPID, player_raw)
load_player_history(player)

print("ETL completed successfully.")