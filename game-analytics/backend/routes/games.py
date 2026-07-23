from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_games():
    return [
        {
            "appid": 730,
            "name": "Counter-Strike 2",
            "players": 1287643
        }
    ]