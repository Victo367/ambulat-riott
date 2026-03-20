# ambulat-riott

Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Pré-requisitos

- Node.js (versão compatível com o Next.js 16)
- Um banco MySQL com o banco `ambulatoriott`

## Rodar o projeto em desenvolvimento

Execute:

```bash
npm run dev
```

Abra no navegador:
- `http://localhost:3000`

## Testar conexão com o banco

Há uma rota de teste para validar a conexão com o MySQL:
- `GET /api/testdb`

Ela executa um `SELECT 1` e retorna `ok: true` se a conexão estiver funcionando.

## Scripts disponíveis

- `npm run dev` - inicia o servidor de desenvolvimento
- `npm run build` - gera build de produção
- `npm run start` - inicia o servidor em modo produção
- `npm run lint` - executa verificação de lint
