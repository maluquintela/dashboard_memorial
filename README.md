# Dashboard Memorial

Interface web para geração de memoriais de infraestrutura (Telecomunicações, Elétrico, Gas Natural, Gas GLP).

## Requisitos

- Node.js 18+
- npm 9+

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo de exemplo e ajuste a URL do seu backend:

```bash
cp .env.example .env
```

Edite o `.env`:

```
VITE_API_URL=http://localhost:8000
```

## Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:5173

## Build para produção

```bash
npm run build
```

## Endpoints esperados do backend

| Método | Rota                       | Descrição                          |
|--------|----------------------------|------------------------------------|
| POST   | `/memorial/generate`       | Gera um novo memorial              |
| POST   | `/memorial/:id/correct`    | Corrige um memorial existente      |
| GET    | `/memorial`                | Lista todos os memoriais           |
| GET    | `/memorial/:id`            | Retorna detalhes de um memorial    |

### POST `/memorial/generate` — `multipart/form-data`

| Campo          | Tipo     | Descrição                            |
|----------------|----------|--------------------------------------|
| `type`         | string   | `telecomunicacoes`, `eletrico`, etc. |
| `observations` | string   | Observações adicionais               |
| `files`        | File[]   | PDFs das plantas                     |

### POST `/memorial/:id/correct` — `application/json`

```json
{ "feedback": "Faltou incluir o quadro de distribuição." }
```

### Resposta padrão de memorial

```json
{
  "memorial": {
    "id": "uuid",
    "type": "telecomunicacoes",
    "projectName": "Projeto X",
    "createdAt": "2026-04-14T00:00:00Z",
    "docxUrl": "https://...",
    "observations": "...",
    "pdfFilenames": ["planta.pdf"],
    "status": "ready"
  }
}
```
