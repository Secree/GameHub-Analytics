from database import get_connection

from etl.extract.player_history import get_player_history
from etl.load.player_history import load_player_history


def get_all_appids():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT appid
        FROM gamehub_analytics.games
        ORDER BY appid;
    """)

    appids = [
        row[0]
        for row in cur.fetchall()
    ]

    cur.close()
    conn.close()

    return appids


def main():

    appids = get_all_appids()

    total = len(appids)

    print(f"Updating player counts for {total} games...")
    print()

    success = 0
    unavailable = 0
    failed = 0

    for index, appid in enumerate(appids, start=1):

        print(
            f"[{index}/{total}] "
            f"Checking {appid}..."
        )

        try:

            player = get_player_history(appid)

            # Steam did not provide player data
            if player is None:

                unavailable += 1

                continue

            load_player_history(player)

            success += 1

            print(
                f"✓ {appid} - "
                f"{player['player_count']:,} players"
            )

        except Exception as e:

            failed += 1

            print(
                f"✗ {appid}: {e}"
            )

    print()
    print("==============================")
    print("Player update completed")
    print("==============================")

    print(f"Total games: {total}")
    print(f"Updated: {success}")
    print(f"No player data: {unavailable}")
    print(f"Failed: {failed}")


if __name__ == "__main__":
    main()