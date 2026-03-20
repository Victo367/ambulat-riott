# ambulat-riott

Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Pré-requisitos

- Node.js compatível com o Next.js 16 (recomendado usar Node LTS)
- Acesso a um banco MySQL com o banco `ambulatoriott` (pode ser local ou em nuvem)
- Um arquivo de variáveis de ambiente em `./.env.local`

## 1) Instalar dependências

```bash
npm install
```

## 2) Configurar o MySQL

1. Crie o um arquivo:
    `.env.local`
2. Preencha:
   - `MYSQL_HOST`
   - `MYSQL_PORT` (padrão: `3306`)
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE` (padrão do código: `ambulatoriott`)
   - `MYSQL_CONNECTION_LIMIT` (padrão: `10`)

Observações importantes:
- Se o MySQL estiver em nuvem, `MYSQL_HOST` não deve ser `localhost` — precisa ser o endpoint público/privado fornecido pelo provedor.
- Se o provedor fizer `allowlist` de IPs, libere o IP de onde você vai rodar o projeto.
- O projeto usa um *pool* de conexões (`mysql2`).
- Se seu MySQL exigir SSL/TLS e você não conseguir conectar, avise que eu ajusto `src/lib/db.ts` para suportar SSL.

## 3) Rodar em desenvolvimento

```bash
npm run dev
```

Abra:
- `http://localhost:3000`

## Scripts disponíveis

- `npm run dev` - inicia o servidor de desenvolvimento
- `npm run build` - gera build de produção
- `npm run start` - inicia o servidor em modo produção
- `npm run lint` - executa verificação de lint
