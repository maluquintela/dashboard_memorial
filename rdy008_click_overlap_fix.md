# RDY-008 tentativa 4: correção real de sobreposição no item do histórico

## Contexto

A suíte E2E da RDY-008 falhou no teste desktop de histórico, detalhe, download e exclusão.

O botão acessível "Selecionar Projeto Telecom Alpha" existe, está visível, habilitado e estável, mas o Playwright não consegue clicar nele porque outros containers do layout interceptam o clique.

## Erro observado

O teste falha ao clicar em:

getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' })

O Playwright informa que o elemento está visible/enabled/stable, mas o clique é interceptado por containers como:

- div.flex.h-full.flex-col.overflow-hidden.sm:flex-row
- div.flex.shrink-0.gap-1.overflow-x-auto.border-b.p-3.sm:w-48.sm:flex-col
- div.flex.min-h-0.flex-1.flex-col.gap-4.xl:flex-row.xl:overflow-hidden

## Interpretação

Isso não deve ser corrigido com click({ force: true }).

O problema parece ser de layout, empilhamento ou área sobreposta no painel de "Memoriais gerados", provavelmente em:

- src/components/GeneratedList.tsx
- src/pages/Dashboard.tsx

O teste está revelando um bug real de usabilidade: visualmente o item parece clicável, mas a área real de clique está coberta ou colapsada.

## Objetivo

Corrigir a estrutura visual e semântica da lista de memoriais para que:

1. O botão "Selecionar ..." ocupe uma área clicável real e não sobreposta.
2. O centro geométrico do botão clicável não fique coberto por containers pai, sidebar, painel lateral ou área de ações.
3. Os botões "Baixar" e "Excluir" continuem funcionando separadamente.
4. A linha inteira, exceto as ações, seja clicável para selecionar o memorial.
5. O layout continue responsivo em desktop e mobile.
6. Os testes E2E continuem usando seletor acessível por role/name.
7. Nenhum teste use force: true para esconder o problema.

## Tarefas

1. Inspecionar src/components/GeneratedList.tsx.
2. Inspecionar src/pages/Dashboard.tsx.
3. Identificar por que containers do layout estão interceptando o clique do botão de seleção.
4. Reestruturar o item da lista se necessário.
5. Preferir uma estrutura em que:
   - li seja apenas container visual;
   - o botão de seleção tenha flex-1, min-w-0 e w-full quando aplicável;
   - ações fiquem em container separado com shrink-0;
   - a área de ações não fique por cima da área de seleção;
   - containers laterais não sobreponham o conteúdo da lista.
6. Ajustar o layout do painel em Dashboard.tsx se houver sobreposição entre sidebar, categorias, lista e detalhe.
7. Não usar pointer-events-none como gambiarra global.
8. Não usar click({ force: true }) nos testes.
9. Não reduzir cobertura dos testes.
10. Atualizar learnings.md em modo append-only.

## Validação obrigatória

Rodar:

- npm run lint
- npm run typecheck
- npm run test
- npm run build
- npm run e2e
- python verify.py

## Critérios de aceite específicos

1. getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' }).click() funciona sem force.
2. Após o clique, o detalhe do memorial aparece.
3. O botão Baixar continua funcionando.
4. O botão Excluir continua funcionando.
5. Desktop continua funcionando.
6. Mobile 390px continua funcionando.
7. Nenhum teste E2E usa force: true para esse clique.
8. learnings.md registra causa raiz, arquivos alterados, comandos executados e resultado dos testes.
