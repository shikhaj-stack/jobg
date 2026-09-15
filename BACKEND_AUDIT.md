# JOBG — Comprehensive Backend-First Architecture Audit

**Audit Date**: September 15, 2026  
**Target Environment**: Next.js 14 App Router, Node.js 20+, Vercel Serverless / Edge, Supabase PostgreSQL, Firebase Auth  
**Codebase State**: Commit `3bb5c19` on `main`  
**Build Status**: Production Build `npm run build` succeeds (`Exit Code 0`, 15 static/dynamic routes compiled).

---

## Executive Summary

The J O B G platform possesses a sophisticated, responsive frontend design system and clean component hierarchy. However, **the backend layer is currently an architectural facade**. 

While database schemas, authentication libraries, and API routes exist in the codebase:
1. **The frontend does not call its own `/api/*` endpoints** (0 calls detected across the application).
2. **All state persistence relies primarily on browser `localStorage`**, meaning data is lost across devices and sessions.
3. **Database operations fail silently**: `supabase/schema.sql` enables Row Level Security (RLS) on all 5 tables without defining any access policies, locking all operations.
4. **Auth is disjointed**: The client uses Firebase Auth, while the database is Supabase PostgreSQL. Supabase has no verified Firebase JWT session context, and the backend has no Firebase Admin verification.
5. **All API routes (`/api/ai`, `/api/auth/verify`, `/api/progress`, `/api/youtube`) return hardcoded mock payloads** and lack validation, authorization, and error handling.

---

## Part 1: Deep-Dive Audit Across 20 Key Backend Dimensions

### 1. Existing API Endpoints
| Endpoint | Method | Status | Real Functionality |
| :--- | :--- | :--- | :--- |
| `/api/ai` | `POST` | **Mock Facade** | Returns hardcoded mock text strings based on `type`. No calls to LiteLLM or any LLM API. |
| `/api/auth/verify` | `POST` | **Mock Facade** | Accepts `{ token, email, uid }` and returns `{ verified: true }` without verifying signature or claims. |
| `/api/progress` | `GET` | **Mock Facade** | Ignores query param `uid`; returns static `{ completedCount: 4, streak: 14 }`. |
| `/api/progress` | `POST` | **Mock Facade** | Echoes back received body; does not write to Supabase or database. |
| `/api/youtube` | `GET` | **Mock Facade** | Returns static JSON `{ activeStreamsCount: 4 }`; does not call YouTube API. |

### 2. Missing API Endpoints
The following critical REST / Server Action routes are completely missing from the backend:
- `GET /api/notes`, `POST /api/notes`, `DELETE /api/notes`: Notes are trapped in `localStorage.getItem('jobg_notes')`.
- `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/[id]`, `DELETE /api/tasks/[id]`: Tasks are trapped in `localStorage.getItem('jobg_tasks')`.
- `GET /api/profile`, `PATCH /api/profile`: User updates bypass API and execute insecure client-side DB upserts.
- `GET /api/streaks`, `POST /api/streaks/record`: Daily active streaks are not tracked or calculated on the server.
- `POST /api/ai/resume-audit`: ATS radar scan runs a client-side `setTimeout` with hardcoded scores (92%).
- `GET /api/curriculum/[track]`: Curriculum is hardcoded in a static client-side bundle (`roadmapData.js`).
- `GET /api/streams/live`: Real-time streaming status is hardcoded in `streamData.js`.

### 3. Existing Database Tables
Defined in `supabase/schema.sql`:
1. `public.users`: Candidate profile, target role, sprint dates.
2. `public.user_progress`: Module completion tracking (`firebase_uid`, `module_id`, `track`, `pillar`, `is_completed`).
3. `public.user_streaks`: Daily activity log (`firebase_uid`, `activity_date`, `activity_count`).
4. `public.user_notes`: Timestamped active recall markdown notes (`session_id`, `content`, `word_count`).
5. `public.user_tasks`: Action checklist items (`title`, `category`, `completed`, `due_date`).

### 4. Missing Database Tables
To support production-grade full-stack features:
- `public.curriculum_tracks`, `public.curriculum_modules`, `public.curriculum_topics`: For CMS-driven or database-driven curriculums without client bundle bloat.
- `public.streams_cache`: To cache YouTube Data API responses and stay within API quota limits (10,000 units/day).
- `public.resume_audits`: To persist ATS keyword scores, historical suggestions, and resume scans.
- `public.ai_conversations`: For mock interview interactions and history.

### 5. Relationships Between Tables
- **Critical Flaw**: There are **zero foreign key constraints** (`REFERENCES`) between tables.
- `user_progress`, `user_streaks`, `user_notes`, and `user_tasks` reference `firebase_uid` as raw `TEXT`.
- If a user record in `public.users` is deleted, all related child records become orphaned.
- **Missing Indexes**: `user_notes` and `user_tasks` lack indexed lookups on `firebase_uid`, leading to full-table sequential scans when querying a user's items.

### 6. Authentication Flow
- **Client Architecture**: Firebase Auth (`signInWithPopup`, `signInWithEmailAndPassword`) in `src/lib/firebase.js`.
- **Silent Mock Fallback**: When Firebase env vars are absent or an auth error occurs, `AuthContext.jsx` silently falls back to `demoLogin()`, setting `localStorage.setItem('jobg_demo_logged_in', 'true')` with fake user `alex.rivera@engineer.io`.
- **Database Disconnect**: Supabase client (`src/lib/supabase.js`) is initialized with `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Supabase has no idea who the Firebase user is.

### 7. Authorization Flow
- **Client-Only Guard**: Route protection is enforced exclusively on the client side via `AuthGuard.jsx` (`useEffect` checking `user`).
- **No Edge Middleware**: There is no `middleware.js`. Unauthenticated users can directly load static HTML/JS bundles before client redirects fire.
- **Unprotected API Routes**: Every API route (`/api/ai`, `/api/auth/verify`, `/api/progress`, `/api/youtube`) lacks session checks and can be invoked anonymously by any HTTP client.

### 8. Session Verification
- No server-side session token verification exists anywhere in the codebase.
- `firebase-admin` is **not installed** in `package.json`.
- The Next.js server cannot cryptographically verify Firebase ID tokens passed in headers.
- `/api/auth/verify` performs no cryptographic verification and accepts any fake `uid`.

### 9. RLS (Row Level Security) Policies
- `supabase/schema.sql` runs `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` on all 5 tables.
- **Blocker**: **Zero policies (`CREATE POLICY`) are defined**.
- In PostgreSQL, enabling RLS without policies implicitly generates a `DENY ALL` rule for all non-superuser roles (including the anon key used by the frontend).
- As a result, all client `supabase.from('users').upsert(...)` and `supabase.from('user_progress').upsert(...)` fail with RLS violations.

### 10. Client/Server Security Issues
- The frontend attempts direct database writes from browser context (`useProgress.js:76`, `AuthContext.jsx:92`).
- Because the Supabase client uses the public anon key without JWT user claims, if permissive RLS policies (`true`) were enabled, **any user could read and overwrite any other candidate's progress, notes, and profile** simply by supplying another `firebase_uid`.

### 11. Secrets Exposure Risks
- `.env.example` lists `SUPABASE_SERVICE_ROLE_KEY`, `LITELLM_API_KEY`, and `YOUTUBE_API_KEY`.
- Currently, these keys are not prefixed with `NEXT_PUBLIC_`, which is correct.
- However, since there are no working server-side handlers to use these secrets, developers might be tempted to move them to `NEXT_PUBLIC_*`, which would leak full administrative database access and paid API quotas to the browser.

### 12. Mock Data That Should Become Persistent Data
- `src/hooks/useProgress.js`: `INITIAL_TASKS` (4 hardcoded tasks).
- `src/context/AuthContext.jsx`: `DEFAULT_PROFILE` (hardcoded candidate profile).
- `src/data/streamData.js`: `LIVE_STREAMS` (4 hardcoded YouTube videos with static viewer counts).
- `src/components/dashboard/ResumeHealth.jsx`: Hardcoded 92% ATS score and bullet points.
- `src/components/dashboard/MetricsGrid.jsx`: Hardcoded "Day 18 / 60" sprint milestone.

### 13. API Routes That Are Only Placeholders
- **100% of existing API routes are placeholders**. None of them read from or write to a database, external API, or AI service.

### 14. Duplicate Business Logic
- **Progress Tracking**: `useProgress.js` calculates progress by filtering `ROADMAP_TRACKS` in browser memory, while `/api/progress` returns a completely different hardcoded number (`completedCount: 4`).
- **Profile Initialization**: Default profile structure is duplicated between `AuthContext.jsx`, `login/page.js`, and `signup/page.js`.

### 15. Missing Validation
- Zero input validation across all endpoints (no Zod, Yup, or Joi schemas).
- `/api/ai` accepts arbitrary JSON without size limits or type checking.
- `/api/progress` does not validate whether `moduleId` belongs to a valid curriculum module.

### 16. Missing Error Handling
- Frontend Supabase mutations use fire-and-forget `.then(({ error }) => console.warn(error))`. Failures are swallowed and hidden from users.
- If network requests fail, `localStorage` is updated anyway, causing local state to drift out of sync with the database.

### 17. Missing Loading States Caused by Backend
- Because the application loads from `localStorage`, components display instant state changes or flash default values before `localStorage` is parsed.
- There are no server-side suspense boundaries or loading skeletons for tasks, notes, or profile metrics.

### 18. AI Integration Architecture
- Intended: LiteLLM proxy gateway (`LITELLM_API_KEY`).
- Current: Mock ternary statement returning 3 static hardcoded strings.
- Deficiencies: No streaming response (`ReadableStream`), no system prompt engineering for ATS scanning or technical interview coaching, and no error handling for upstream LLM timeouts.

### 19. YouTube Integration Architecture
- Intended: YouTube Data API v3 (`YOUTUBE_API_KEY`) to dynamically fetch active live streams for system design and coding.
- Current: Hardcoded static array `LIVE_STREAMS` in `src/data/streamData.js`. The `/api/youtube` endpoint is not connected to YouTube and is never called by `VideoPlayer.jsx`.

### 20. Production Blockers
1. **P0: Data Loss on Clear Cache / Cross-Device**: Progress, notes, and tasks do not persist to a centralized database.
2. **P0: Database RLS Rejection**: Supabase RLS is enabled with zero policies, causing all database writes to be blocked.
3. **P0: Zero Token Verification**: Backend cannot verify who is making requests.
4. **P0: Dead API Layer**: Frontend is completely disconnected from `/api/*`.

---

## Part 2: Categorized Issue Breakdown

### P0 — Critical Backend Blockers (Must Fix for Functional Full-Stack Platform)
1. **Unconfigured Supabase RLS**: All 5 tables reject writes. Need either custom JWT verification policies or a server-side Service Role API bridge.
2. **Missing Backend Auth Verification**: Install and configure `firebase-admin` (or Supabase Auth integration) to verify tokens in Next.js backend.
3. **Connect Frontend to Backend API**: Replace `localStorage` mutations in `useProgress.js` and `AuthContext.jsx` with real backend API calls.
4. **Wire `/api/progress` to Database**: Implement real CRUD operations for module completion in `public.user_progress`.
5. **Implement Missing Core Endpoints**:
   - `/api/notes` (CRUD for `public.user_notes`)
   - `/api/tasks` (CRUD for `public.user_tasks`)
   - `/api/profile` (Read/Update for `public.users`)

### P1 — Important Backend Work (Production Readiness & Core Feature Completeness)
1. **Add Foreign Keys & Cascading Deletes in SQL**: Link `user_progress`, `user_notes`, `user_tasks`, and `user_streaks` to `users(firebase_uid)` with `ON DELETE CASCADE`.
2. **Add Database Indexes**: Index `firebase_uid` and `(firebase_uid, module_id)` across tables.
3. **Implement Real AI Gateway Route (`/api/ai`)**: Connect `/api/ai` to LiteLLM / Claude / OpenAI with structured prompts and streaming support.
4. **Wire ATS Resume Health Radar to AI**: Replace hardcoded `setTimeout` in `ResumeHealth.jsx` with a real call to `/api/ai` (type: `resume`).
5. **Input Validation**: Add Zod validation schemas for all API payloads.
6. **Implement Next.js Edge Middleware**: Protect `/(dashboard)/*` routes at the server/edge level using session cookies.
7. **Calculate Dynamic Sprint Milestones**: Compute "Day X of Y" and streak from real database timestamps instead of hardcoded strings in `MetricsGrid.jsx`.

### P2 — Improvements & Polish (Optimization & Extensibility)
1. **YouTube API Caching Engine (`/api/youtube`)**: Query YouTube Data API v3 with Redis / Next.js ISR cache (`revalidate: 300`) to conserve quota.
2. **Database-Driven Curriculum**: Migrate `roadmapData.js` into database tables (`curriculum_tracks`, `curriculum_modules`) with an admin seeding script.
3. **Deprecation Cleanup in `next.config.js`**: Update deprecated `images.domains` to `images.remotePatterns`.
4. **ESLint & Build Hardening**: Add `.eslintrc.json` and set `ignoreDuringBuilds: true` to prevent non-interactive CI prompts.
5. **Rate Limiting**: Add IP/User-based rate limiting on `/api/ai` to prevent quota abuse.
