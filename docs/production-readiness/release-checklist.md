# Release Checklist

## Dashboard

- [x] Comando de instalacao identificado: `npm install`.
- [x] Comando de desenvolvimento identificado: `npm run dev`.
- [x] Comando de lint identificado: `npm run lint`.
- [x] Comando de typecheck identificado: `npm run typecheck`.
- [x] Comando de teste unitario/contrato identificado: `npm run test`.
- [x] Comando de build identificado: `npm run build`.
- [x] Comando de preview identificado: `npm run preview`.
- [x] Comando E2E identificado: `npm run e2e`.
- [x] Start de producao identificado via `nixpacks.toml`: `node server.mjs`.
- [x] Variavel frontend identificada: `VITE_API_URL`.
- [x] `VITE_API_URL` classificada como build-time no Vite.
- [x] Nenhum secret real e necessario no frontend.
- [ ] Validar em staging que o bundle foi construido com a URL correta da API.
- [ ] Validar em staging upload, historico, detalhe, download e exclusao contra API real.

## Backend

- [x] Comando local identificado: `.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`.
- [x] Start Railway identificado no `Procfile`: `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}`.
- [x] Porta padrao local identificada: `8000`.
- [x] Endpoint de liveness identificado: `GET /health/live`.
- [x] Endpoint de readiness identificado: `GET /health/ready`.
- [x] Endpoint de documentacao FastAPI esperado: `GET /docs`.
- [x] Endpoints principais persistidos identificados.
- [x] CORS configurado por `CORS_ALLOWED_ORIGINS` ou fallback `CORS_ORIGINS`.
- [x] Storage/download/delete persistidos dependem de Supabase.
- [x] Dependencia externa de IA identificada: OpenAI quando `USE_LLM_EXTRACTION` esta habilitado.
- [ ] Validar `/health/ready` no ambiente Railway real.
- [ ] Validar migrations e bucket Supabase no projeto real.
- [ ] Validar comportamento real de GLP em staging se `USE_LLM_EXTRACTION` estiver ausente.

## Bloqueadores De Staging

- [ ] Ambiente de staging precisa existir ou ser identificado claramente.
- [ ] URL publica da API de staging precisa estar configurada em `VITE_API_URL` no build do dashboard.
- [ ] `CORS_ALLOWED_ORIGINS` da API precisa incluir a origem real do dashboard de staging.
- [ ] `/health/ready` precisa retornar `200` no backend de staging.
- [ ] Smoke test de staging precisa passar com upload, historico, detalhe, download e exclusao.

## Bloqueadores De Producao

- [ ] Todos os bloqueadores de staging precisam estar resolvidos.
- [ ] Rollback manual precisa ser ensaiado ou validado no provedor.
- [ ] Railway precisa ter healthcheck apontando para `/health/ready`.
- [ ] Supabase precisa ter migrations aplicadas e bucket privado configurado.
- [ ] Observabilidade minima de logs e falhas precisa ser revisada.
- [ ] Dominio final e CORS de producao precisam estar validados.

## Itens Nao Validados Nesta Revisao

- Ambiente Railway real nao foi alterado nem inspecionado por painel.
- Deploy real nao foi feito.
- Secrets reais nao foram usados.
- Smoke de staging real nao foi executado.
- Migrations Supabase e bucket real nao foram conferidos no painel.

## Validacao Executada Nesta Revisao

- `python verify.py`: nao executou porque o binario `python` nao existe neste ambiente.
- `python3 verify.py`: executou `lint`, `typecheck`, `test` e `build` com sucesso; falhou no passo `e2e`.
- Causa da falha E2E: o `webServer` do Playwright nao conseguiu iniciar o Vite porque o ambiente bloqueou bind em `127.0.0.1:5173` com `listen EPERM`.
- Comando de reproducao da causa: `VITE_API_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5173`.
- Status E2E: nao validado neste ambiente; deve ser rodado em ambiente local/CI que permita bind de porta.
