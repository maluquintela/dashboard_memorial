# Browser review notes

Ambiente de teste:
- Playwright MCP falhou porque procurou Chrome em /opt/google/chrome/chrome.
- Foi usado Playwright diretamente contra a aplicação local.
- API local em 127.0.0.1:8000.

## Problemas restantes

### Alta

1. No histórico em desktop, o item da geração não fica efetivamente clicável na largura do painel dividido.
O detalhe permanece em "Nenhum memorial selecionado"; só "Baixar" e "Excluir" ficam acessíveis.
Local provável:
- src/components/GeneratedList.tsx:173
- src/pages/Dashboard.tsx:246
Sugestão:
- Tornar a linha inteira clicável.
- Ou reservar largura mínima para o botão de seleção.
- Em painel estreito, mover ações para segunda linha.

2. Em mobile 390px, a navegação principal horizontal esconde "Gas GLP" e "Memoriais gerados" fora da viewport, sem indicação clara de scroll.
O próximo passo para acessar histórico fica pouco descobrível.
Local provável:
- src/components/Sidebar.tsx:50
Sugestão:
- Usar menu compacto.
- Ou tabs quebráveis.
- Ou priorizar "Memoriais gerados" como ação visível.

### Média

3. Durante loading inicial, os cards de estatística mostram 0 e textos como "Clique para ver detalhes", antes do histórico carregar.
Isso pode parecer estado real vazio.
Local provável:
- src/pages/Dashboard.tsx:182
Sugestão:
- Mostrar skeleton/loading nos stats.
- Ou ocultar números até isLoadingHistory=false.

4. Erro de geração aparece só como banner.
Os arquivos enviados somem porque UploadPanel limpa o estado mesmo quando onGenerate trata erro internamente.
O usuário precisa selecionar os PDFs de novo.
Local provável:
- src/components/UploadPanel.tsx:32
Sugestão:
- Limpar arquivos apenas em sucesso.
- Em erro, manter arquivos e mostrar CTA "Tentar novamente".

5. Estado vazio por categoria é claro, mas não tem ação direta.
Local provável:
- src/components/GeneratedList.tsx:156
Sugestão:
- Adicionar botão "Gerar Memorial de [categoria]" que leve para o gerador correto.

### Baixa

6. Dropzone é um div clicável sem semântica de botão/teclado.
Remover arquivo usa só title, sem aria-label.
Local provável:
- src/components/UploadPanel.tsx:50
- src/components/UploadPanel.tsx:118
Sugestão:
- Usar button/label acessível para upload.
- Usar aria-label no botão de remover.

## Pontos bons

- Histórico carrega com categorias e contadores quando a API responde.
- Estado vazio da lista existe e explica o motivo.
- Estado de erro do histórico tem botão "Tentar de novo".
- O detalhe tem seção "Próximo passo" clara quando uma geração está selecionada.

## Resultado após UX-002

Quase todos os pontos passaram.

### Único ponto restante

No desktop, o clique manual no texto do item funciona, mas a caixa do item com role="button" está colapsada em largura e fica sobreposta ou adjacente aos botões internos.

Evidência:
- primeiro li[role=button] mediu aproximadamente x=449, y=225, width=110, height=79;
- texto interno tinha largura 0;
- clique semântico pelo centro do elemento acessível cai nos controles Baixar/Excluir, não no corpo do item.

Correção esperada:
- o li não deve ser o botão semântico principal se ele contém botões internos;
- transformar o corpo/texto do memorial em um button nativo próprio;
- manter Baixar e Excluir como botões irmãos separados;
- garantir que a área de seleção ocupe a largura real disponível da linha;
- garantir que ações internas não disparem seleção acidental.
