# MovieVault

A full-stack movie catalog app. Browse, search, filter, add, edit, and delete
movies, each tagged with one or more genres.

## Why

Built as a hands-on exercise in wiring a React frontend to a Node/Express +
PostgreSQL backend with real CRUD operations, a many-to-many relationship
(movies ↔ genres), and data seeded from a real source (the OMDB API) instead
of hardcoded fixtures.

## Architecture

```
MovieVault/
├── backend/     Express API + PostgreSQL
└── frontend/    React (Vite) single-page app
```

**Backend** — `backend/`
- Express server (`server.js`) exposing a REST API under `/api`
- PostgreSQL via `pg`, connection pool in `config/database.js`
- Three tables: `movies`, `genres`, and a `movies_genres` join table
- Routes/controllers split per resource (`routes/`, `controllers/`)
- `config/fetchMovies.js` pulls a seed list of movies from the OMDB API into
  `config/data/movies.json`; `config/reset.js` drops, recreates, and reseeds
  the schema from that file

| Endpoint | Description |
|---|---|
| `GET /api/movies` | List all movies (with their genres) |
| `GET /api/movies/:id` | Get one movie |
| `POST /api/movies` | Create a movie |
| `PUT /api/movies/:id` | Update a movie |
| `DELETE /api/movies/:id` | Delete a movie |
| `GET /api/genres` | List all genres |
| `GET /api/genres/:id` | Get one genre |
| `POST /api/genres` | Create a genre |
| `PUT /api/genres/:id` | Update a genre |
| `DELETE /api/genres/:id` | Delete a genre |

**Frontend** — `frontend/`
- React + Vite, routed with `react-router-dom`
- `src/api/` — thin fetch wrapper (`client.js`) plus one module per resource
- `src/pages/` — one component per route (list, detail, add, edit)
- `src/components/` — shared UI (navbar, movie card/grid, form, status states)
- `src/hooks/useAsync.js` — small hook for loading/error/data state on fetches

Pages: movie grid with title search and genre filter, movie detail, add
movie, edit movie.

## Getting Started

### Prerequisites
- Node.js 20+
- A PostgreSQL database (local or hosted, e.g. Railway)
- An [OMDB API key](https://www.omdbapi.com/apikey.aspx) (only needed if you
  want to (re)generate the seed data)

### 1. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGHOST=your_pg_host
PGPORT=5432
PGDATABASE=your_pg_database

OMDB_API_KEY=your_omdb_api_key
```

Seed the database (drops and recreates all tables, then loads the seed
movies/genres):

```bash
node config/fetchMovies.js   # only needed to (re)generate config/data/movies.json
node config/reset.js
```

Start the API:

```bash
npm start
```

The server listens on `http://localhost:3000` (override with `PORT` in
`.env`).

### 2. Frontend setup

```bash
cd frontend
npm install
```

`frontend/.env` already points at the local API by default:

```
VITE_API_URL=http://localhost:3000/api
```

Start the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173`.

### 3. Use it

With both servers running, open `http://localhost:5173` to browse movies,
filter by genre, and add/edit/delete entries.