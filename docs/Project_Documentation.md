# Disc_Homework – Full Project Documentation

This document explains the structure, purpose, and key concepts of every file in this repository. It’s written as if you’ve never seen the project before.

## What this project is

A full‑stack web app being built progressively during DISC workshops. The goal is to create an online pet community where users can create customized profiles for their pets and interact. The current version includes user authentication (Supabase) and a pets feature backed by a Node/Express API with PostgreSQL via Drizzle ORM.

## Tech stack overview

- Frontend
  - Vite + React (SPA)
  - React Router for routing
  - Bootstrap + custom CSS for UI
  - Supabase client for authentication
- Backend
  - Node.js + Express
  - Drizzle ORM + Postgres (Supabase-hosted DB)
  - CORS, JSON body parsing

## Repository structure

```
Disc_Homework/
├─ backend/
│  ├─ drizzle.config.js              # Drizzle CLI configuration
│  ├─ package.json                   # Backend dependencies & scripts
│  └─ src/
│     ├─ index.js                    # Express app entrypoint
│     ├─ db/
│     │  ├─ config.js               # Postgres client + Drizzle initialization
│     │  └─ schema.js               # Drizzle table definitions (Pets)
│     └─ routes/
│        ├─ pets.js                 # Pets REST endpoints (CRUD)
│        └─ database_verification.png # Reference image (not executed)
│
├─ frontend/
│  ├─ eslint.config.js               # ESLint config for the frontend
│  ├─ index.html                     # HTML shell loaded by Vite
│  ├─ package.json                   # Frontend dependencies & scripts
│  ├─ public/
│  │  └─ vite.svg                   # Public static asset example
│  ├─ src/
│  │  ├─ api/petService.js         # Fetch layer for backend pets API
│  │  ├─ components/               # Reusable UI and page components
│  │  │  ├─ About.jsx
│  │  │  ├─ Contact.jsx
│  │  │  ├─ Home.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ MeowCounter.jsx
│  │  │  ├─ NavBar.jsx
│  │  │  ├─ PetCat.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ config/supabaseClient.js  # Supabase client (auth)
│  │  ├─ context/AuthContext.jsx   # React context for auth state & actions
│  │  ├─ App.css                   # App-level CSS (legacy/custom)
│  │  ├─ index.css                 # Global theme styles
│  │  ├─ App.jsx                   # App routes & layout shell
│  │  └─ main.jsx                  # Frontend entry; mounts React app
│  └─ vite.config.js                # Vite build/dev configuration
│
├─ README.md                         # Repo overview (high-level)
└─ docs/Project_Documentation.md     # You are here
```

---

## Backend (Node + Express + Drizzle)

### `backend/src/index.js` – Express entrypoint

- Loads environment variables (`dotenv`).
- Creates an Express app.
- Applies middleware:
  - `cors()` to allow the frontend to call the API.
  - `express.json()` to parse JSON bodies.
- Mounts the pets routes at `/api/pets`.
- Health check endpoint at `/api/health`.
- Root endpoint `/` returns a simple JSON message.
- Global error handler logs the error and returns a 500 JSON response.
- Starts the server on `process.env.PORT || 5000`.

Concepts:
- Express middleware and routing
- CORS for cross-origin requests from the frontend dev server
- Basic health check endpoint for diagnostics

### `backend/src/db/config.js` – Database wiring

- Uses `postgres` (postgres-js) to create a client with `DATABASE_URL`.
- Enables SSL (required for Supabase-hosted Postgres).
- Creates a Drizzle ORM instance with the `pets` schema.
- Exports `{ db, pets, client }` so routes can use `db` and reference `pets`.

Concepts:
- Connection pooling and SSL with Postgres
- Drizzle ORM initialization over postgres-js

### `backend/src/db/schema.js` – Drizzle table definitions

Defines a single table: `Pets`.

Columns:
- `id` – serial primary key
- `name` – text, required
- `age` – bigint (stored as number), optional
- `weight` – bigint (stored as number), optional
- `species` – text, required
- `petUrl` – text, optional (mapped to DB column `pet_url`)
- `petUrl2` – text, optional (mapped to DB column `pet_url2`)
- `userId` – uuid, required (mapped to DB column `user_id`)

Concepts:
- Mapping JS/TypeScript naming to DB column names
- Strongly-typed schema with Drizzle

### `backend/src/routes/pets.js` – Pets REST API

Middleware:
- `extractUserId`: reads `x-user-id` header and sets `req.userId` if present. This enables guest access (empty list) or user-specific data. Note: this is convenient but not secure—see “Improvements.”

Routes:
- `GET /api/pets`
  - If no `req.userId`, returns `{ success: true, data: [], count: 0 }`.
  - If logged in, returns the current user’s pets ordered by `id`.
- `POST /api/pets`
  - Requires `req.userId`.
  - Validates `name` and `species`.
  - Inserts a new pet with `userId`, returns the created row.
- `DELETE /api/pets/:id`
  - Requires `req.userId`.
  - Deletes the pet only if `id` belongs to the current user.

Concepts:
- RESTful CRUD design
- Authorization by ownership (user can only access their own pets)
- Error handling with proper HTTP status codes (401, 400, 404, 500)

### `backend/drizzle.config.js` – Drizzle CLI configuration

- Points to the schema file (`./src/db/schema.js`).
- `out` directory for migrations: `./src/db/migrations` (generated when you run drizzle-kit).
- Dialect: `postgresql` with `dbCredentials.url` from `DATABASE_URL`.

### `backend/package.json` – Scripts & deps

Key scripts:
- `dev`/`start`: run the Express server.
- `db:generate`, `db:migrate`, `db:push`, `db:studio`: Drizzle CLI workflows.

Key dependencies:
- `express`, `cors`, `dotenv`
- `drizzle-orm`, `postgres`

---

## Frontend (Vite + React + Supabase Auth)

### `frontend/index.html` – HTML shell

- Vite injects the bundled JS into this page.
- Loads the Google font and sets a page `<title>`.
- Mounts the React app at `<div id="root"></div>`.

Concepts:
- Vite’s index.html as entry point
- Single-page app: React controls everything inside `#root`

### `frontend/src/main.jsx` – React entry

- Imports global CSS (`index.css`).
- Renders `<App />` into `#root` using React 18 root API.

### `frontend/src/App.jsx` – App shell and routing

- Uses React Router (`BrowserRouter`, `Routes`, `Route`).
- Wraps the app with `<AuthProvider>` to provide auth state/actions.
- Renders `NavBar` and page routes: `/`, `/about`, `/contact`, `/login`.
- Wraps content inside a layout container `.app-shell` for consistent spacing.

Concepts:
- Client-side routing
- Global layout and providers

### `frontend/src/index.css` and `frontend/src/App.css` – Styling

- `index.css` defines global design tokens (colors), layout (`.app-shell`), polished card styles, buttons, a sticky navbar, progress bar styles, and subtle animations with `prefers-reduced-motion` support.
- `App.css` may include additional app-specific or legacy styles.

Concepts:
- CSS variables (design tokens) for easy theme changes
- Progressive enhancement of Bootstrap UI with custom CSS

### `frontend/src/components/*` – UI and pages

- `NavBar.jsx`: Top navigation; shows Home/About/Contact/Login links. If `user` exists, shows a welcome message and Logout.
- `Home.jsx`: Main page that fetches pets from the backend, lets you select/create/delete a pet (if logged in), shows selected pet info, a progress bar, and renders `PetCat` and `MeowCounter`.
- `Login.jsx`: Email/password login and signup form powered by `useAuth`.
- `About.jsx`: Simple informational page.
- `Contact.jsx`: Contact links (email, LinkedIn, GitHub).
- `PetCat.jsx`: Displays the pet image, swaps images depending on “pet” count, provides a “Pet” button.
- `MeowCounter.jsx`: Shows a cat emoji and a chat bubble “meow” when the progress hits 100%; counts meows.
- `ProtectedRoute.jsx`: Wrapper to protect routes—shows a spinner while loading; redirects to `/login` if unauthenticated.

Concepts:
- Separation of concerns: pages vs. reusable components
- Reading context state in components to change UI (e.g., NavBar)

### `frontend/src/config/supabaseClient.js` – Supabase client

- Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the environment.
- Creates and exports a singleton `supabase` client.

Concepts:
- Client SDK initialization
- Using environment variables in Vite (prefixed with `VITE_`)

### `frontend/src/context/AuthContext.jsx` – Auth state & actions

- Creates a React context with `user`, `loading`, and actions: `signUp`, `signIn`, `signOut`.
- On mount, calls `supabase.auth.getSession()` and subscribes to `onAuthStateChange` to track session changes.
- Any component can call `useAuth()` to access user state and auth actions.

Concepts:
- React Context API for global state
- Supabase email/password auth & sessions
- Auth flow in a SPA (no page reloads)

### `frontend/src/api/petService.js` – API client (frontend → backend)

- `API_BASE_URL` comes from `VITE_API_URL` or defaults to `http://localhost:5000/api`.
- Reads the current Supabase session to decide how to authenticate requests.
- Currently adds a custom `x-user-id` header if a user is logged in (convenient for demos).
- Exposes functions:
  - `fetchPets()` – GET `/pets`
  - `createPet(petData)` – POST `/pets`
  - `deletePet(id)` – DELETE `/pets/:id`

Concepts:
- Centralized API layer for fetch requests
- Bridging Supabase auth (frontend) with your own API

### `frontend/eslint.config.js` – Linting

- ESLint configuration with recommended rules, React hooks plugin, and `react-refresh` config for Vite.
- Note: you might see a rule warning about “only exporting components.” It’s safe to ignore for now or split hooks/utilities into separate files.

### `frontend/vite.config.js` – Vite build config

- Uses the React SWC plugin for fast dev builds.

---

## Core concepts explained

### 1) Single Page Application (SPA)
The browser loads `index.html` once. React (in `main.jsx` → `App.jsx`) manages subsequent navigation using the History API (React Router). Pages change without full reloads.

### 2) Authentication with Supabase
- You initialize a Supabase client with your project URL and anon key.
- `AuthContext` checks for an existing session on startup and subscribes to auth changes.
- `useAuth().signUp` and `useAuth().signIn` perform email/password flows.
- `NavBar`, `ProtectedRoute`, and `Login` consume `useAuth()` to update UI and restrict access.

### 3) API and data flow
- Frontend calls the backend through `petService.js`.
- Currently, it passes a user ID via `x-user-id` header (demo-friendly). The backend uses this to filter rows.
- Backend uses Express routes (`pets.js`) and Drizzle ORM (`db/config.js`, `db/schema.js`) to read/write the `Pets` table.

Recommended improvement: Switch to `Authorization: Bearer <token>` and verify tokens on the server rather than trusting `x-user-id`.

### 4) Database via Drizzle ORM
- The schema is code-first (in `schema.js`).
- Queries are built using Drizzle’s fluent API (`db.select().from(pets).where(...)`).
- Migrations can be generated with Drizzle CLI using the schema.

---

## Backend API – endpoints and shapes

Base URL: `http://localhost:5000/api`

- GET `/pets`
  - Headers: `x-user-id: <uuid>` (optional; see note)
  - Response: `{ success: boolean, data: Pet[], count: number }`

- POST `/pets`
  - Headers: `x-user-id: <uuid>` (required)
  - Body JSON: `{ name: string, species: string, age?: number, weight?: number, pet_url?: string, pet_url2?: string }`
  - Response: `{ success: boolean, data: Pet }`

- DELETE `/pets/:id`
  - Headers: `x-user-id: <uuid>` (required)
  - Response: `{ success: boolean, data: Pet }`

Type `Pet` (as used by the API):
```
{
  id: number,
  name: string,
  species: string,
  age?: number | null,
  weight?: number | null,
  petUrl?: string | null,
  petUrl2?: string | null,
  userId: string
}
```

Note on auth header: For production-grade security, replace `x-user-id` with `Authorization: Bearer <access_token>` and verify the token on the backend.

---

## Environment variables

Backend (`backend/.env`):
- `DATABASE_URL` – Postgres connection string (Supabase DB)
- `PORT` – optional, defaults to 5000
- (Recommended) `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` – for server-side token verification if you adopt secure auth middleware

Frontend (`frontend/.env`):
- `VITE_SUPABASE_URL` – Supabase project URL
- `VITE_SUPABASE_ANON_KEY` – Supabase anon key
- `VITE_API_URL` – Backend API base URL (e.g., `http://localhost:5000/api`)

Vite only exposes variables prefixed with `VITE_` to the browser.

---

## Running the project locally

1) Backend
- Ensure `DATABASE_URL` is set in `backend/.env`.
- Start the server:
  - `npm run dev` (from `backend/`).

2) Frontend
- Ensure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_URL` are set in `frontend/.env`.
- Start the dev server:
  - `npm run dev` (from `frontend/`).

Open the frontend URL (typically `http://localhost:5173`). The frontend will call the API at `VITE_API_URL`.

---

## Known limitations and suggested improvements

- Auth header spoofing: Replace `x-user-id` with `Authorization: Bearer <token>` and verify tokens on the backend.
- CORS: Lock down allowed origins in `cors()`.
- Input validation: Add `zod` or similar to validate request bodies.
- Security hardening: Add `helmet` and optional rate limiting.
- Code organization: Consider controllers/services/middleware folders for clearer separation.
- Lint note: ESLint’s `react-refresh/only-export-components` may warn in `AuthContext.jsx`; split hooks/utilities or disable for that file.
- Tests & CI: Add basic unit tests for routes and context, and a simple CI workflow.

---

## High-level data flow (auth + pets)

```
User → Login.jsx → useAuth().signIn → Supabase session stored in client
       ↓
AuthProvider listens to session changes → sets { user, loading }
       ↓
Components read useAuth() (NavBar, ProtectedRoute, Home)
       ↓
Home → petService.js → fetch/create/delete → Backend /api/pets
       ↓                     ↑
Backend reads req.userId (from header)   │
Filters CRUD by userId via Drizzle       │
                                         └─ Recommended: verify JWT and set userId securely
```

You now have a full map of what each file does and the key concepts behind them. Use this as a guide for onboarding, debugging, or planning improvements.
