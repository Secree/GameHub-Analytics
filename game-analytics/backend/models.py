from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    Numeric,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from database import Base


class Game(Base):
    __tablename__ = "games"
    __table_args__ = {"schema": "gamehub_analytics"}

    appid: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    developer: Mapped[str | None] = mapped_column(String(255))
    publisher: Mapped[str | None] = mapped_column(String(255))
    release_date: Mapped[Date | None] = mapped_column(Date)
    price: Mapped[float | None] = mapped_column(Numeric(10, 2))
    genre: Mapped[str | None] = mapped_column(String(255))

    player_history = relationship(
        "PlayerHistory",
        back_populates="game"
    )


class PlayerHistory(Base):
    __tablename__ = "player_history"
    __table_args__ = {"schema": "gamehub_analytics"}

    id: Mapped[int] = mapped_column(primary_key=True)

    appid: Mapped[int] = mapped_column(
        ForeignKey("gamehub_analytics.games.appid")
    )

    player_count: Mapped[int]

    collected_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    game = relationship(
        "Game",
        back_populates="player_history"
    )