import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.games import router as games_router
from routes.dashboard import router as dashboard_router
from routes.trends import router as trends_router

app = FastAPI()

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://game-hub-analytics.vercel.app",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games_router)
app.include_router(dashboard_router)
app.include_router(trends_router)