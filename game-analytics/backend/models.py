from datetime import datetime
from datetime import date

from sqlalchemy import (
    Integer,
    String,
    Numeric,
    Date,
    DateTime,
    Boolean,
    ForeignKey,
    Text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from database import Base


class Game(Base):
    __tablename__ = "games"
    __table_args__ = {"schema": "gamehub_analytics"}

    appid: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    developer: Mapped[str | None] = mapped_column(String(255))
    publisher: Mapped[str | None] = mapped_column(String(255))

    release_date: Mapped[date | None] = mapped_column(Date)

    price: Mapped[float | None] = mapped_column(Numeric(10, 2))

    genre: Mapped[str | None] = mapped_column(String(255))

    steam_url: Mapped[str | None] = mapped_column(Text)

    header_image: Mapped[str | None] = mapped_column(Text)

    short_description: Mapped[str | None] = mapped_column(Text)

    metacritic_score: Mapped[int | None] = mapped_column(Integer)

    is_free: Mapped[bool | None] = mapped_column(Boolean)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    player_history = relationship(
        "PlayerHistory",
        back_populates="game",
        cascade="all, delete-orphan",
    )

    game_tags = relationship(
        "GameTag",
        back_populates="game",
        cascade="all, delete-orphan",
    )


class PlayerHistory(Base):
    __tablename__ = "player_history"
    __table_args__ = {"schema": "gamehub_analytics"}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    appid: Mapped[int] = mapped_column(
        ForeignKey("gamehub_analytics.games.appid"),
        nullable=False,
    )

    player_count: Mapped[int] = mapped_column(Integer, nullable=False)

    collected_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    game = relationship(
        "Game",
        back_populates="player_history",
    )


class Tag(Base):
    __tablename__ = "tags"
    __table_args__ = {"schema": "gamehub_analytics"}

    tag_id: Mapped[int] = mapped_column(Integer, primary_key=True)

    tag_name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    game_tags = relationship(
        "GameTag",
        back_populates="tag",
        cascade="all, delete-orphan",
    )


class GameTag(Base):
    __tablename__ = "game_tags"
    __table_args__ = {"schema": "gamehub_analytics"}

    appid: Mapped[int] = mapped_column(
        ForeignKey("gamehub_analytics.games.appid"),
        primary_key=True,
    )

    tag_id: Mapped[int] = mapped_column(
        ForeignKey("gamehub_analytics.tags.tag_id"),
        primary_key=True,
    )

    votes: Mapped[int | None] = mapped_column(Integer)

    game = relationship(
        "Game",
        back_populates="game_tags",
    )

    tag = relationship(
        "Tag",
        back_populates="game_tags",
    )