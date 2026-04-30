# Rollback Plan

## Principios

- Rollback deve priorizar restaurar disponibilidade e impedir perda de artefatos.
- Nao executar rollback de banco sem avaliar compatibilidade de schema.
- Nao apagar bucket nem objetos gerados como primeira resposta a incidente.
- Registrar horario, deploy afetado, request ids relevantes e acao tomada.

## Dashboard

1. Identificar deploy anterior conhecido como estavel.
2. Reverter para o deploy anterior no provedor do dashboard.
3. Confirmar que o deploy revertido ainda aponta para a API correta via `VITE_API_URL`.
4. Executar smoke:
   - abrir dashboard;
   - abrir historico;
   - abrir detalhe de memorial existente;
   - testar download de memorial `ready`.
5. Se o problema for apenas URL de API incorreta, corrigir variavel e rebuildar em staging antes de producao.

## API

1. Identificar deploy anterior conhecido como estavel no Railway.
2. Reverter para o deploy anterior.
3. Confirmar que variaveis de ambiente continuam presentes.
4. Confirmar:

```bash
curl -f https://<api-domain>/health/live
curl -f https://<api-domain>/health/ready
```

5. Executar smoke via dashboard ou chamadas HTTP controladas.
6. Se houver falha de storage, nao remover metadata manualmente sem reconciliar objeto no bucket.

## Supabase

- Se a falha envolver migration nova, pausar deploy de aplicacao e avaliar plano especifico de banco.
- Preferir roll-forward corretivo quando dados ja foram escritos no novo formato.
- Antes de qualquer rollback destrutivo, exportar evidencia dos registros afetados.

## Criterios De Sucesso Do Rollback

- `/health/ready` retorna `200`.
- Dashboard carrega contra a API esperada.
- Historico carrega sem erro de CORS.
- Download de memorial `ready` funciona.
- Logs nao mostram erro recorrente para o fluxo principal.

## Nao Validado

Rollback real no Railway nao foi executado nesta revisao.
