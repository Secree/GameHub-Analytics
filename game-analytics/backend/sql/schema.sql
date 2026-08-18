DROP SCHEMA IF EXISTS gamehub_analytics CASCADE;

CREATE SCHEMA gamehub_analytics;

-------------------------------------------------------
-- Games
-------------------------------------------------------

CREATE TABLE gamehub_analytics.games
(
    appid INTEGER PRIMARY KEY,

    name TEXT NOT NULL,

    developer TEXT,

    publisher TEXT,

    genre TEXT,

    release_date DATE,

    price NUMERIC(10,2),

    steam_url TEXT,

    header_image TEXT,

    short_description TEXT,

    metacritic_score INTEGER,

    is_free BOOLEAN,

    owners TEXT,

    average_forever INTEGER,

    median_forever INTEGER,

    positive_reviews INTEGER,

    negative_reviews INTEGER,

    score_rank INTEGER,

    initial_price NUMERIC(10,2),

    current_price NUMERIC(10,2),

    processed BOOLEAN DEFAULT FALSE,

    processed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()
);

-------------------------------------------------------
-- Player History
-------------------------------------------------------

CREATE TABLE gamehub_analytics.player_history
(
    id SERIAL PRIMARY KEY,

    appid INTEGER NOT NULL,

    player_count INTEGER NOT NULL,

    collected_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (appid)
        REFERENCES gamehub_analytics.games(appid)
        ON DELETE CASCADE
);

-------------------------------------------------------
-- Price History
-------------------------------------------------------

CREATE TABLE gamehub_analytics.price_history
(
    id SERIAL PRIMARY KEY,

    appid INTEGER NOT NULL,

    price NUMERIC(10,2),

    discount_percent INTEGER,

    collected_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (appid)
        REFERENCES gamehub_analytics.games(appid)
        ON DELETE CASCADE
);

-------------------------------------------------------
-- Review History
-------------------------------------------------------

CREATE TABLE gamehub_analytics.review_history
(
    id SERIAL PRIMARY KEY,

    appid INTEGER NOT NULL,

    positive_reviews INTEGER,

    negative_reviews INTEGER,

    collected_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (appid)
        REFERENCES gamehub_analytics.games(appid)
        ON DELETE CASCADE
);

-------------------------------------------------------
-- Genres
-------------------------------------------------------

CREATE TABLE gamehub_analytics.genres
(
    genre_id SERIAL PRIMARY KEY,

    genre_name TEXT UNIQUE NOT NULL
);

CREATE TABLE gamehub_analytics.game_genres
(
    appid INTEGER,

    genre_id INTEGER,

    PRIMARY KEY(appid, genre_id),

    FOREIGN KEY(appid)
        REFERENCES gamehub_analytics.games(appid)
        ON DELETE CASCADE,

    FOREIGN KEY(genre_id)
        REFERENCES gamehub_analytics.genres(genre_id)
        ON DELETE CASCADE
);

-------------------------------------------------------
-- Developers
-------------------------------------------------------

CREATE TABLE gamehub_analytics.developers
(
    developer_id SERIAL PRIMARY KEY,

    developer_name TEXT UNIQUE NOT NULL
);

CREATE TABLE gamehub_analytics.game_developers
(
    appid INTEGER,

    developer_id INTEGER,

    PRIMARY KEY(appid, developer_id),

    FOREIGN KEY(appid)
        REFERENCES gamehub_analytics.games(appid)
        ON DELETE CASCADE,

    FOREIGN KEY(developer_id)
        REFERENCES gamehub_analytics.developers(developer_id)
        ON DELETE CASCADE
);

-------------------------------------------------------
-- Publishers
-------------------------------------------------------

CREATE TABLE gamehub_analytics.publishers
(
    publisher_id SERIAL PRIMARY KEY,

    publisher_name TEXT UNIQUE NOT NULL
);

CREATE TABLE gamehub_analytics.game_publishers
(
    appid INTEGER,

    publisher_id INTEGER,

    PRIMARY KEY(appid, publisher_id),

    FOREIGN KEY(appid)
        REFERENCES gamehub_analytics.games(appid)
        ON DELETE CASCADE,

    FOREIGN KEY(publisher_id)
        REFERENCES gamehub_analytics.publishers(publisher_id)
        ON DELETE CASCADE
);

-------------------------------------------------------
-- Tags
-------------------------------------------------------

CREATE TABLE gamehub_analytics.tags
(
    tag_id SERIAL PRIMARY KEY,

    tag_name TEXT UNIQUE NOT NULL
);

CREATE TABLE gamehub_analytics.game_tags
(
    appid INTEGER,

    tag_id INTEGER,

    votes INTEGER,

    PRIMARY KEY(appid, tag_id),

    FOREIGN KEY(appid)
        REFERENCES gamehub_analytics.games(appid)
        ON DELETE CASCADE,

    FOREIGN KEY(tag_id)
        REFERENCES gamehub_analytics.tags(tag_id)
        ON DELETE CASCADE
);

-------------------------------------------------------
-- Indexes
-------------------------------------------------------

CREATE INDEX idx_games_name
ON gamehub_analytics.games(name);

CREATE INDEX idx_games_release
ON gamehub_analytics.games(release_date);

CREATE INDEX idx_player_history_appid
ON gamehub_analytics.player_history(appid);

CREATE INDEX idx_player_history_time
ON gamehub_analytics.player_history(collected_at);

CREATE INDEX idx_price_history_appid
ON gamehub_analytics.price_history(appid);

CREATE INDEX idx_review_history_appid
ON gamehub_analytics.review_history(appid);

CREATE INDEX idx_game_genres
ON gamehub_analytics.game_genres(appid);

CREATE INDEX idx_game_tags
ON gamehub_analytics.game_tags(appid);

CREATE INDEX idx_game_developers
ON gamehub_analytics.game_developers(appid);

CREATE INDEX idx_game_publishers
ON gamehub_analytics.game_publishers(appid);