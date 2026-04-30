# Smoke Test Plan

## Local

1. Instalar dependencias do dashboard.

```bash
npm install
```

2. Iniciar API local em outro terminal.

```bash
cd ~/Projects/api_memorial_descritivo
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

3. Confirmar health da API.

```bash
curl -f http://127.0.0.1:8000/health/live
curl -f http://127.0.0.1:8000/health/ready
```

4. Rodar verificacao do dashboard.

```bash
python verify.py
```

Se `python` nao existir no ambiente, usar:

```bash
python3 verify.py
```

5. Smoke manual no dashboard local.

- Abrir `http://127.0.0.1:5173`.
- Confirmar tela inicial do dashboard.
- Abrir `Memoriais gerados`.
- Confirmar que loading, vazio ou historico aparecem sem erro tecnico.
- Enviar um PDF ou DOCX valido para um memorial suportado.
- Confirmar retorno seguro em sucesso, processamento ou falha.
- Abrir detalhe do memorial.
- Se status for `ready`, testar download.
- Testar exclusao de um memorial criado para teste.
- Repetir fluxo em viewport mobile aproximada de `390px`.

## Staging

1. Confirmar URLs e variaveis.

- Dashboard staging construido com `VITE_API_URL=https://<api-staging-domain>`.
- API staging com `APP_ENV=production`.
- API staging com `CORS_ALLOWED_ORIGINS=https://<dashboard-staging-domain>`.

2. Confirmar health.

```bash
curl -f https://<api-staging-domain>/health/live
curl -f https://<api-staging-domain>/health/ready
```

3. Smoke funcional.

- Abrir `https://<dashboard-staging-domain>`.
- Confirmar que o historico carrega sem erro de CORS.
- Gerar memorial com arquivos de teste sem dados sensiveis.
- Confirmar que o memorial aparece no historico.
- Abrir detalhe.
- Baixar DOCX quando `ready`.
- Excluir memorial de teste.
- Confirmar que item sumiu do historico.

4. Logs e seguranca.

- Confirmar que logs da API possuem `X-Request-ID`/request id util.
- Confirmar que erro 500 nao expoe stack trace ao usuario.
- Confirmar que respostas e bundle frontend nao contem secrets reais.

## Nao Validado Nesta Revisao

- Smoke de staging real nao foi executado.
- Railway real nao foi alterado.
- Supabase real nao foi inspecionado.
- E2E local nao completou neste ambiente porque o Vite nao conseguiu fazer bind em `127.0.0.1:5173` (`listen EPERM`).
