from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.games import router as games_router

app = FastAPI(
    title="GameHub Analytics API",
    description="Backend API for GameHub Analytics",
    version="1.0.0",
)

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "GameHub Analytics API is running!",
        "status": "online",
        "version": "1.0.0",
    }

# Health check
@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy"
    }

# Register routes
app.include_router(games_router, prefix="/api/games", tags=["Games"])