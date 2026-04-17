# Dashboard API Connection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the React dashboard to the FastAPI memorial API for local separated development and production separated deployment.

**Architecture:** The dashboard remains a Vite React static frontend. The API remains a separate FastAPI backend that owns generation, Supabase persistence, signed DOCX download URLs, and generated memorial history. The frontend talks to the API through `VITE_API_URL`, normalizes backend snake_case payloads into the current camelCase UI model, and keeps the review/correction flow out of scope for this phase.

**Tech Stack:** React 19, TypeScript, Vite, Axios, FastAPI, Supabase, Vercel/Railway deployment.

---

## Deployment Recommendation

Use separate deployments:

- Frontend: Vercel is a good fit for this Vite static app.
- API: Railway is a good fit for FastAPI because generation can be CPU/network/file intensive and should not run as a Vercel serverless function.
- Supabase: keep using Supabase Postgres + Storage for generated memorial metadata and DOCX files.

If Railway already hosts the chatbot backend, prefer a separate Railway service for this memorial API unless the chatbot and memorial API are intentionally one product/runtime. A separate service gives cleaner environment variables, scaling, deploy rollback, logs, and resource limits.

Local development should run both systems separately:

```bash
# API repo
cd ~/Projects/api_memorial_descritivo
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# dashboard repo
cd ~/Projects/dashboard_memorial
npm run dev
```

Frontend local env:

```env
VITE_API_URL=http://localhost:8000
```

API local env must include:

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SUPABASE_URL=...
SUPABASE_KEY=...
GENERATED_MEMORIALS_BUCKET=generated-memorials
GENERATED_MEMORIALS_SIGNED_URL_TTL=3600
```

Production env should use:

```env
# Vercel frontend
VITE_API_URL=https://<memorial-api-domain>

# Railway API
CORS_ORIGINS=https://<dashboard-domain>
```

## Files To Change

- Modify `src/types/index.ts`: add backend response types, API slug type, error types, and adapter-friendly fields.
- Modify `src/services/api.ts`: replace placeholder `/memorial/...` calls with the new `/api/v1/memoriais/...` endpoints.
- Modify `src/pages/Dashboard.tsx`: remove demo-first behavior, load history from API, generate persisted memorials, refresh selected/detail state.
- Modify `src/components/MemorialOutput.tsx`: remove or disable correction behavior for this phase; show API errors and download link clearly.
- Modify `src/components/UploadPanel.tsx`: keep UI mostly unchanged, but ensure it accepts multiple project PDFs and leaves observations optional.
- Modify `src/components/GeneratedList.tsx` and `src/components/ProjectDetail.tsx`: ensure download URLs refresh through API when needed.
- Create `src/services/api.test.ts` if a test framework is introduced; otherwise verify with build/lint and manual local integration.
- Modify `.env.example`: document local `VITE_API_URL`.
- Create/update `README.md`: document two-repo local startup and production env.

## API Contract

Use the API handoff doc:

```text
~/Projects/api_memorial_descritivo/docs/frontend-persistent-memorials.md
```

Frontend type mapping:

```ts
telecomunicacoes -> telecom
eletrico -> eletrico
gas_natural -> gas-natural
gas_glp -> glp
```

Primary endpoints:

```text
POST /api/v1/memoriais/{tipo}/from-files/persist
GET  /api/v1/memoriais
GET  /api/v1/memoriais?type=telecom
GET  /api/v1/memoriais/{id}
GET  /api/v1/memoriais/{id}/download
```

## Task 1: Type the Backend Contract

**Files:**
- Modify: `src/types/index.ts`

- [ ] Add API slug type:

```ts
export type ApiMemorialType = 'telecom' | 'eletrico' | 'gas-natural' | 'glp';
```

- [ ] Add backend response types:

```ts
export interface GeneratedMemorialApiResponse {
  id: string;
  type: ApiMemorialType;
  project_name: string;
  status: 'ready' | 'error' | 'generating';
  observations?: string | null;
  pdf_filenames: string[];
  created_at: string;
  updated_at: string;
  download_url: string;
}

export interface GeneratedMemorialListApiResponse {
  memorials: GeneratedMemorialApiResponse[];
}

export interface GeneratedMemorialDownloadApiResponse {
  download_url: string;
}

export interface ApiDetailError {
  detail: string;
}

export interface ApiValidationIssue {
  path: string;
  message: string;
  validator: string;
}

export interface ApiValidationError {
  detail: string;
  errors: ApiValidationIssue[];
  extraction_report?: unknown;
}
```

- [ ] Keep the existing `Memorial` UI model for components, but make `docxUrl` represent the backend `download_url`.

- [ ] Run:

```bash
npm run build
```

Expected at this stage: likely fails until service code uses the new types. That is acceptable if this task is done before Task 2.

## Task 2: Replace Placeholder API Service

**Files:**
- Modify: `src/services/api.ts`

- [ ] Add mapping helpers:

```ts
const API_TYPE_BY_UI_TYPE: Record<MemorialType, ApiMemorialType> = {
  telecomunicacoes: 'telecom',
  eletrico: 'eletrico',
  gas_natural: 'gas-natural',
  gas_glp: 'glp',
};

const UI_TYPE_BY_API_TYPE: Record<ApiMemorialType, MemorialType> = {
  telecom: 'telecomunicacoes',
  eletrico: 'eletrico',
  'gas-natural': 'gas_natural',
  glp: 'gas_glp',
};
```

- [ ] Add adapter:

```ts
function toMemorial(api: GeneratedMemorialApiResponse): Memorial {
  return {
    id: api.id,
    type: UI_TYPE_BY_API_TYPE[api.type],
    projectName: api.project_name,
    createdAt: api.created_at,
    docxUrl: api.download_url,
    observations: api.observations ?? undefined,
    pdfFilenames: api.pdf_filenames,
    status: api.status,
  };
}
```

- [ ] Replace `generateMemorial` implementation with:

```ts
export async function generateMemorial(
  type: MemorialType,
  files: File[],
  observations: string
): Promise<GenerateMemorialResponse> {
  const apiType = API_TYPE_BY_UI_TYPE[type];
  const form = new FormData();
  files.forEach((file) => form.append('files', file));
  if (observations.trim()) {
    form.append('observations', observations.trim());
  }

  const { data } = await client.post<GeneratedMemorialApiResponse>(
    `/api/v1/memoriais/${apiType}/from-files/persist`,
    form
  );

  return { memorial: toMemorial(data) };
}
```

- [ ] Replace `listMemorials` with:

```ts
export async function listMemorials(
  type?: MemorialType
): Promise<ListMemorialsResponse> {
  const { data } = await client.get<GeneratedMemorialListApiResponse>(
    '/api/v1/memoriais',
    { params: type ? { type: API_TYPE_BY_UI_TYPE[type] } : undefined }
  );
  return { memorials: data.memorials.map(toMemorial) };
}
```

- [ ] Replace `getMemorial` with:

```ts
export async function getMemorial(id: string): Promise<Memorial> {
  const { data } = await client.get<GeneratedMemorialApiResponse>(
    `/api/v1/memoriais/${id}`
  );
  return toMemorial(data);
}
```

- [ ] Add download URL refresh:

```ts
export async function refreshMemorialDownloadUrl(id: string): Promise<string> {
  const { data } = await client.get<GeneratedMemorialDownloadApiResponse>(
    `/api/v1/memoriais/${id}/download`
  );
  return data.download_url;
}
```

- [ ] Make `correctMemorial` intentionally unsupported for now:

```ts
export async function correctMemorial(): Promise<CorrectMemorialResponse> {
  throw new Error('Correção por sessão ainda não está habilitada neste dashboard.');
}
```

- [ ] Run:

```bash
npm run build
```

Expected: may reveal component references to correction behavior. Fix in Task 3.

## Task 3: Wire Dashboard State To API History

**Files:**
- Modify: `src/pages/Dashboard.tsx`

- [ ] Remove `DEMO_MEMORIALS` as initial state. Use:

```ts
const [memorials, setMemorials] = useState<Memorial[]>([]);
```

- [ ] Add load/error state:

```ts
const [isLoadingHistory, setIsLoadingHistory] = useState(false);
const [historyError, setHistoryError] = useState<string | null>(null);
const [generationError, setGenerationError] = useState<string | null>(null);
```

- [ ] Update `fetchMemorials`:

```ts
const fetchMemorials = useCallback(async () => {
  setIsLoadingHistory(true);
  setHistoryError(null);
  try {
    const res = await listMemorials();
    setMemorials(res.memorials);
  } catch {
    setHistoryError('Não foi possível carregar os memoriais gerados.');
  } finally {
    setIsLoadingHistory(false);
  }
}, []);
```

- [ ] Update `handleGenerate`:

```ts
const handleGenerate = async (files: File[], observations: string) => {
  setIsGenerating(true);
  setCurrentMemorial(null);
  setGenerationError(null);
  try {
    const res = await generateMemorial(activeType, files, observations);
    setCurrentMemorial(res.memorial);
    setMemorials((prev) => [res.memorial, ...prev.filter((m) => m.id !== res.memorial.id)]);
  } catch {
    setGenerationError('Não foi possível gerar o memorial. Verifique a API e os arquivos enviados.');
    setCurrentMemorial({
      id: `err-${Date.now()}`,
      type: activeType,
      projectName: 'Falha ao gerar memorial',
      createdAt: new Date().toISOString(),
      status: 'error',
    });
  } finally {
    setIsGenerating(false);
  }
};
```

- [ ] Keep `handleCorrect` but make it set a user-facing unsupported message, or remove the correction callback from `MemorialOutput` in Task 4.

- [ ] Pass loading/error props to list/detail components only if UI support is added. If not, display a compact message above `GeneratedList`.

- [ ] Run:

```bash
npm run build
```

Expected: TypeScript success after Task 4 updates.

## Task 4: Adjust Output And Download UX

**Files:**
- Modify: `src/components/MemorialOutput.tsx`
- Modify: `src/components/ProjectDetail.tsx`

- [ ] Remove the visible correction UI from `MemorialOutput` for this phase, or replace it with disabled text:

```txt
Correções por revisão serão habilitadas em uma próxima etapa.
```

- [ ] Keep download links using `memorial.docxUrl`.

- [ ] In `ProjectDetail`, add a future-safe download refresh hook only if the link fails. Do not add retry complexity yet. The simple version keeps:

```tsx
{memorial.docxUrl ? (
  <a href={memorial.docxUrl} download className="tp-btn-primary ...">
    Baixar
  </a>
) : (
  <span>Indisponível</span>
)}
```

- [ ] Run:

```bash
npm run build
```

Expected: pass.

## Task 5: Environment And Documentation

**Files:**
- Modify: `.env.example`
- Create or modify: `README.md`

- [ ] Update `.env.example`:

```env
VITE_API_URL=http://localhost:8000
```

- [ ] Add README local startup:

```bash
cd ~/Projects/api_memorial_descritivo
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

cd ~/Projects/dashboard_memorial
npm install
npm run dev
```

- [ ] Add production environment notes:

```txt
Vercel frontend:
VITE_API_URL=https://<api-domain>

Railway API:
CORS_ORIGINS=https://<frontend-domain>
SUPABASE_URL=...
SUPABASE_KEY=...
GENERATED_MEMORIALS_BUCKET=generated-memorials
```

- [ ] Add deployment recommendation: Vercel for frontend, Railway separate FastAPI service for API, Supabase for persistence.

## Task 6: Manual Local Integration

**Files:**
- No required source changes unless defects are found.

- [ ] Start API:

```bash
cd ~/Projects/api_memorial_descritivo
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- [ ] Confirm API docs:

```text
http://localhost:8000/docs
```

- [ ] Start dashboard:

```bash
cd ~/Projects/dashboard_memorial
npm run dev
```

- [ ] Use sample PDFs from:

```text
~/Projects/api_memorial_descritivo/projects/telecom
~/Projects/api_memorial_descritivo/projects/eletrico
~/Projects/api_memorial_descritivo/projects/gas-glp
```

- [ ] Generate a telecom memorial first. Expected:

```txt
Dashboard sends POST /api/v1/memoriais/telecom/from-files/persist
API returns JSON metadata
Generated memorial appears in history
Download opens signed Supabase URL
```

- [ ] Generate electric second. Expected same behavior.

- [ ] Generate GLP only if API `.env` has `USE_LLM_EXTRACTION=true` and `OPENAI_API_KEY` configured.

## Task 7: Production Deployment Checklist

**Vercel frontend:**

- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment:

```env
VITE_API_URL=https://<railway-api-domain>
```

**Railway API:**

- [ ] Run as a dedicated FastAPI service if possible.
- [ ] Start command:

```bash
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

- [ ] Environment:

```env
CORS_ORIGINS=https://<vercel-dashboard-domain>
SUPABASE_URL=...
SUPABASE_KEY=...
OPENAI_API_KEY=...
USE_LLM_EXTRACTION=true
GENERATED_MEMORIALS_BUCKET=generated-memorials
GENERATED_MEMORIALS_SIGNED_URL_TTL=3600
```

- [ ] Supabase:

```txt
Run migrations/002_generated_memorials.sql
Create private bucket generated-memorials
```

## Test Plan

Run after implementation:

```bash
npm run build
npm run lint
```

If `npm run lint` uses a wrong global ESLint because `node_modules` is absent, run:

```bash
npm install
npm run lint
```

Manual verification is required because this app currently has no frontend test runner.

## Definition Of Done

- Dashboard loads generated memorials from the API.
- Dashboard generates memorials through `/api/v1/memoriais/{tipo}/from-files/persist`.
- Dashboard shows backend-persisted history after refresh.
- Download buttons use signed Supabase URLs.
- Local separated development works with API on port `8000` and frontend on Vite port `5173`.
- Production env strategy is documented for Vercel frontend and Railway API.
- `npm run build` passes.
- `npm run lint` passes after dependencies are installed.

## Self-Review

- Spec coverage: The plan covers local separated development, production separated deployment, API endpoint mapping, generated history persistence, signed downloads, and excludes correction/review-session UI for now.
- Placeholder scan: No open-ended implementation placeholders remain; API fields, routes, env vars, and file paths are explicit.
- Type consistency: UI type ids, API slugs, backend response fields, and adapter output fields are consistent across tasks.
