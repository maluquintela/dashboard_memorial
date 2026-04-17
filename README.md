# Dashboard Memorial TecPred

Frontend React para gerar e acompanhar memoriais técnicos usando a API Memorial Descritivo.

O dashboard roda separado da API. A API gera os documentos `.docx`, salva os arquivos no Supabase Storage e persiste o histórico em Supabase Postgres. O frontend consome esses dados por HTTP usando `VITE_API_URL`.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Dropzone

## Desenvolvimento Local

Rode a API em um terminal:

```bash
cd ~/Projects/api_memorial_descritivo
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Rode o dashboard em outro terminal:

```bash
cd ~/Projects/dashboard_memorial
npm install
npm run dev
```

Configure o dashboard com:

```env
VITE_API_URL=http://localhost:8000
```

## Integração Com A API

O dashboard usa os endpoints persistentes da API:

```text
POST /api/v1/memoriais/{tipo}/from-files/persist
GET  /api/v1/memoriais
GET  /api/v1/memoriais?type=telecom
GET  /api/v1/memoriais/{id}
GET  /api/v1/memoriais/{id}/download
```

Mapeamento de tipos:

```text
telecomunicacoes -> telecom
eletrico -> eletrico
gas_natural -> gas-natural
gas_glp -> glp
```

## Scripts

```bash
npm run dev
```

Inicia o servidor local do Vite.

```bash
npm run build
```

Executa TypeScript e gera a build de produção.

```bash
npm run lint
```

Executa ESLint.

```bash
npm run preview
```

Serve localmente a build gerada.

## Produção

Recomendação atual:

- Frontend: Vercel
- API: Railway, preferencialmente em um serviço separado do chatbot
- Persistência: Supabase Postgres + Supabase Storage

Variável no Vercel:

```env
VITE_API_URL=https://<railway-api-domain>
```

Variáveis relevantes na API Railway:

```env
CORS_ORIGINS=https://<vercel-dashboard-domain>
SUPABASE_URL=...
SUPABASE_KEY=...
OPENAI_API_KEY=...
USE_LLM_EXTRACTION=true
GENERATED_MEMORIALS_BUCKET=generated-memorials
GENERATED_MEMORIALS_SIGNED_URL_TTL=3600
```

No Supabase, confirme que a migration `migrations/002_generated_memorials.sql` da API foi executada e que o bucket privado `generated-memorials` existe.
