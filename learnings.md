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
