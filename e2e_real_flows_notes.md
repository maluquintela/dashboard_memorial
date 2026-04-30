# E2E real flows notes

## Contexto

Esta iteração valida o sistema como usuário, rodando o dashboard em navegador real com Playwright.

O backend fica em:

- ~/Projects/api_memorial_descritivo
- http://127.0.0.1:8000

O frontend fica em:

- ~/Projects/dashboard-memorial

## Objetivo

Criar uma suíte E2E mínima, estável e útil para validar os fluxos principais antes de staging/produção.

## Escopo principal

A suíte deve cobrir:

1. Carregamento inicial do dashboard.
2. Estados de loading.
3. Navegação desktop.
4. Navegação mobile 390px.
5. Upload de arquivos.
6. Geração com sucesso ou simulação controlada quando geração real depender de credencial externa.
7. Geração com falha.
8. Histórico de memoriais gerados.
9. Seleção de item no histórico.
10. Download.
11. Exclusão.
12. Erro de API fora do ar ou resposta de erro segura.
13. Ausência de stack trace, paths internos e mensagens técnicas brutas na UI.

## Princípio

Testes E2E devem ser no navegador, não apenas unitários.

Quando o fluxo real depender de IA, credenciais externas ou geração longa demais, é aceitável usar interceptação controlada no Playwright para simular respostas do backend, desde que:

- o teste continue navegando pela UI real;
- os contratos simulados sejam baseados no backend real;
- o teste deixe claro quando é real-backend e quando é contract-mocked;
- não use secrets reais;
- não dependa do Railway.

## Tipos de teste esperados

### 1. Smoke real local

Teste que abre o dashboard apontando para a API local e verifica se a aplicação carrega sem quebrar.

### 2. Contract-driven browser tests

Testes em navegador com interceptação de API para cobrir estados difíceis de reproduzir localmente:

- geração failed;
- geração processing;
- arquivo ausente no storage;
- erro de upload;
- API indisponível;
- download indisponível.

### 3. Responsividade

Testes desktop e mobile, especialmente viewport 390px.

## Fora do escopo

- Não alterar backend.
- Não alterar templates DOCX.
- Não implementar autenticação.
- Não implementar testes no Railway.
- Não usar credenciais reais.
- Não criar suíte enorme e frágil.
- Não tentar resolver todos os problemas de UX nesta iteração.
- Não depender do Playwright MCP.
