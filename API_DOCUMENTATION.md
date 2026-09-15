# 📡 J O B G — API DOCUMENTATION

Base URL: `http://localhost:3000` (or production domain)

---

## Authentication & Session
- **`GET /api/auth/session`**: Checks current session state.
- **`POST /api/auth/session`**: Logs in / logs out session.
- **`POST /api/auth/verify`**: Verifies active session token.

## Profile & Onboarding
- **`GET /api/profile`**: Retrieves candidate profile.
- **`PUT /api/profile`**: Updates target company, role, sprint duration.

## Curriculum
- **`GET /api/curriculum`**: Lists all tracks and modules with optional `?search=` and `?difficulty=` filters.
- **`GET /api/curriculum/:track`**: Returns details for a specific track (`maang`, `webdev`, `web3`).

## Progress
- **`GET /api/progress`**: Returns user completion count and streak.
- **`POST /api/progress/module`**: Idempotently marks a module completed or incomplete.

## Tasks & Notes
- **`GET /api/tasks`**: Retrieves user sprint tasks.
- **`POST /api/tasks`**: Creates a new sprint task.
- **`PATCH /api/tasks/:id`**: Updates task completion status.
- **`DELETE /api/tasks/:id`**: Deletes a task.
- **`GET /api/notes`**: Retrieves user markdown notes.
- **`POST /api/notes`**: Autosaves markdown note for a stream or module session.

## Dashboard
- **`GET /api/dashboard`**: Aggregates readiness score, active streak, recent tasks, and recommendations.

## ATS & AI
- **`POST /api/ats/analyze`**: Analyzes resume keyword density and generates recommendations.
- **`POST /api/ai`**: AI career gateway with context-aware guidance.

## Live Tech Theater
- **`GET /api/youtube`**: Fetches curated tech stream feeds with caching.
