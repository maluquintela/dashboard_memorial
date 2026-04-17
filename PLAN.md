# Dashboard API Connection Plan

## Goal

Connect this Vite React dashboard to the separate FastAPI memorial API for:

- local development with frontend and API running separately
- production deployment with frontend and API hosted separately
- persistent generated memorial history through the API and Supabase

## Architecture

The dashboard remains a static React frontend. The API owns memorial generation, Supabase metadata persistence, Supabase Storage DOCX files, and signed download URLs.

The dashboard must use `VITE_API_URL` for all backend calls and normalize backend snake_case payloads into the current camelCase UI model.

## Deployment Direction

- Frontend: Vercel
- API: Railway, preferably as a separate service from the chatbot runtime
- Persistence: Supabase Postgres + private Supabase Storage bucket

Local development:

```bash
cd ~/Projects/api_memorial_descritivo
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

cd ~/Projects/dashboard_memorial
npm run dev
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:8000
```

## API Contract

Use the API handoff document:

```text
~/Projects/api_memorial_descritivo/docs/frontend-persistent-memorials.md
```

Main endpoints:

```text
POST /api/v1/memoriais/{tipo}/from-files/persist
GET  /api/v1/memoriais
GET  /api/v1/memoriais?type=telecom
GET  /api/v1/memoriais/{id}
GET  /api/v1/memoriais/{id}/download
```

Type mapping:

```text
telecomunicacoes -> telecom
eletrico -> eletrico
gas_natural -> gas-natural
gas_glp -> glp
```

## Work Checklist

### 1. Type API Contract

- [x] Update `src/types/index.ts` with `ApiMemorialType`.
- [x] Add generated memorial backend response interfaces.
- [x] Add API error interfaces.
- [x] Keep the existing `Memorial` UI model.
- [x] Confirm `docxUrl` represents backend `download_url`.

### 2. Replace API Service

- [x] Update `src/services/api.ts`.
- [x] Add UI-to-API and API-to-UI memorial type maps.
- [x] Add `toMemorial()` adapter.
- [x] Replace `generateMemorial()` with `POST /api/v1/memoriais/{tipo}/from-files/persist`.
- [x] Replace `listMemorials()` with `GET /api/v1/memoriais`.
- [x] Replace `getMemorial()` with `GET /api/v1/memoriais/{id}`.
- [x] Add `refreshMemorialDownloadUrl()` using `GET /api/v1/memoriais/{id}/download`.
- [x] Make `correctMemorial()` explicitly unsupported for now.

### 3. Wire Dashboard State

- [x] Update `src/pages/Dashboard.tsx`.
- [x] Remove demo memorials as initial state.
- [x] Load generated memorial history from the API on mount.
- [x] Add history loading state.
- [x] Add history error state.
- [x] Add generation error state.
- [x] On generation success, set current memorial and prepend it to history.
- [x] On generation failure, show a useful error state.
- [x] Keep review/correction flow out of scope.

### 4. Adjust Output And Download UX

- [x] Update `src/components/MemorialOutput.tsx`.
- [x] Remove or disable correction UI for this phase.
- [x] Keep generated `.docx` download link visible.
- [x] Update `src/components/ProjectDetail.tsx` if needed for signed download URLs.
- [x] Avoid adding complex retry behavior unless manual testing proves it is needed.

### 5. Environment And Docs

- [x] Update `.env.example` with `VITE_API_URL=http://localhost:8000`.
- [x] Create or update `README.md`.
- [x] Document local two-repo startup.
- [x] Document Vercel frontend env vars.
- [x] Document Railway API env vars.
- [x] Document Supabase bucket/table requirement.

### 6. Local Manual Integration

- [x] Start API locally on port `8000`.
- [x] Start dashboard locally with Vite.
- [ ] Generate a telecom memorial using sample PDFs from the API repo.
- [ ] Generate an electric memorial using sample PDFs from the API repo.
- [ ] Generate GLP only if API `.env` has LLM extraction configured.
- [ ] Confirm generated memorial appears after page refresh.
- [ ] Confirm download link opens a signed Supabase URL.

### 7. Verification

- [x] Run `npm install` if `node_modules` is missing.
- [x] Run `npm run build`.
- [x] Run `npm run lint`.
- [x] Record any manual verification notes here.

## Production Checklist

### Vercel Frontend

- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Env var:

```env
VITE_API_URL=https://<railway-api-domain>
```

### Railway API

- [ ] Prefer a separate Railway service for the memorial API.
- [ ] Start command:

```bash
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

- [ ] Env vars:

```env
CORS_ORIGINS=https://<vercel-dashboard-domain>
SUPABASE_URL=...
SUPABASE_KEY=...
OPENAI_API_KEY=...
USE_LLM_EXTRACTION=true
GENERATED_MEMORIALS_BUCKET=generated-memorials
GENERATED_MEMORIALS_SIGNED_URL_TTL=3600
```

### Supabase

- [ ] Run `migrations/002_generated_memorials.sql` in the API repo.
- [ ] Confirm private bucket `generated-memorials` exists.

## Progress Log

- 2026-04-17: Created development tracking plan from `docs/superpowers/plans/2026-04-17-dashboard-api-connection.md`.
- 2026-04-17: Implemented API type mapping, persisted generation service calls, API-backed history loading, and disabled correction UI for this phase.
- 2026-04-17: Added README with local and production deployment notes.
- 2026-04-17: Ran `npm install`, `npm run build`, and `npm run lint`; all completed successfully.
- 2026-04-17: Started local API and called `GET /api/v1/memoriais`; API returned `500` because the Supabase hostname from `~/Projects/api_memorial_descritivo/.env` does not resolve (`Name or service not known`). Full local integration is blocked until the API `.env` Supabase URL is corrected.
- 2026-04-17: Started Vite locally at `http://127.0.0.1:5173/` and confirmed it returns `HTTP/1.1 200 OK`.
