# Go/No-Go

## Decisao

- Pronto para staging: **nao**.
- Pronto para producao: **nao**.

## Justificativa

O codigo possui comandos, healthchecks, contratos e testes automatizados identificados, mas readiness operacional ainda depende de validacoes externas que nao foram executadas nesta revisao: ambiente Railway real, variaveis reais, CORS com dominio final, Supabase real, smoke de staging e rollback.

## Para Virar Go De Staging

- [ ] Dashboard staging publicado com `VITE_API_URL` correto.
- [ ] API staging publicada com `APP_ENV=production`.
- [ ] API staging com `CORS_ALLOWED_ORIGINS` apontando para dashboard staging.
- [ ] `/health/ready` retornando `200` no dominio da API staging.
- [ ] Supabase staging com migrations e bucket privado configurados.
- [ ] Smoke de staging aprovado: upload, historico, detalhe, download e exclusao.
- [ ] Logs revisados sem secrets e sem stack trace para usuario.

## Para Virar Go De Producao

- [ ] Todos os criterios de staging aprovados.
- [ ] Dominio de producao definido.
- [ ] CORS de producao validado.
- [ ] Smoke de producao planejado com arquivo de teste nao sensivel.
- [ ] Rollback ensaiado ou aprovado pelo responsavel operacional.
- [ ] Checklist Railway concluido.
- [ ] Observabilidade minima definida para o periodo pos-release.

## Bloqueadores Separados

Staging:

- Staging real nao validado.
- Healthcheck `/health/ready` nao validado no provedor.
- CORS real nao validado.
- Supabase real nao validado.
- Smoke real nao executado.

Producao:

- Staging ainda esta em no-go.
- Rollback real nao validado.
- Dominio/CORS final nao validado.
- Observabilidade operacional nao validada.

## Itens Nao Validados

- Deploy real.
- Railway real.
- Supabase real.
- Secrets reais.
- Smoke real de staging.
- Rollback real.
