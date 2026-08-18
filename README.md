# 🎮 GameHub Analytics

GameHub Analytics is a full-stack Steam game analytics platform. It collects game data from Steam and SteamSpy, stores the processed data in PostgreSQL, exposes the data through a FastAPI backend, and presents it in a React dashboard.

The project is designed to practice **ETL, data modeling, SQL, REST APIs, data visualization, and full-stack development** in one application.

---

## 📌 What the Project Does

GameHub Analytics lets users:

- Browse games from the database
- Search for games
- Open an individual game profile
- Filter games by genre and community tags
- Combine tags using **OR** or **AND** filtering
- Sort games by name, price, reviews, or release date
- Sort in ascending or descending order
- Browse games using pagination
- View dashboard statistics
- View genre and community-tag charts
- View trending games
- View player history for individual games
- Explore player-related analytics

---

## 🏗️ Project Architecture

```text
              ┌─────────────────┐
              │    Steam API    │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │    SteamSpy     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   Python ETL    │
              │ Extract/Transform│
              │      /Load      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │  gamehub_analytics│
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │     FastAPI     │
              │      REST API   │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │      React      │
              │   Dashboard/UI  │
              └─────────────────┘
```

---

## 🧰 Technologies Used

### Frontend

- React
- TypeScript
- Vite
- React Router
- Recharts
- CSS
- Axios

### Backend

- Python
- FastAPI
- Uvicorn
- psycopg2

### Data / ETL

- Python
- Requests
- Steam Web API
- SteamSpy API
- PostgreSQL

### Development Tools

- Git
- GitHub
- VS Code
- Postman

---

## 📂 Project Structure

```text
GameHub-Analytics/
│
├── game-analytics/
│   │
│   ├── backend/
│   │   │
│   │   ├── etl/
│   │   │   ├── routes/
│   │   │   │   ├── games.py
│   │   │   │   ├── dashboard.py
│   │   │   │   └── trends.py
│   │   │   │
│   │   │   ├── raw/
│   │   │   ├── database.py
│   │   │   ├── main.py
│   │   │   ├── run_etl.py
│   │   │   └── update_players.py
│   │   │
│   │   └── ...
│   │   │
│   └── frontend/
│       │
│       ├── src/
│       │   ├── components/
│       │   │   ├── Navbar.tsx
│       │   │   ├── SearchBar.tsx
│       │   │   ├── StatCard.tsx
│       │   │   ├── GameChart_Pie.tsx
│       │   │   └── GameChart_Bar.tsx
│       │   │
│       │   ├── pages/
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Games.tsx
│       │   │   ├── GamePage.tsx
│       │   │   └── Trends.tsx
│       │   │
│       │   ├── services/
│       │   │   ├── api.ts
│       │   │   ├── games.ts
│       │   │   ├── dashboard.ts
│       │   │   └── trends.ts
│       │   │
│       │   └── styles/
│       │       ├── Dashboard.css
│       │       ├── Games.css
│       │       ├── GamePage.css
│       │       └── Trends.css
│       │
│       ├── package.json
│       └── ...
│
└── README.md
```

> The exact folder structure may grow as more ETL and API modules are added.

---

# 🗄️ Database

The application uses PostgreSQL with the `gamehub_analytics` schema.

## Main Tables

### `games`

Stores the main game information.

Examples of fields:

- `appid`
- `name`
- `developer`
- `publisher`
- `release_date`
- `price`
- `genre`
- `steam_url`
- `header_image`
- `short_description`
- `metacritic_score`
- `is_free`
- `owners`
- `average_forever`
- `median_forever`
- `positive_reviews`
- `negative_reviews`
- `score_rank`
- `initial_price`
- `current_price`
- `processed`
- `processed_at`

### `player_history`

Stores historical player-count snapshots.

Main fields:

- `appid`
- `player_count`
- `collected_at`

This table powers the **Player History** chart on the game profile and player-related dashboard/trends analytics.

### `tags`

Stores normalized community tags.

- `tag_id`
- `tag_name`

### `game_tags`

Associates games with community tags.

- `appid`
- `tag_id`

### `price_history`

Stores historical pricing information.

### `review_history`

Stores historical review information.

### Other normalized data

The ETL also maintains normalized information for:

- Genres
- Developers
- Publishers

---

# 🔄 ETL Pipeline

The ETL pipeline is split into extraction, transformation, and loading modules.

## Main ETL

Run:

```bash
python run_etl.py
```

The main ETL handles game metadata and related datasets such as:

```text
Steam API
   ↓
Game metadata
   ↓
SteamSpy data
   ↓
Transform
   ↓
PostgreSQL
```

Depending on the current ETL configuration, the pipeline can load:

- Games
- Genres
- Developers
- Publishers
- Community tags
- Price history
- Review history

Player-history collection is intentionally separated from the normal ETL.

## Player History Update

Run:

```bash
python update_players.py
```

This script reads game AppIDs from the database and requests current player counts from Steam.

Successful results are inserted into `player_history` with a timestamp.

Games that do not provide player-count data are skipped instead of stopping the entire update process.

Example workflow:

```text
update_players.py
      ↓
Steam current-player endpoint
      ↓
player_count
      ↓
player_history
      ↓
Game Profile chart
```

---

# 🚀 Running the Backend

Open a terminal in the backend directory.

Install dependencies if needed:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The API normally runs at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🎨 Running the Frontend

Open another terminal in the frontend directory.

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

# 🔌 Main API Endpoints

## Games

### List games

```http
GET /games
```

Supports parameters such as:

```text
page
limit
search
genre
free
sort
order
tags
tag_mode
```

Example:

```text
GET /games?page=1&limit=20&sort=reviews&order=desc
```

### Game profile

```http
GET /games/{appid}
```

Example:

```text
GET /games/570
```

### Player history

```http
GET /games/{appid}/players
```

Example:

```text
GET /games/570/players
```

### Get all tags

```http
GET /games/tags
```

### Search tags

```http
GET /games/tags/search?q=action
```

## Dashboard

The dashboard API provides statistics and aggregated information such as:

- Overall game count
- Player statistics
- Average price
- Positive review percentage
- Genre distribution
- Community tags
- Trending games

## Trends

The Trends page uses dedicated endpoints for analytics such as:

- Player activity over time
- Top games by player count
- Review sentiment
- Price distribution

---

# 🖥️ Frontend Pages

## Dashboard

The dashboard provides a quick overview of the database.

It currently includes:

- Games tracked
- Players
- Average price
- Positive review percentage
- Genre distribution
- Community tag distribution
- Trending games

Charts are responsive and use a dark theme consistent with the rest of the application.

## Games

The Games page is the main catalog.

Features include:

- Game search
- Sorting by name, price, reviews, or release date
- Ascending / descending order
- Community tag filtering
- OR / AND tag filtering
- Pagination
- First / previous / next / last page navigation
- Clickable game cards

Example pagination:

```text
«  ‹  1  2  3  4  5  ›  »
```

The `»` control jumps directly to the last available page based on the backend's total page count.

## Game Profile

Clicking a game opens its profile.

The profile includes:

- Header image
- Description
- Developer
- Publisher
- Genre
- Release date
- Price
- Owners
- Metacritic score
- Positive reviews
- Negative reviews
- Review summary
- Player history

The Player History chart uses records from `player_history` and displays recorded player counts over time.

## Trends

The Trends page provides additional analytics across the database.

Current sections include:

- Player Activity
- Top Games
- Review Sentiment
- Price Distribution

---

# 🔎 Search and Filtering

The game catalog supports database-backed search rather than filtering only the currently displayed frontend cards.

Examples:

```text
Search: Dota
Sort: Reviews
Order: Descending
```

or:

```text
Tag: RPG
Tag: Multiplayer
Mode: AND
```

This allows users to combine filters and then paginate through the resulting dataset.

---

# 📊 Data Visualization

Charts are built with Recharts.

The current application uses:

- Pie charts
- Bar charts
- Line charts
- Responsive containers
- Dark-themed tooltips and axes

Charts are designed to remain inside their cards even when datasets contain many categories.

---

# ⚠️ Data Limitations

Steam and SteamSpy do not always return complete information for every AppID.

Possible missing values include:

- Release dates
- Prices
- Metacritic scores
- Player counts
- SteamSpy statistics
- Community tags

The application therefore treats missing values as normal data conditions and displays values such as `N/A`, `Unknown`, or `No data` instead of assuming every game has complete information.

Some Steam AppIDs may also return no current-player data. Those records are skipped during player updates rather than causing the whole update process to fail.

---

# 🛠️ Common Commands

## Backend

```bash
uvicorn main:app --reload
```

## Main ETL

```bash
python run_etl.py
```

## Player update

```bash
python update_players.py
```

## Frontend

```bash
npm run dev
```

---

# 🔧 Current Development Status

### Completed / Working

- [x] PostgreSQL database
- [x] ETL pipeline
- [x] Steam / SteamSpy extraction
- [x] Game catalog API
- [x] Game search
- [x] Game profile API
- [x] React dashboard
- [x] Dynamic dashboard statistics
- [x] Dynamic genre chart
- [x] Dynamic tag chart
- [x] Games page
- [x] Sorting
- [x] Search/filtering
- [x] Community tag filtering
- [x] OR / AND tag filtering
- [x] Pagination
- [x] First / last page navigation
- [x] Game profile navigation
- [x] Player history endpoint
- [x] Player history chart
- [x] Trends page foundation

### Planned / Next Improvements

- [ ] Price history chart on game profiles
- [ ] Review history chart on game profiles
- [ ] More advanced Trends analytics
- [ ] Stronger ETL retry and logging system
- [ ] Automated player-history collection
- [ ] Deployment
- [ ] Docker / Docker Compose
- [ ] Expanded project documentation

---

# 🎯 Project Goal

The goal of GameHub Analytics is to build a practical end-to-end data analytics platform around game-market data while demonstrating:

- Data ingestion
- ETL design
- Relational database design
- SQL querying
- REST API development
- React frontend development
- Interactive data visualization
- Time-series analytics
- Full-stack integration

---

# 👨‍💻 Author

Developed as a full-stack data analytics project using Python, PostgreSQL, FastAPI, React, TypeScript, and Recharts.

