from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.games import router as games_router
from routes.dashboard import router as dashboard_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games_router)
app.include_router(dashboard_router)