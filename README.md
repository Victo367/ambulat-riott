# Ambulat-RIOTT

Sistema web para cadastro e gestão de pacientes de ambulatório, construído com Next.js (App Router), React, TypeScript, Tailwind CSS e MongoDB.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- MongoDB (via Mongoose)

## Funcionalidades atuais

- Cadastro de paciente
- Edição de paciente
- Exclusão de paciente com confirmação
- Listagem de pacientes
- Máscara de CPF e telefone no formulário/listagem
- Navbar lateral na área de pacientes

## Requisitos

- Node.js (recomendado: LTS atual)
- npm
- Instância MongoDB acessível (local ou Atlas)

## Configuração de ambiente

Crie o arquivo `.env.local` na raiz do projeto com:

```env
MONGODB_URI=mongodb://localhost:27017/ambulatoriott
```

Também é aceito o nome `MONGO_URL` (mesmo valor).

Pelo menos uma das variáveis `MONGODB_URI` ou `MONGO_URL` deve estar definida.

## Banco de dados

A coleção `pacientes` é criada automaticamente na primeira gravação.

Campos utilizados:

- `nome` (string)
- `identidade_genero` (string ou null)
- `pronome` (string ou null)
- `cpf` (string, único quando preenchido)
- `data_nascimento` (string no formato `YYYY-MM-DD` ou null)
- `telefone` (string ou null)
- `senha` (string ou null)
- `created_at` / `updated_at` (timestamps geridos pelo Mongoose)

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Configure o `.env.local` (seção acima).

3. Inicie em desenvolvimento:

```bash
npm run dev
```

4. Acesse:

- [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - sobe o servidor de desenvolvimento
- `npm run build` - gera build de produção
- `npm run start` - roda a build em produção
- `npm run lint` - valida lint do projeto

## Estrutura principal

- `src/app/` - rotas da aplicação (App Router)
- `src/app/pacientes/` - páginas de pacientes
- `src/components/` - componentes de UI
- `src/lib/` - conexão com banco e funções de domínio

## Troubleshooting rápido

- Erro de conexão MongoDB: revise `.env.local`, URI, rede e se o serviço está escutando na porta correta.
- Mudança não refletiu no navegador: reinicie `npm run dev`.
