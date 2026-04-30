# Railway Checklist

Checklist manual. Nao foi feita nenhuma alteracao real no Railway nesta revisao.

## API

- [ ] Confirmar servico separado para API ou isolamento claro se monorepo.
- [ ] Confirmar build command de Python conforme setup do repositorio.
- [ ] Confirmar start command: `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}`.
- [ ] Confirmar `Healthcheck Path`: `/health/ready`.
- [ ] Confirmar restart policy adequada para falha de processo.
- [ ] Confirmar dominio publico da API.
- [ ] Confirmar `APP_ENV=production`.
- [ ] Confirmar `CORS_ALLOWED_ORIGINS` com o dominio real do dashboard.
- [ ] Confirmar `GENERATED_MEMORIALS_BUCKET`.
- [ ] Confirmar `GENERATED_MEMORIALS_SIGNED_URL_TTL`.
- [ ] Confirmar `SUPABASE_URL`.
- [ ] Confirmar `SUPABASE_KEY`.
- [ ] Confirmar `USE_LLM_EXTRACTION` se fluxos dependentes de LLM forem usados.
- [ ] Confirmar `OPENAI_API_KEY` se `USE_LLM_EXTRACTION` estiver habilitado.
- [ ] Confirmar logs sem secrets.
- [ ] Confirmar `/health/live`, `/health/ready` e `/docs`.

## Dashboard

- [ ] Confirmar build command: `npm ci && npm run build` ou equivalente.
- [ ] Confirmar start command: `node server.mjs`.
- [ ] Confirmar Node compativel com `package.json` (`>=22.12.0`) ou ajustar runtime.
- [ ] Confirmar `VITE_API_URL` apontando para a API correta antes do build.
- [ ] Confirmar dominio publico do dashboard.
- [ ] Confirmar que a API aceita esse dominio no CORS.
- [ ] Confirmar preview/staging separado de producao.

## Storage E Banco

- [ ] Confirmar migrations aplicadas, incluindo tabela `generated_memorials`.
- [ ] Confirmar bucket privado `generated-memorials` ou bucket configurado.
- [ ] Confirmar permissao do backend para inserir metadata.
- [ ] Confirmar permissao do backend para upload, signed URL e remove no bucket.
- [ ] Confirmar que URLs assinadas expiram conforme TTL.

## Rollback E Operacao

- [ ] Confirmar como escolher deploy anterior no Railway.
- [ ] Confirmar rollback da API testado em staging ou documentado pelo time.
- [ ] Confirmar rollback do dashboard testado em staging ou documentado pelo time.
- [ ] Confirmar responsavel por acompanhar logs apos deploy.
- [ ] Confirmar smoke test de staging antes de producao.
