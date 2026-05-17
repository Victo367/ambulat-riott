# Ambulatório TT — Portal de Saúde (Ambulat-RIOTT)

Sistema web para o **Ambulatório TT Marcela Prado** (Campina Grande — PB): portal institucional, área do **paciente** (agenda, histórico, perfil) e área do **funcionário** (gestão de pacientes, funcionários, agenda clínica e conteúdo do site).

Construído com **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS 4**, **MongoDB** e **Mongoose**, com autenticação por **JWT** em cookie HTTP-only.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Perfis de acesso e rotas](#perfis-de-acesso-e-rotas)
- [Requisitos](#requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Scripts disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [API REST (resumo)](#api-rest-resumo)
- [Banco de dados](#banco-de-dados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Telas de erro](#telas-de-erro)
- [Boas práticas de desenvolvimento](#boas-práticas-de-desenvolvimento)
- [Solução de problemas](#solução-de-problemas)

---

## Tecnologias

| Camada        | Tecnologia                                      |
|---------------|-------------------------------------------------|
| Framework     | Next.js 16.2 (App Router, Turbopack no dev)     |
| UI            | React 19, Tailwind CSS 4, Heroicons             |
| Linguagem     | TypeScript 5                                    |
| Banco         | MongoDB 7 + Mongoose 9                          |
| Autenticação  | JWT (`jsonwebtoken`) + cookie `token`           |
| Senhas        | `bcryptjs` (hash no `pre("save")` do User)      |
| Testes unit.  | Jest + Testing Library                          |
| Testes E2E    | Cypress 15                                      |

---

## Funcionalidades

### Portal público (sem login)

- **Home** (`/`) — apresentação do ambulatório, artigos dinâmicos via API interna e atalhos (agendar, especialidades).
- **Especialidades** (`/especialidades`) — informações sobre as especialidades oferecidas.
- **Guias** (`/guias/[slug]`) — leitura de conteúdo editorial por slug (matérias cadastradas no banco).
- **Login** (`/login`) — autenticação com e-mail e senha.

### Área do paciente (`/paciente/*`)

Protegida por middleware (cookie `token` obrigatório).

- **Agenda** — listagem de consultas, próxima consulta em destaque, cancelamento.
- **Novo agendamento** — escolha de especialidade, profissional (API filtrada) e horário.
- **Remarcar** — alteração de data/hora de agendamentos elegíveis (`?id=` na URL).
- **Histórico** — consultas passadas e status.
- **Perfil** — dados pessoais e terapia hormonal (quando aplicável).

### Área do funcionário (`/funcionario/*`)

Protegida pelo mesmo middleware.

- **Agenda** — visão diária ou completa, filtros, status das consultas.
- **Novo / editar / detalhes** de agendamento — inclusão de TH no detalhe quando relevante.
- **Pacientes** — listar, criar, visualizar, editar e excluir (com confirmação).
- **Funcionários** — CRUD de equipe (cargo, admissão, especialidades).
- **Conteúdo do site** — CRUD de cards/artigos exibidos na home e guias.
- **Perfil** — dados do funcionário logado.

### Conteúdo e API interna

O conteúdo da home **não depende mais de API externa** (`localhost:3333`). Tudo passa por rotas internas:

- `GET/POST /api/conteudo`
- `GET/PATCH/DELETE /api/conteudo/[id]`
- `GET /api/conteudo/slug/[slug]`

### Outros recursos implementados

- Sidebar fixa com navegação por perfil (`paciente` vs `funcionario`).
- Persistência de formulários em `sessionStorage` (`usePersistedState`) em telas de edição.
- Utilitários de agenda separados: `agendamentos-utils.ts` (cliente) e `agendamentos.ts` (servidor/Mongoose).
- **Telas de erro personalizadas** (404, falhas de rede, banco, sessão, etc.) — ver [Telas de erro](#telas-de-erro).
- Atributos `data-cy` em fluxos críticos para testes Cypress.

---

## Perfis de acesso e rotas

O JWT armazena `{ id, tipo }` onde `tipo` é `paciente` ou `funcionario` (discriminator Mongoose `tipo_usuario`).

| Rota              | Autenticação | Quem acessa        |
|-------------------|--------------|--------------------|
| `/`, `/login`     | Pública      | Todos              |
| `/especialidades`, `/guias/*` | Pública* | Todos   |
| `/paciente/*`     | Cookie JWT   | Usuários logados   |
| `/funcionario/*`  | Cookie JWT   | Usuários logados   |

\* Rotas públicas fora do `matcher` do middleware; apenas `/paciente` e `/funcionario` exigem token.

O **middleware** (`src/middleware.ts`) redireciona para `/login` quando não há cookie `token` nas rotas protegidas.

> **Importante:** o middleware valida apenas a **presença** do token, não o perfil. Evite que um paciente acesse manualmente URLs de funcionário (e vice-versa); as APIs validam o usuário logado onde necessário.

---

## Requisitos

- **Node.js** 20+ (LTS recomendado)
- **npm** 9+
- **MongoDB** acessível (local, Docker ou [MongoDB Atlas](https://www.mongodb.com/atlas))
- Para testes E2E: navegador suportado pelo Cypress e app rodando em `http://localhost:3000`

---

## Configuração do ambiente

Crie um arquivo **`.env.local`** na raiz do projeto (não commite este arquivo):

```env
# Obrigatório — conexão com o MongoDB
MONGODB_URI=mongodb://localhost:27017/ambulatoriott

# Alternativa aceita pelo código (mesmo valor que MONGODB_URI)
# MONGO_URL=mongodb://localhost:27017/ambulatoriott

# Recomendado em produção — segredo para assinar o JWT
JWT_SECRET=altere_para_um_segredo_longo_e_aleatorio
```

| Variável       | Obrigatória | Descrição |
|----------------|-------------|-----------|
| `MONGODB_URI`  | Sim*        | URI de conexão MongoDB |
| `MONGO_URL`    | Sim*        | Alias de `MONGODB_URI` |
| `JWT_SECRET`   | Não         | Segredo JWT; padrão inseguro só para dev local |

\* Pelo menos uma entre `MONGODB_URI` e `MONGO_URL` deve estar definida. Sem isso, a aplicação lança erro ao conectar.

O Next.js carrega automaticamente `.env`, `.env.local`, `.env.development` e `.env.production` conforme o modo.

---

## Como rodar o projeto

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd ambulat-riott-1
npm install
```

### 2. Configurar variáveis de ambiente

Crie o `.env.local` conforme a [seção acima](#configuração-do-ambiente).

Certifique-se de que o MongoDB está em execução e que a URI aponta para o banco correto.

### 3. Modo desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

O servidor usa **Turbopack** por padrão no Next.js 16. A primeira carga após limpar `.next` pode ser mais lenta.

### 4. Build e produção

```bash
npm run build
npm run start
```

O build executa compilação + checagem TypeScript. Em produção, defina `JWT_SECRET` forte e use `NODE_ENV=production` (cookie `secure` no login).

### 5. Primeiro acesso

1. Garanta que existe pelo menos um usuário no banco (paciente ou funcionário), ou cadastre via fluxo de funcionário se já houver um admin.
2. Acesse `/login` com e-mail e senha cadastrados.
3. Após o login, o cookie `token` é definido e as rotas `/paciente/*` ou `/funcionario/*` ficam disponíveis conforme o `tipo` do usuário.

---

## Scripts disponíveis

| Comando              | Descrição |
|----------------------|-----------|
| `npm run dev`        | Servidor de desenvolvimento (porta 3000) |
| `npm run build`      | Build de produção + typecheck |
| `npm run start`      | Serve a build gerada por `build` |
| `npm run lint`       | ESLint (config `eslint-config-next`) |
| `npm test`           | Testes unitários com Jest |
| `npm run cypress:open` | Interface interativa do Cypress (E2E) |

---

## Testes

### Testes unitários (Jest)

Configuração em `jest.config.mjs` (integração com `next/jest`) e setup em `jest.setup.js`.

```bash
npm test
```

Arquivos atuais:

| Arquivo | O que cobre |
|---------|-------------|
| `tests/back/auth.test.ts` | Geração e validação de JWT |
| `tests/back/getUserFromRequest.test.ts` | Leitura do usuário a partir do request |
| `tests/front/auth.test.ts` | `getUserFromToken` (decode JWT no cliente) |

> **Nota:** alguns testes podem falhar se as expectativas estiverem desatualizadas em relação ao código (por exemplo, tipo retornado no token ou funções assíncronas). Corrija os `expect(...)` ou marque testes obsoletos antes de confiar no CI.

Para modo watch (se adicionar script):

```bash
npx jest --watch
```

### Testes end-to-end (Cypress)

O Cypress está configurado em `cypress.config.ts` com `baseUrl: http://localhost:3000`.

**Pré-requisitos:**

1. MongoDB rodando e `.env.local` configurado.
2. Aplicação em execução: `npm run dev` (em outro terminal).
3. Usuário de teste existente (o spec usa credenciais como `alicedias@gamil.com` / `admin` — ajuste conforme seu banco ou seeds).

**Executar:**

```bash
# Terminal 1
npm run dev

# Terminal 2 — interface gráfica
npm run cypress:open
```

Fluxo coberto em `cypress/e2e/ambulatorio.cy.ts` (resumo):

- Login
- Criar e excluir paciente
- Criar funcionário
- Navegação pela sidebar (`data-cy`)

Para rodar em modo headless (adicione ao `package.json` se quiser):

```bash
npx cypress run
```

---

## API REST (resumo)

Todas as rotas em `src/app/api/`. Respostas de erro costumam seguir `{ "error": "mensagem" }`.

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/login` | Login → cookie `token` |
| POST | `/api/logout` | Remove cookie |
| GET | `/api/me` | Dados do usuário logado |

### Cadastro

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/register` | Registro genérico |
| POST | `/api/register/paciente` | Novo paciente |
| POST | `/api/register/funcionario` | Novo funcionário |

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users` | Listagem |
| GET/PATCH/DELETE | `/api/users/[id]` | Detalhe, atualização, exclusão |
| GET | `/api/users/pacientes` | Lista pacientes |
| GET | `/api/users/funcionarios` | Lista funcionários |

### Agendamentos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/agendamentos` | Lista (`?todos=1` para histórico completo; `?data=YYYY-MM-DD` para um dia) |
| POST | `/api/agendamentos` | Criar |
| GET/PATCH/DELETE | `/api/agendamentos/[id]` | Detalhe, remarcar/cancelar/atualizar, excluir |

### Profissionais e conteúdo

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/profissionais` | Profissionais ativos (`?especialidade=` opcional) |
| GET/POST | `/api/conteudo` | Listar / criar artigos |
| GET/PATCH/DELETE | `/api/conteudo/[id]` | Por ID |
| GET | `/api/conteudo/slug/[slug]` | Por slug (guias) |

Rotas autenticadas leem o cookie `token` no servidor (`getUserFromRequest`).

---

## Banco de dados

A conexão é centralizada em `src/lib/db.ts` com **cache global** do Mongoose (evita múltiplas conexões em dev com hot reload).

### Modelos principais

**User** (base) — discriminator `tipo_usuario`:

- `nome`, `email` (único), `senha` (hash), `status` (`ativo` | `inativo`)

**Paciente** (`tipo_usuario: paciente`):

- `pronomes`, `identidade_genero`, `data_nascimento`, `telefone`
- `terapia_hormonal`, `dosagem_hormonio`, `bloqueador_hormonal`

**Funcionario** (`tipo_usuario: funcionario`):

- `cargo`, `data_admissao`, `especialidades[]`

**Agendamento**:

- `paciente`, `profissional`, `data`, `hora`, `tipo`, `especialidade`
- `status`: `confirmado` | `pendente` | `cancelado` | `realizado` | `ausente`
- `modalidade`: `Presencial` | `Online`
- `observacoes`, `historico[]`, `criadoPor`

**Conteudo** (artigos da home/guias):

- `title`, `description`, `content`, `image`, `slug` (único)

As coleções são criadas automaticamente na primeira gravação.

---

## Estrutura do projeto

```
ambulat-riott-1/
├── cypress/                 # Testes E2E
│   └── e2e/
├── public/                  # Imagens estáticas (logo, banners)
├── src/
│   ├── app/                 # App Router (páginas + API)
│   │   ├── api/             # Route Handlers REST
│   │   ├── paciente/        # Área do paciente
│   │   ├── funcionario/     # Área administrativa/clínica
│   │   ├── login/
│   │   ├── guias/[slug]/
│   │   ├── error.tsx        # Boundary de erro por rota
│   │   ├── not-found.tsx    # 404
│   │   └── global-error.tsx # Erro no layout raiz
│   ├── components/
│   │   ├── errors/          # ErrorScreen, InlineErrorState
│   │   ├── sidebar.tsx
│   │   └── TerapiaHormonalFields.tsx
│   ├── hooks/
│   │   └── usePersistedState.ts
│   ├── lib/
│   │   ├── agendamentos.ts          # Servidor (Mongoose)
│   │   ├── agendamentos-utils.ts    # Cliente (sem Mongoose)
│   │   ├── auth.ts / auth-usu.ts
│   │   ├── db.ts
│   │   ├── errors/                  # Classificação e textos de erro
│   │   └── ...
│   ├── models/              # Schemas Mongoose
│   └── middleware.ts        # Proteção /paciente e /funcionario
├── tests/                   # Jest (back + front)
├── jest.config.mjs
├── cypress.config.ts
└── package.json
```

---

## Telas de erro

Implementadas para explicar **o que aconteceu**, **por quê** e **o que fazer**:

| Arquivo | Uso |
|---------|-----|
| `src/app/not-found.tsx` | Página inexistente (404) |
| `src/app/error.tsx` | Erros em rotas (classificação automática) |
| `src/app/global-error.tsx` | Falha crítica no layout (sem sidebar) |
| `src/components/errors/ErrorScreen.tsx` | UI completa reutilizável |
| `src/components/errors/InlineErrorState.tsx` | Erros de API dentro de páginas |

Tipos reconhecidos: rede, banco, sessão (401), permissão (403), cache/chunk, servidor (500), UI quebrada, etc. (`src/lib/errors/classify-error.ts`).

**Testar 404:** acesse `http://localhost:3000/rota-inexistente`.

---

## Boas práticas de desenvolvimento

1. **Não importe `agendamentos.ts` em componentes `"use client"`** — use `agendamentos-utils.ts` para evitar erro de bundle com Mongoose/`async_hooks`.

2. **Variáveis de ambiente** — nunca commite `.env.local`; use `JWT_SECRET` forte em produção.

3. **Lint** — rode `npm run lint` antes de abrir PR.

4. **Disco cheio** — em Windows, falta de espaço pode **corromper arquivos** (páginas vazias). Libere espaço, restaure via `git checkout -- <arquivo>` e apague `.next` se o Turbopack apresentar `PoisonError`.

5. **Middleware** — Next.js 16 pode exibir aviso de depreciação do arquivo `middleware` em favor de `proxy`; o projeto ainda usa `middleware.ts` para proteção de rotas.

6. **Cypress** — o arquivo `cypress.config.ts` pode ser incluído no typecheck global do `next build` em alguns setups; mantenha tipos compatíveis ou exclua no `tsconfig` se necessário.

---

## Solução de problemas

| Sintoma | Possível causa | O que fazer |
|---------|----------------|-------------|
| `Defina MONGODB_URI ou MONGO_URL` | `.env.local` ausente | Criar arquivo com URI válida |
| Erro de conexão MongoDB | Serviço parado / URI errada / firewall | Verificar `mongod`, Atlas IP whitelist, porta |
| Redirecionamento infinito para login | Sem cookie após login | Verificar credenciais, console da API `/api/login` |
| `Failed to fetch` na home (antigo) | API externa removida | Conteúdo deve vir de `/api/conteudo` — atualize o código se ainda houver `localhost:3333` |
| `default export is not a React Component` | Arquivo `page.tsx` vazio/corrompido | Restaurar do Git; liberar espaço em disco |
| `File ... is not a module` no build | Mesmo problema (arquivo 0 bytes) | `git checkout --` no arquivo + `npm run build` |
| Turbopack lento / `PoisonError` | Cache corrompido | Apagar pasta `.next` e reiniciar `npm run dev` |
| Profissionais vazios no agendamento | Filtro por especialidade/cargo | Cadastrar especialidades no funcionário; revisar `GET /api/profissionais` |
| Testes Jest falhando | Expectativas desatualizadas | Revisar `tests/back` e `tests/front` |

### Limpar cache de build

```bash
# PowerShell (Windows)
Remove-Item -Recurse -Force .next

# Bash
rm -rf .next
```

Depois: `npm run dev` ou `npm run build`.

---

## Contato e suporte (interface)

O rodapé da sidebar exibe o telefone de suporte configurado na UI: **+55 83 8225-7290**.

---

## Licença

Projeto privado (`"private": true` no `package.json`). Uso conforme política da equipe do Ambulatório TT.
