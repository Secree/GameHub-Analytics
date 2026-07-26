from etl.extract.steam import get_game_details
from etl.extract.steamspy import get_steamspy_details
from etl.extract.player_history import get_player_history

from etl.transform.steam import transform_game
from etl.transform.steamspy import transform_tags
from etl.transform.player_history import transform_player_history
from etl.transform.price_history import transform_price_history
from etl.transform.review_history import transform_review_history

from etl.load.games import load_game
from etl.load.tags import load_tags
from etl.load.player_history import load_player_history
from etl.load.price_history import load_price_history
from etl.load.review_history import load_review_history
from etl.load.genres import load_genres
from etl.load.developers import load_developers
from etl.load.publishers import load_publishers

from etl.load.batch import (
    get_unprocessed_games,
    mark_processed,
)

BATCH_SIZE = 500


def process_game(appid: int):

    # ----------------------------
    # Extract
    # ----------------------------

    game_raw = get_game_details(appid)

    if (
        str(appid) not in game_raw
        or not game_raw[str(appid)]["success"]
    ):
        print(f"Skipping {appid}: unavailable on Steam")
        mark_processed(appid)
        return

    spy_raw = get_steamspy_details(appid)

    player_raw = get_player_history(appid)

    # ----------------------------
    # Transform
    # ----------------------------

    game = transform_game(
        appid,
        game_raw,
        spy_raw,
    )

    tags = transform_tags(spy_raw)

    player = transform_player_history(
        appid,
        player_raw,
    )

    # ----------------------------
    # Load
    # ----------------------------

    load_game(game)

    load_genres(
        appid,
        game["genres"],
    )

    load_developers(
        appid,
        game["developers"],
    )

    load_publishers(
        appid,
        game["publishers"],
    )

    load_tags(
        appid,
        tags,
    )

    load_player_history(player)

    price = transform_price_history(game)
    load_price_history(price)

    load_review_history(game)

    mark_processed(appid)

    print(f"✓ {appid} - {game['name']}")


def main():

    appids = get_unprocessed_games(BATCH_SIZE)

    print(f"Processing {len(appids)} games...")

    for appid in appids:

        try:

            process_game(appid)

        except Exception as e:

            print(f"Failed {appid}: {e}")

    print("Batch completed.")


if __name__ == "__main__":
    main()