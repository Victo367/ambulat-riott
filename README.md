# Ambulat-RIOTT

Sistema web para cadastro e gestão de pacientes de ambulatório, construído com Next.js (App Router), React, TypeScript, Tailwind CSS e MySQL.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- MySQL 

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
- MySQL 8+ (ou compatível)

## Configuração de ambiente

Crie o arquivo `.env.local` na raiz do projeto com:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD="sua senha"
MYSQL_DATABASE="seu banco"
MYSQL_CONNECTION_LIMIT="Opcional"
```

Variáveis obrigatórias:

- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`

Variáveis com padrão:

- `MYSQL_DATABASE` (padrão: `ambulatoriott`)
- `MYSQL_PORT` (padrão: `3306`)
- `MYSQL_CONNECTION_LIMIT` (padrão: `10`)

## Banco de dados

O projeto espera a tabela `pacientes` no banco.

Colunas utilizadas atualmente:

- `id` (INT, PK, auto increment)
- `nome` (VARCHAR, obrigatório)
- `identidade_genero` (VARCHAR, opcional)
- `pronome` (VARCHAR, obrigatório no cadastro)
- `cpf` (VARCHAR, obrigatório no cadastro, único)
- `data_nascimento` (DATE, obrigatório no cadastro)
- `telefone` (VARCHAR, obrigatório no cadastro)
- `created_at`
- `updated_at`

Observação importante:

- O código possui ajustes automáticos para compatibilidade de schema em bases antigas.

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

- Erro de conexão MySQL: revise `.env.local` e credenciais.
- Erro de permissão SQL (`ALTER`): ajuste permissões do usuário MySQL.
- Mudança não refletiu no navegador: reinicie `npm run dev`.
