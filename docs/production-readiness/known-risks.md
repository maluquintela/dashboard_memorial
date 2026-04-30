# Known Risks

## Bloqueadores De Staging

- Ambiente de staging real nao foi validado.
- `VITE_API_URL` precisa ser definido antes do build do dashboard; se ausente em producao, o codigo usa fallback hardcoded para um dominio Railway.
- `CORS_ALLOWED_ORIGINS` precisa incluir exatamente a origem do dashboard staging.
- `/health/ready` precisa ser configurado e validado como healthcheck real no Railway.
- Supabase real precisa ter migrations e bucket privado configurados antes de testar historico, download e exclusao.
- Smoke de staging com upload, historico, detalhe, download e exclusao ainda nao foi executado.

## Bloqueadores De Producao

- Todos os bloqueadores de staging continuam bloqueando producao.
- Rollback ainda nao foi ensaiado em ambiente real.
- Observabilidade minima ainda depende de revisao manual dos logs Railway.
- Dependencias externas OpenAI/Supabase nao tiveram disponibilidade, cotas e permissoes validadas nesta revisao.
- Politica de dominio/CORS final de producao ainda precisa ser confirmada no provedor.

## Riscos Conhecidos

- Variaveis `VITE_*` nao sao secrets; qualquer valor fica exposto ao navegador.
- O backend depende de Supabase para metadata, storage, download e exclusao dos memoriais persistidos.
- O fluxo GLP por arquivos exige extração LLM habilitada; sem `USE_LLM_EXTRACTION` a geracao pode falhar para esse tipo.
- O readiness valida configuracao, templates, storage temporario e inicializacao do cliente Supabase, mas nao prova upload/download completo no bucket.
- O dashboard tem fallback de URL de producao no codigo, o que pode mascarar erro de configuracao se `VITE_API_URL` estiver ausente.
- Nao ha autenticacao/autorizacao nesta iteracao, por decisao explicita de escopo.

## Itens Nao Validados

- Railway real.
- Deploy real.
- DNS/dominio real.
- Supabase real.
- Credenciais reais.
- Smoke test de staging real.
- Rollback real.
- Carga, performance e limite de tamanho de uploads em ambiente real.

## Recomendacoes Pos-Staging

- Remover ou tornar explicito o fallback hardcoded de producao do dashboard.
- Ensaiar rollback em staging.
- Adicionar monitoramento minimo de erro e disponibilidade.
- Documentar limites operacionais de upload e tempo de geracao.
- Revisar estrategia de auth em uma iteracao propria.
