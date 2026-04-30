# Production Readiness

Revisao final da story RDY-009 para o dashboard Memorial TecPred e a API Memorial Descritivo.

Esta pasta consolida a decisao operacional antes de promover o sistema para staging ou producao. A revisao foi coordenada pelo repositorio `dashboard_memorial`; o backend em `~/Projects/api_memorial_descritivo` foi inspecionado somente em modo leitura.

## Escopo

- Dashboard React/Vite em `dashboard_memorial`.
- API FastAPI em `api_memorial_descritivo`, somente leitura.
- Railway como checklist manual, sem alteracao real.
- Supabase e OpenAI como dependencias externas documentadas, sem secrets reais.

## Documentos

- [release-checklist.md](./release-checklist.md): checklist final de release.
- [environment-matrix.md](./environment-matrix.md): variaveis por servico e ambiente.
- [smoke-test-plan.md](./smoke-test-plan.md): smoke local e staging.
- [railway-checklist.md](./railway-checklist.md): conferencias manuais no Railway.
- [known-risks.md](./known-risks.md): riscos, bloqueadores e itens nao validados.
- [rollback-plan.md](./rollback-plan.md): plano de rollback.
- [go-no-go.md](./go-no-go.md): decisao clara para staging e producao.

## Resultado

- Pronto para staging: **nao**, enquanto os itens de staging em [go-no-go.md](./go-no-go.md) nao forem validados.
- Pronto para producao: **nao**, enquanto staging, CORS/domino real, Railway, Supabase, rollback e smoke real nao forem validados.

Nenhum deploy foi feito nesta revisao.
