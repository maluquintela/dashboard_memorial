# Environment Matrix

Nao colocar secrets reais neste arquivo. Use placeholders e configure os valores reais apenas no provedor apropriado.

## Dashboard

| Variavel | Ambiente | Tipo | Obrigatoria | Exemplo seguro | Observacao |
| --- | --- | --- | --- | --- | --- |
| `VITE_API_URL` | local | build-time Vite | recomendada | `http://localhost:8000` | Usada por `import.meta.env`; entra no bundle gerado. |
| `VITE_API_URL` | staging | build-time Vite | sim | `https://<api-staging-domain>` | Precisa ser definida antes do build/deploy do dashboard. |
| `VITE_API_URL` | producao | build-time Vite | sim | `https://<api-production-domain>` | Nao deve conter secrets. |
| `PORT` | producao do static server | runtime | opcional | `8080` | Lido por `server.mjs`; default `8080`. |

Risco observado: `src/services/api.ts` possui fallback de producao para um dominio Railway hardcoded. Para staging/producao, preferir sempre `VITE_API_URL` explicita e revisar se o fallback ainda e desejado.

## Backend

| Variavel | Ambiente | Obrigatoria | Exemplo seguro | Observacao |
| --- | --- | --- | --- | --- |
| `APP_ENV` | local | opcional | `local` | Default local quando ausente. |
| `APP_ENV` | staging/producao | sim | `production` | Ativa validacoes estritas de CORS e storage. |
| `CORS_ALLOWED_ORIGINS` | staging/producao | sim | `https://<dashboard-domain>` | Lista separada por virgulas. |
| `CORS_ORIGINS` | staging/producao | alternativa | `https://<dashboard-domain>` | Fallback legado quando `CORS_ALLOWED_ORIGINS` nao existe. |
| `GENERATED_MEMORIALS_BUCKET` | staging/producao | sim | `generated-memorials` | Exigida explicitamente em `APP_ENV=production`. |
| `GENERATED_MEMORIALS_SIGNED_URL_TTL` | todos | opcional | `3600` | Inteiro positivo; default `3600`. |
| `SUPABASE_URL` | staging/producao | sim | `https://<project>.supabase.co` | Necessaria para metadata e storage persistidos. |
| `SUPABASE_KEY` | staging/producao | sim | `<supabase-key>` | Secret; nao expor em frontend nem docs. |
| `USE_LLM_EXTRACTION` | conforme memorial | opcional/condicional | `true` | Habilita extração assistida por LLM. GLP por arquivos requer LLM habilitada. |
| `OPENAI_API_KEY` | quando LLM ativa | sim condicional | `<openai-api-key>` | Secret de backend. |
| `OPENAI_MODEL` | quando LLM ativa | opcional | `gpt-5.4` | Default no codigo: `gpt-5.4`. |
| `SESSIONS_DIR` | local/filesystem | opcional | `sessions` | Usada pelo store de sessoes em filesystem. |
| `PORT` | Railway | sim pelo provedor | `${PORT}` | Usada no `Procfile`. |

## Segredos

- Nenhuma variavel `VITE_*` deve carregar secret, porque fica disponivel ao navegador.
- `SUPABASE_KEY`, `OPENAI_API_KEY`, tokens e credenciais devem existir apenas no backend/provedor.
- Valores reais nao foram adicionados nesta revisao.
