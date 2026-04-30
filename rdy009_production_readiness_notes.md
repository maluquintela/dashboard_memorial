# RDY-009: checklist final de staging e produção

## Contexto

O sistema de memoriais está dividido em dois repositórios locais:

- Backend: ~/Projects/api_memorial_descritivo
- Dashboard: ~/Projects/dashboard-memorial

O sistema já está deployado no Railway para uso básico de testes, mas ainda precisa de uma revisão final antes de ser considerado pronto para staging/produção.

As iterações anteriores trataram:

- UX principal do dashboard;
- responsividade mobile;
- estados de loading;
- upload com erro recuperável;
- contrato backend-dashboard;
- testes E2E reais com Playwright;
- correção de sobreposição no histórico;
- download e exclusão no fluxo E2E;
- mensagens seguras para usuário.

## Objetivo

Produzir uma revisão final de production readiness, sem fazer deploy real e sem alterar o backend.

A saída esperada é um conjunto de documentos e validações que indiquem:

1. O que está pronto.
2. O que ainda é risco.
3. O que bloqueia staging.
4. O que bloqueia produção.
5. Quais variáveis são necessárias.
6. Quais comandos validam o sistema.
7. Como fazer smoke test.
8. Como fazer rollback.
9. Quais checks manuais precisam ser feitos no Railway.

## Decisão de escopo

Esta iteração deve rodar no dashboard como repositório coordenador.

O backend deve ser inspecionado em modo leitura.

Não alterar arquivos em:

- ~/Projects/api_memorial_descritivo

Se for encontrada necessidade de mudança no backend, registrar como bloqueador ou recomendação no checklist final.

## Itens obrigatórios da revisão

### Backend

Verificar em modo leitura:

- comando de start;
- porta usada;
- endpoints principais;
- endpoint de documentação;
- existência ou ausência de healthcheck estável;
- variáveis obrigatórias;
- variáveis opcionais;
- CORS;
- limites de upload;
- storage de artefatos;
- download;
- delete;
- erros seguros;
- logs;
- dependências;
- testes;
- migrações ou estrutura de banco;
- dependência de IA ou serviço externo;
- comportamento sem credencial externa.

### Dashboard

Verificar:

- comando de build;
- comando de start/preview;
- variável de URL da API;
- se variável do frontend é build-time ou runtime;
- ausência de secrets no bundle;
- fluxo principal;
- upload;
- histórico;
- detalhe;
- download;
- exclusão;
- loading;
- erros;
- mobile 390px;
- testes unitários;
- testes E2E;
- acessibilidade básica;
- mensagens seguras.

### Railway

Não fazer alterações reais no Railway.

Criar checklist manual para conferir:

- serviços separados ou monorepo;
- build command;
- start command;
- healthcheck path;
- restart policy;
- variáveis por serviço;
- domínio público;
- CORS com domínio real;
- logs;
- volumes ou storage;
- deploy preview/staging;
- rollback;
- monitoramento mínimo.

## Documentos esperados

Criar, no dashboard, uma pasta:

docs/production-readiness/

Com pelo menos estes arquivos:

1. docs/production-readiness/README.md
2. docs/production-readiness/release-checklist.md
3. docs/production-readiness/environment-matrix.md
4. docs/production-readiness/smoke-test-plan.md
5. docs/production-readiness/railway-checklist.md
6. docs/production-readiness/known-risks.md
7. docs/production-readiness/rollback-plan.md
8. docs/production-readiness/go-no-go.md

## Regras

- Não usar secrets reais.
- Não escrever valores reais de chaves.
- Não fazer deploy.
- Não alterar backend.
- Não alterar templates DOCX.
- Não remover testes.
- Não mascarar problema como pronto.
- Se algo não puder ser validado, marcar como "não validado".
- Se algo bloquear produção mas não bloquear staging, separar claramente.
- Se algo bloquear staging, marcar claramente.
- Atualizar learnings.md em modo append-only.

## Resultado esperado

Ao final, deve existir uma decisão clara:

- Pronto para staging: sim/não.
- Pronto para produção: sim/não.
- Bloqueadores.
- Próximas ações mínimas.
