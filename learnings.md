# Learnings

Este arquivo deve acumular aprendizados entre tentativas do Ralph.

## Regras importantes

- Não alterar o backend nesta iteração.
- Não alterar contrato de API sem necessidade.
- Preferir mudanças pequenas e revisáveis.
- Toda mudança deve preservar o fluxo atual do usuário.
- O foco desta primeira iteração é UX de histórico e detalhe.
- Estados vazios, loading, erro e responsividade são prioridade.


## Story UX-001 concluída

Tentativa bem-sucedida: 1


## Story UX-002 concluída

Tentativa bem-sucedida: 1


## Story UX-003 concluída

Tentativa bem-sucedida: 1

## Iteração RDY-007: contrato backend-dashboard

A próxima etapa é adaptar o dashboard aos contratos endurecidos do backend.

Objetivo:

- ler o backend como fonte de contrato;
- atualizar o frontend para lidar com erros e estados reais da API;
- normalizar erros em uma camada única;
- evitar mensagens técnicas brutas para o usuário;
- impedir estados enganosos na UI;
- garantir que upload, geração, histórico, download e exclusão tratem falhas de forma previsível.

Diretrizes:

1. Trabalhar somente no repositório dashboard-memorial.
2. Tratar ~/Projects/api_memorial_descritivo como leitura apenas.
3. Não alterar backend.
4. Não alterar templates DOCX.
5. Não implementar autenticação.
6. Não implementar Playwright E2E completo nesta iteração.
7. Priorizar contrato, estados, mensagens e testes de integração/unitários do frontend.
8. Rodar verify.py antes de concluir.

## RDY-007 tentativa 1: contrato backend-dashboard inspecionado

Backend lido em modo somente leitura em `~/Projects/api_memorial_descritivo`.

Contrato encontrado para o dashboard:

- Histórico persistido: `GET /api/v1/memoriais` retorna `memorials` com `id`, `type`, `project_name`, `status`, `observations`, `pdf_filenames`, `created_at`, `updated_at` e `download_url`.
- Detalhe persistido: `GET /api/v1/memoriais/{memorial_id}` retorna o mesmo formato; `404` usa `detail: "Memorial não encontrado."`.
- Geração persistida: `POST /api/v1/memoriais/{memorial_type}/from-files/persist` retorna `201` com o memorial persistido quando concluído.
- Estados reais do memorial persistido: `processing`, `ready` e `failed`; o dashboard também deve aceitar equivalentes `pending` e `succeeded`.
- Download: `GET /api/v1/memoriais/{memorial_id}/download` só é válido quando `status == "ready"`.
- Download não pronto: o backend retorna `409` com `error.code: "generated_memorial_not_ready"` e mensagem segura.
- Artefato ausente no storage: o backend retorna `404` com `detail: "Arquivo do memorial não está mais disponível."`.
- Falha de storage: o backend retorna `503` com envelope seguro `error.code: "generated_memorial_storage_error"`.
- Erro interno inesperado: o backend retorna `500` com `error.code: "internal_server_error"` e mensagem genérica segura, sem stack trace.
- Upload sem arquivos: `400` com `detail: "Envie ao menos um arquivo PDF ou DOCX."`.
- Upload com extensão inválida: `400` com `detail` contendo `Extensao nao suportada`.
- Upload com content-type inválido: `400` com `detail` contendo `Content-Type invalido`.
- Exclusão: `DELETE /api/v1/memoriais/{memorial_id}` retorna `204` quando remove; `404` quando memorial ou artefato não existe; `503` para falha de storage.


## Story RDY-007 concluída

Tentativa bem-sucedida: 1

## Iteração RDY-008: testes E2E reais

Objetivo:

- criar uma suíte E2E mínima com Playwright;
- testar o dashboard em navegador real;
- validar desktop e mobile;
- validar fluxo de histórico, detalhe, download e exclusão;
- validar upload, erro de geração e mensagens seguras;
- diferenciar testes com backend real local de testes com contrato mockado via Playwright;
- não depender do Railway;
- não usar credenciais reais;
- não alterar backend.

Diretrizes:

1. Trabalhar somente no dashboard-memorial.
2. Manter api_memorial_descritivo rodando localmente em http://127.0.0.1:8000.
3. Não usar Playwright MCP.
4. Usar Playwright Test.
5. Criar testes pequenos, estáveis e com seletores acessíveis quando possível.
6. Evitar sleeps fixos.
7. Preferir expectativas web-first do Playwright.
8. Atualizar verify.py para rodar E2E quando o script existir.
9. Rodar python verify.py antes de concluir.

## RDY-008 tentativa 1: suíte E2E configurada

Implementação:

- Playwright Test foi adicionado como dependência de desenvolvimento para testes em navegador real.
- A configuração E2E usa Chromium, base local do Vite e `VITE_API_URL=http://127.0.0.1:8000`.
- O smoke `real-backend` valida abertura do dashboard contra a API local e pula explicitamente quando `127.0.0.1:8000` não está disponível.
- Os testes `contract-mocked` usam interceptação Playwright baseada no contrato persistente do backend para cobrir histórico, detalhe, download, exclusão, mobile 390px, loading inicial, geração failed, geração processing, erro de upload recuperável e erro de rede seguro.
- `package.json` ganhou scripts `typecheck`, `e2e` e `e2e:ui`.
- `verify.py` passou a executar `e2e` quando o script existir.
- `README.md` documenta como iniciar o backend local antes da suíte E2E.

Observação de ambiente:

- Neste sandbox, iniciar o Vite para Playwright falhou com `listen EPERM`, então a validação E2E precisa ser rodada em um ambiente local que permita bind de porta.


## Falha na story RDY-008, tentativa 1

STDOUT:

> dashboard_memorial@0.0.0 lint
> eslint .


> dashboard_memorial@0.0.0 typecheck
> tsc -b


> dashboard_memorial@0.0.0 test
> node --test apiContracts.test.ts

✔ normalizes network failures as API unavailable (0.797264ms)
✔ prefers safe backend 500 envelope without leaking raw details (0.4483ms)
✔ normalizes upload validation details into actionable messages (0.369632ms)
✔ maps backend generation statuses without treating failed or processing as ready (0.212944ms)
✔ normalizes unavailable download and missing artifact responses (0.314308ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 83.535502

> dashboard_memorial@0.0.0 build
> tsc -b && vite build

[36mvite v8.0.8 [32mbuilding client environment for production...[36m[39m
[2K
transforming...✓ 1789 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.87 kB │ gzip:   0.48 kB
dist/assets/index-Dq16AAKp.css   28.70 kB │ gzip:   6.29 kB
dist/assets/index-CzKg6lfh.js   441.42 kB │ gzip: 135.09 kB

[32m✓ built in 248ms[39m

> dashboard_memorial@0.0.0 e2e
> playwright test


Running 7 tests using 6 workers

  ✓  6 [chromium] › e2e/contract-mocked.spec.ts:188:1 › network error shows understandable safe message without stack trace or internal path (3.0s)
  ✓  4 [chromium] › e2e/contract-mocked.spec.ts:117:1 › mobile 390 keeps generated memorials accessible without critical horizontal overflow (3.3s)
  ✓  3 [chromium] › e2e/contract-mocked.spec.ts:133:1 › loading history is not presented as a real empty state (3.6s)
  ✓  2 [chromium] › e2e/contract-mocked.spec.ts:174:1 › recoverable upload error keeps selected file and hides technical details (3.7s)
  ✘  7 [chromium] › e2e/real-backend.spec.ts:5:1 › real-backend smoke opens dashboard against the local API (871ms)
  ✘  8 [chromium] › e2e/real-backend.spec.ts:5:1 › real-backend smoke opens dashboard against the local API (retry #1) (840ms)
  ✘  1 [chromium] › e2e/contract-mocked.spec.ts:93:1 › desktop opens generated memorials, selects detail, downloads and deletes (30.2s)
  ✘  5 [chromium] › e2e/contract-mocked.spec.ts:158:1 › failed and processing generations show safe state and block unavailable download (30.2s)
  ✘  9 [chromium] › e2e/contract-mocked.spec.ts:93:1 › desktop opens generated memorials, selects detail, downloads and deletes (retry #1) (30.3s)
  ✘  10 [chromium] › e2e/contract-mocked.spec.ts:158:1 › failed and processing generations show safe state and block unavailable download (retry #1) (30.3s)


  1) [chromium] › e2e/contract-mocked.spec.ts:93:1 › desktop opens generated memorials, selects detail, downloads and deletes 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' })[22m
    [2m    - locator resolved to <button type="button" aria-label="Selecionar Projeto Telecom Alpha" class="flex w-full min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4c4fbf] sm:items-center">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    50 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


       98 |   await expect(page.getByRole('heading', { name: 'Memoriais gerados' })).toBeVisible();
       99 |
    > 100 |   await page.getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' }).click();
          |                                                                                ^
      101 |   await expect(page.getByRole('heading', { name: 'Projeto Telecom Alpha' })).toBeVisible();
      102 |   await expect(page.getByText('Pronto para download')).toBeVisible();
      103 |
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:100:80

    Error Context: test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' })[22m
    [2m    - locator resolved to <button type="button" aria-label="Selecionar Projeto Telecom Alpha" class="flex w-full min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4c4fbf] sm:items-center">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    55 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


       98 |   await expect(page.getByRole('heading', { name: 'Memoriais gerados' })).toBeVisible();
       99 |
    > 100 |   await page.getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' }).click();
          |                                                                                ^
      101 |   await expect(page.getByRole('heading', { name: 'Projeto Telecom Alpha' })).toBeVisible();
      102 |   await expect(page.getByText('Pronto para download')).toBeVisible();
      103 |
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:100:80

    Error Context: test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [chromium] › e2e/contract-mocked.spec.ts:158:1 › failed and processing generations show safe state and block unavailable download 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('button', { name: 'Selecionar Projeto Telecom Com Falha' })[22m
    [2m    - locator resolved to <button type="button" aria-label="Selecionar Projeto Telecom Com Falha" class="flex w-full min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4c4fbf] sm:items-center">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    51 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      161 |   await page.getByRole('button', { name: 'Memoriais gerados' }).click();
      162 |
    > 163 |   await page.getByRole('button', { name: 'Selecionar Projeto Telecom Com Falha' }).click();
          |                                                                                    ^
      164 |   await expect(page.getByRole('heading', { name: 'Projeto Telecom Com Falha' })).toBeVisible();
      165 |   await expect(page.getByText('Erro na geração')).toBeVisible();
      166 |   await expect(page.getByText('Falha segura retornada pela API.')).toBeVisible();
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:163:84

    Error Context: test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('button', { name: 'Selecionar Projeto Telecom Com Falha' })[22m
    [2m    - locator resolved to <button type="button" aria-label="Selecionar Projeto Telecom Com Falha" class="flex w-full min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4c4fbf] sm:items-center">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    55 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      161 |   await page.getByRole('button', { name: 'Memoriais gerados' }).click();
      162 |
    > 163 |   await page.getByRole('button', { name: 'Selecionar Projeto Telecom Com Falha' }).click();
          |                                                                                    ^
      164 |   await expect(page.getByRole('heading', { name: 'Projeto Telecom Com Falha' })).toBeVisible();
      165 |   await expect(page.getByText('Erro na geração')).toBeVisible();
      166 |   await expect(page.getByText('Falha segura retornada pela API.')).toBeVisible();
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:163:84

    Error Context: test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [chromium] › e2e/real-backend.spec.ts:5:1 › real-backend smoke opens dashboard against the local API 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

    Locator: getByRole('heading', { name: 'Dashboard' })
    Expected: visible
    Error: strict mode violation: getByRole('heading', { name: 'Dashboard' }) resolved to 2 elements:
        1) <h1 class="truncate text-lg font-semibold leading-tight text-white sm:text-xl">Dashboard Memorial</h1> aka getByRole('heading', { name: 'Dashboard Memorial' })
        2) <h2 class="text-2xl font-bold tracking-tight">Dashboard</h2> aka getByRole('heading', { name: 'Dashboard', exact: true })

    Call log:
    [2m  - Expect "toBeVisible" with timeout 5000ms[22m
    [2m  - waiting for getByRole('heading', { name: 'Dashboard' })[22m


      12 |   await page.goto('/');
      13 |
    > 14 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
         |                                                                  ^
      15 |   await expect(page.getByRole('button', { name: 'Memoriais gerados' })).toBeVisible();
      16 | });
      17 |
        at /home/juca/Projects/dashboard_memorial/e2e/real-backend.spec.ts:14:66

    Error Context: test-results/real-backend-real-backend--afe97-board-against-the-local-API-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/real-backend-real-backend--afe97-board-against-the-local-API-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/real-backend-real-backend--afe97-board-against-the-local-API-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

    Locator: getByRole('heading', { name: 'Dashboard' })
    Expected: visible
    Error: strict mode violation: getByRole('heading', { name: 'Dashboard' }) resolved to 2 elements:
        1) <h1 class="truncate text-lg font-semibold leading-tight text-white sm:text-xl">Dashboard Memorial</h1> aka getByRole('heading', { name: 'Dashboard Memorial' })
        2) <h2 class="text-2xl font-bold tracking-tight">Dashboard</h2> aka getByRole('heading', { name: 'Dashboard', exact: true })

    Call log:
    [2m  - Expect "toBeVisible" with timeout 5000ms[22m
    [2m  - waiting for getByRole('heading', { name: 'Dashboard' })[22m


      12 |   await page.goto('/');
      13 |
    > 14 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
         |                                                                  ^
      15 |   await expect(page.getByRole('button', { name: 'Memoriais gerados' })).toBeVisible();
      16 | });
      17 |
        at /home/juca/Projects/dashboard_memorial/e2e/real-backend.spec.ts:14:66

    Error Context: test-results/real-backend-real-backend--afe97-board-against-the-local-API-chromium-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/real-backend-real-backend--afe97-board-against-the-local-API-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/real-backend-real-backend--afe97-board-against-the-local-API-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3 failed
    [chromium] › e2e/contract-mocked.spec.ts:93:1 › desktop opens generated memorials, selects detail, downloads and deletes 
    [chromium] › e2e/contract-mocked.spec.ts:158:1 › failed and processing generations show safe state and block unavailable download 
    [chromium] › e2e/real-backend.spec.ts:5:1 › real-backend smoke opens dashboard against the local API 
  4 passed (1.1m)

$ npm run lint

$ npm run typecheck

$ npm run test

$ npm run build

$ npm run e2e

## RDY-008 tentativa 5: seletor exato para estado em processamento

Correção aplicada sobre a falha da tentativa anterior:

- A falha restante do E2E não era regressão visual nem contrato quebrado; era ambiguidade do seletor `getByText('Em geração')`.
- O texto de status `Em geração` também casava como substring da observação mockada `Ainda em geração.`, causando violação de strict mode no Playwright.
- O teste passou a usar `getByText('Em geração', { exact: true })`, preservando a cobertura do estado processing e mantendo seletores acessíveis/estáveis sem `force: true`.

Validação executada nesta tentativa:

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou.
- `npm run build`: passou.
- `npm run e2e -- --grep "failed and processing"`: não executou os testes porque o `webServer` do Playwright não conseguiu iniciar.
- `python verify.py`: não executou porque o binário `python` não existe neste ambiente.
- `python3 verify.py`: rodou lint, typecheck, test e build com sucesso, mas falhou no passo `e2e` porque o `webServer` do Playwright não conseguiu iniciar.

Bloqueio de ambiente confirmado:

- `VITE_API_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5173` falhou com `listen EPERM: operation not permitted 127.0.0.1:5173`.
- A correção do seletor precisa ser validada em ambiente local que permita bind de porta para o Vite.

## RDY-008 tentativa 5: seletor exato para estado em processamento

Correção aplicada sobre a falha da tentativa anterior:

- A falha restante do E2E não era regressão visual nem contrato quebrado; era ambiguidade do seletor `getByText('Em geração')`.
- O texto de status `Em geração` também casava como substring da observação mockada `Ainda em geração.`, causando violação de strict mode no Playwright.
- O teste passou a usar `getByText('Em geração', { exact: true })`, preservando a cobertura do estado processing e mantendo seletores acessíveis/estáveis sem `force: true`.

Validação executada nesta tentativa:

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou.
- `npm run build`: passou.
- `npm run e2e -- --grep "failed and processing"`: não executou os testes porque o `webServer` do Playwright não conseguiu iniciar.
- `python verify.py`: não executou porque o binário `python` não existe neste ambiente.
- `python3 verify.py`: rodou lint, typecheck, test e build com sucesso, mas falhou no passo `e2e` porque o `webServer` do Playwright não conseguiu iniciar.

Bloqueio de ambiente confirmado:

- `VITE_API_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5173` falhou com `listen EPERM: operation not permitted 127.0.0.1:5173`.
- A correção do seletor precisa ser validada em ambiente local que permita bind de porta para o Vite.

## RDY-008 tentativa 3: correção da área clicável do histórico desktop

Correção aplicada sobre a falha da tentativa 2:

- A causa da falha estava no layout do item de histórico em desktop: o botão acessível `Selecionar ...` existia na árvore, mas sua caixa clicável podia ser calculada sem área visível/interativa confiável dentro do flex row.
- `GeneratedList` passou a dar altura mínima, padding e `sm:basis-0` ao botão de seleção, mantendo o layout responsivo e tornando o alvo de clique estável.
- O helper E2E voltou a usar seletor acessível por role e label (`button` com nome `Selecionar ...`), em vez de clicar no texto interno.

## RDY-008 tentativa 2: correção dos seletores E2E

Correção aplicada sobre a falha da tentativa 1:

- O smoke com backend real passou a usar `getByRole('heading', { name: 'Dashboard', exact: true })` para não casar parcialmente com `Dashboard Memorial`.
- Os testes mockados de seleção no histórico passaram a clicar no texto visível do projeto, evitando timeout quando o botão acessível existe no snapshot mas o Playwright o calcula fora da área visível/interativa no layout desktop.
- A cobertura de download, exclusão, detalhe, estado failed e estado processing foi preservada.


## Falha na story RDY-008, tentativa 2

STDOUT:

> dashboard_memorial@0.0.0 lint
> eslint .


> dashboard_memorial@0.0.0 typecheck
> tsc -b


> dashboard_memorial@0.0.0 test
> node --test apiContracts.test.ts

✔ normalizes network failures as API unavailable (0.676905ms)
✔ prefers safe backend 500 envelope without leaking raw details (0.216991ms)
✔ normalizes upload validation details into actionable messages (0.196708ms)
✔ maps backend generation statuses without treating failed or processing as ready (0.104097ms)
✔ normalizes unavailable download and missing artifact responses (0.128584ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 82.610769

> dashboard_memorial@0.0.0 build
> tsc -b && vite build

[36mvite v8.0.8 [32mbuilding client environment for production...[36m[39m
[2K
transforming...✓ 1789 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.87 kB │ gzip:   0.48 kB
dist/assets/index-Dq16AAKp.css   28.70 kB │ gzip:   6.29 kB
dist/assets/index-CzKg6lfh.js   441.42 kB │ gzip: 135.09 kB

[32m✓ built in 211ms[39m

> dashboard_memorial@0.0.0 e2e
> playwright test


Running 7 tests using 6 workers

  ✓  1 [chromium] › e2e/contract-mocked.spec.ts:192:1 › network error shows understandable safe message without stack trace or internal path (1.8s)
  ✓  5 [chromium] › e2e/contract-mocked.spec.ts:121:1 › mobile 390 keeps generated memorials accessible without critical horizontal overflow (1.8s)
  ✓  6 [chromium] › e2e/contract-mocked.spec.ts:137:1 › loading history is not presented as a real empty state (2.2s)
  ✓  4 [chromium] › e2e/contract-mocked.spec.ts:178:1 › recoverable upload error keeps selected file and hides technical details (2.4s)
  ✓  7 [chromium] › e2e/real-backend.spec.ts:5:1 › real-backend smoke opens dashboard against the local API (877ms)
  ✘  3 [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download (30.2s)
  ✘  2 [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes (30.2s)
  ✘  8 [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download (retry #1) (30.2s)
  ✘  9 [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes (retry #1) (30.2s)


  1) [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByText('Projeto Telecom Alpha', { exact: true })[22m
    [2m    - locator resolved to <p class="truncate text-sm font-medium">Projeto Telecom Alpha</p>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    52 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      92 |
      93 | async function selectMemorial(page: Page, projectName: string) {
    > 94 |   await page.getByText(projectName, { exact: true }).click();
         |                                                      ^
      95 | }
      96 |
      97 | test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
        at selectMemorial (/home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:94:54)
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:104:9

    Error Context: test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByText('Projeto Telecom Alpha', { exact: true })[22m
    [2m    - locator resolved to <p class="truncate text-sm font-medium">Projeto Telecom Alpha</p>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    55 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      92 |
      93 | async function selectMemorial(page: Page, projectName: string) {
    > 94 |   await page.getByText(projectName, { exact: true }).click();
         |                                                      ^
      95 | }
      96 |
      97 | test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
        at selectMemorial (/home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:94:54)
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:104:9

    Error Context: test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByText('Projeto Telecom Com Falha', { exact: true })[22m
    [2m    - locator resolved to <p class="truncate text-sm font-medium">Projeto Telecom Com Falha</p>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    52 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      92 |
      93 | async function selectMemorial(page: Page, projectName: string) {
    > 94 |   await page.getByText(projectName, { exact: true }).click();
         |                                                      ^
      95 | }
      96 |
      97 | test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
        at selectMemorial (/home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:94:54)
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:167:9

    Error Context: test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByText('Projeto Telecom Com Falha', { exact: true })[22m
    [2m    - locator resolved to <p class="truncate text-sm font-medium">Projeto Telecom Com Falha</p>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    55 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      92 |
      93 | async function selectMemorial(page: Page, projectName: string) {
    > 94 |   await page.getByText(projectName, { exact: true }).click();
         |                                                      ^
      95 | }
      96 |
      97 | test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
        at selectMemorial (/home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:94:54)
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:167:9

    Error Context: test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes 
    [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download 
  5 passed (1.0m)

$ npm run lint

$ npm run typecheck

$ npm run test

$ npm run build

$ npm run e2e


## Falha na story RDY-008, tentativa 3

STDOUT:

> dashboard_memorial@0.0.0 lint
> eslint .


> dashboard_memorial@0.0.0 typecheck
> tsc -b


> dashboard_memorial@0.0.0 test
> node --test apiContracts.test.ts

✔ normalizes network failures as API unavailable (0.71731ms)
✔ prefers safe backend 500 envelope without leaking raw details (0.230231ms)
✔ normalizes upload validation details into actionable messages (0.208547ms)
✔ maps backend generation statuses without treating failed or processing as ready (0.112966ms)
✔ normalizes unavailable download and missing artifact responses (0.124739ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 76.470305

> dashboard_memorial@0.0.0 build
> tsc -b && vite build

[36mvite v8.0.8 [32mbuilding client environment for production...[36m[39m
[2K
transforming...✓ 1789 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.87 kB │ gzip:   0.48 kB
dist/assets/index-BrH-xD2X.css   28.84 kB │ gzip:   6.31 kB
dist/assets/index-6vGreTYj.js   441.45 kB │ gzip: 135.10 kB

[32m✓ built in 251ms[39m

> dashboard_memorial@0.0.0 e2e
> playwright test


Running 7 tests using 6 workers

  ✓  2 [chromium] › e2e/contract-mocked.spec.ts:192:1 › network error shows understandable safe message without stack trace or internal path (1.8s)
  ✓  5 [chromium] › e2e/contract-mocked.spec.ts:121:1 › mobile 390 keeps generated memorials accessible without critical horizontal overflow (1.7s)
  ✓  4 [chromium] › e2e/contract-mocked.spec.ts:178:1 › recoverable upload error keeps selected file and hides technical details (2.1s)
  ✓  6 [chromium] › e2e/contract-mocked.spec.ts:137:1 › loading history is not presented as a real empty state (2.1s)
  ✓  7 [chromium] › e2e/real-backend.spec.ts:5:1 › real-backend smoke opens dashboard against the local API (786ms)
  ✘  1 [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes (31.4s)
  ✘  3 [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download (31.4s)
  ✘  8 [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes (retry #1) (31.4s)
  ✘  9 [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download (retry #1) (31.4s)


  1) [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' })[22m
    [2m    - locator resolved to <button type="button" aria-label="Selecionar Projeto Telecom Alpha" class="flex min-h-14 w-full min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg px-1 py-1 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4c4fbf] sm:basis-0 sm:items-center">…</button>[22m
    [2m  - attempting click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m  13 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      92 |
      93 | async function selectMemorial(page: Page, projectName: string) {
    > 94 |   await page.getByRole('button', { name: `Selecionar ${projectName}` }).click();
         |                                                                         ^
      95 | }
      96 |
      97 | test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
        at selectMemorial (/home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:94:73)
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:104:9

    Error Context: test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' })[22m
    [2m    - locator resolved to <button type="button" aria-label="Selecionar Projeto Telecom Alpha" class="flex min-h-14 w-full min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg px-1 py-1 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4c4fbf] sm:basis-0 sm:items-center">…</button>[22m
    [2m  - attempting click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m  14 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      92 |
      93 | async function selectMemorial(page: Page, projectName: string) {
    > 94 |   await page.getByRole('button', { name: `Selecionar ${projectName}` }).click();
         |                                                                         ^
      95 | }
      96 |
      97 | test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
        at selectMemorial (/home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:94:73)
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:104:9

    Error Context: test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-desktop-op-4c5d9-etail-downloads-and-deletes-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download 

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('button', { name: 'Selecionar Projeto Telecom Com Falha' })[22m
    [2m    - locator resolved to <button type="button" aria-label="Selecionar Projeto Telecom Com Falha" class="flex min-h-14 w-full min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg px-1 py-1 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4c4fbf] sm:basis-0 sm:items-center">…</button>[22m
    [2m  - attempting click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m  13 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      92 |
      93 | async function selectMemorial(page: Page, projectName: string) {
    > 94 |   await page.getByRole('button', { name: `Selecionar ${projectName}` }).click();
         |                                                                         ^
      95 | }
      96 |
      97 | test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
        at selectMemorial (/home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:94:73)
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:167:9

    Error Context: test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 30000ms exceeded.[39m

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
    [2m  - waiting for getByRole('button', { name: 'Selecionar Projeto Telecom Com Falha' })[22m
    [2m    - locator resolved to <button type="button" aria-label="Selecionar Projeto Telecom Com Falha" class="flex min-h-14 w-full min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg px-1 py-1 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4c4fbf] sm:basis-0 sm:items-center">…</button>[22m
    [2m  - attempting click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m  14 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex h-full flex-col overflow-hidden sm:flex-row">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <div class="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row xl:overflow-hidden">…</div> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      92 |
      93 | async function selectMemorial(page: Page, projectName: string) {
    > 94 |   await page.getByRole('button', { name: `Selecionar ${projectName}` }).click();
         |                                                                         ^
      95 | }
      96 |
      97 | test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
        at selectMemorial (/home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:94:73)
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:167:9

    Error Context: test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes 
    [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download 
  5 passed (1.1m)

$ npm run lint

$ npm run typecheck

$ npm run test

$ npm run build

$ npm run e2e


## RDY-008 tentativa 4: correção real de sobreposição no item do histórico

Foi identificada falha E2E em que o botão acessível "Selecionar Projeto Telecom Alpha" existe, está visível, habilitado e estável, mas tem o clique interceptado por containers do layout.

A próxima execução do Ralph deve tratar isso como bug real de layout, não como problema de teste.

Regras importantes:

- Não usar click({ force: true }).
- Não reduzir a cobertura E2E.
- Corrigir GeneratedList.tsx e/ou Dashboard.tsx.
- Garantir que a área clicável de seleção ocupe largura real.
- Manter Baixar e Excluir como ações separadas.
- Validar desktop e mobile.

## RDY-008 tentativa 4: ajuste responsivo do histórico

Correção aplicada:

- A causa raiz da interceptação do clique era a largura útil insuficiente no layout desktop padrão do Playwright.
- Em `xl`, a área principal já virava duas colunas, mas o painel de detalhe usava `52rem`; somado à sidebar, padding e gap, a lista de histórico ficava menor que a largura mínima necessária para categorias + conteúdo.
- Com a lista comprimida, o botão acessível `Selecionar Projeto Telecom Alpha` permanecia na árvore e visível, mas seu ponto de clique podia cair sob containers vizinhos do layout.
- `src/pages/Dashboard.tsx` passou a reservar `xl:min-w-[24rem]` para a lista e limitar o detalhe a `36rem` em `xl`, voltando a `52rem` somente em `2xl`.
- `src/components/GeneratedList.tsx` passou a declarar `w-full` no container raiz, deixando a largura do card explícita no flex layout.
- Os testes E2E continuam usando `getByRole('button', { name: 'Selecionar ...' }).click()` sem `force: true`.

Validação executada nesta tentativa:

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou.
- `npm run build`: passou.
- `npm run e2e -- --grep "desktop opens generated memorials|failed and processing"`: não executou os testes porque o `webServer` do Playwright não conseguiu iniciar.
- `python verify.py`: não executou porque o binário `python` não existe neste ambiente.
- `python3 verify.py`: rodou lint, typecheck, test e build com sucesso, mas falhou no passo `e2e` porque o `webServer` do Playwright não conseguiu iniciar.

Bloqueio de ambiente:

- O comando direto `VITE_API_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5173` falhou com `listen EPERM: operation not permitted 127.0.0.1:5173`.
- Portanto, a confirmação E2E precisa ser rodada em um ambiente local que permita bind de porta para o Vite.


## Falha na story RDY-008, tentativa 1

STDOUT:

> dashboard_memorial@0.0.0 lint
> eslint .


> dashboard_memorial@0.0.0 typecheck
> tsc -b


> dashboard_memorial@0.0.0 test
> node --test apiContracts.test.ts

✔ normalizes network failures as API unavailable (0.647373ms)
✔ prefers safe backend 500 envelope without leaking raw details (0.230851ms)
✔ normalizes upload validation details into actionable messages (0.201848ms)
✔ maps backend generation statuses without treating failed or processing as ready (0.112368ms)
✔ normalizes unavailable download and missing artifact responses (0.124668ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 79.884534

> dashboard_memorial@0.0.0 build
> tsc -b && vite build

[36mvite v8.0.8 [32mbuilding client environment for production...[36m[39m
[2K
transforming...✓ 1789 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.87 kB │ gzip:   0.48 kB
dist/assets/index-B7NRlZjl.css   29.03 kB │ gzip:   6.36 kB
dist/assets/index-DFCWuL_0.js   441.51 kB │ gzip: 135.13 kB

[32m✓ built in 227ms[39m

> dashboard_memorial@0.0.0 e2e
> playwright test


Running 7 tests using 6 workers

  ✓  4 [chromium] › e2e/contract-mocked.spec.ts:121:1 › mobile 390 keeps generated memorials accessible without critical horizontal overflow (2.2s)
  ✓  1 [chromium] › e2e/contract-mocked.spec.ts:137:1 › loading history is not presented as a real empty state (2.4s)
  ✓  5 [chromium] › e2e/contract-mocked.spec.ts:192:1 › network error shows understandable safe message without stack trace or internal path (2.6s)
  ✓  3 [chromium] › e2e/contract-mocked.spec.ts:178:1 › recoverable upload error keeps selected file and hides technical details (3.1s)
  ✓  7 [chromium] › e2e/real-backend.spec.ts:5:1 › real-backend smoke opens dashboard against the local API (1.2s)
  ✓  6 [chromium] › e2e/contract-mocked.spec.ts:97:1 › desktop opens generated memorials, selects detail, downloads and deletes (3.1s)
  ✘  2 [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download (3.4s)
  ✘  8 [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download (retry #1) (936ms)


  1) [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

    Locator: getByText('Em geração')
    Expected: visible
    Error: strict mode violation: getByText('Em geração') resolved to 2 elements:
        1) <p class="font-medium">Em geração</p> aka getByText('Em geração', { exact: true })
        2) <p class="text-sm leading-relaxed">Ainda em geração.</p> aka getByText('Ainda em geração.')

    Call log:
    [2m  - Expect "toBeVisible" with timeout 5000ms[22m
    [2m  - waiting for getByText('Em geração')[22m


      172 |   await selectMemorial(page, 'Projeto Telecom Em Processamento');
      173 |   await expect(page.getByRole('heading', { name: 'Projeto Telecom Em Processamento' })).toBeVisible();
    > 174 |   await expect(page.getByText('Em geração')).toBeVisible();
          |                                              ^
      175 |   await expect(page.getByRole('button', { name: 'Baixar Projeto Telecom Em Processamento' })).toBeDisabled();
      176 | });
      177 |
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:174:46

    Error Context: test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

    Locator: getByText('Em geração')
    Expected: visible
    Error: strict mode violation: getByText('Em geração') resolved to 2 elements:
        1) <p class="font-medium">Em geração</p> aka getByText('Em geração', { exact: true })
        2) <p class="text-sm leading-relaxed">Ainda em geração.</p> aka getByText('Ainda em geração.')

    Call log:
    [2m  - Expect "toBeVisible" with timeout 5000ms[22m
    [2m  - waiting for getByText('Em geração')[22m


      172 |   await selectMemorial(page, 'Projeto Telecom Em Processamento');
      173 |   await expect(page.getByRole('heading', { name: 'Projeto Telecom Em Processamento' })).toBeVisible();
    > 174 |   await expect(page.getByText('Em geração')).toBeVisible();
          |                                              ^
      175 |   await expect(page.getByRole('button', { name: 'Baixar Projeto Telecom Em Processamento' })).toBeDisabled();
      176 | });
      177 |
        at /home/juca/Projects/dashboard_memorial/e2e/contract-mocked.spec.ts:174:46

    Error Context: test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/contract-mocked-failed-and-128cd--block-unavailable-download-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  1 failed
    [chromium] › e2e/contract-mocked.spec.ts:162:1 › failed and processing generations show safe state and block unavailable download 
  6 passed (6.6s)

$ npm run lint

$ npm run typecheck

$ npm run test

$ npm run build

$ npm run e2e

## RDY-008 tentativa 5: seletor exato para estado em processamento

Correção aplicada sobre a falha da tentativa anterior:

- A falha restante do E2E não era regressão visual nem contrato quebrado; era ambiguidade do seletor `getByText('Em geração')`.
- O texto de status `Em geração` também casava como substring da observação mockada `Ainda em geração.`, causando violação de strict mode no Playwright.
- O teste passou a usar `getByText('Em geração', { exact: true })`, preservando a cobertura do estado processing e mantendo seletores acessíveis/estáveis sem `force: true`.

Validação executada nesta tentativa:

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou.
- `npm run build`: passou.
- `npm run e2e -- --grep "failed and processing"`: não executou os testes porque o `webServer` do Playwright não conseguiu iniciar.
- `python verify.py`: não executou porque o binário `python` não existe neste ambiente.
- `python3 verify.py`: rodou lint, typecheck, test e build com sucesso, mas falhou no passo `e2e` porque o `webServer` do Playwright não conseguiu iniciar.

Bloqueio de ambiente confirmado:

- `VITE_API_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5173` falhou com `listen EPERM: operation not permitted 127.0.0.1:5173`.
- A correção do seletor precisa ser validada em ambiente local que permita bind de porta para o Vite.


## Story RDY-008 concluída

Tentativa bem-sucedida: 2
