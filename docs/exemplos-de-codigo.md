## ETAPA 1 — Análise do projeto (crítica técnica)

### Arquitetura atual

- Frontend e SSR em `src/app` (Next.js App Router), com páginas por perfil: `paciente/*` e `funcionario/*`.
- Backend em Route Handlers (`src/app/api/**/route.ts`).
- Regras de negócio em `src/lib` (agendamentos, auth, validação, conteúdo, tratamento de erros).
- Reuso de UI e formulários em `src/components` e `src/hooks`.

### Problemas identificados e status


| #   | Problema                                                   | Status após refatoração                        |
| --- | ---------------------------------------------------------- | ---------------------------------------------- |
|     |                                                            |                                                |
| 1   | PATCH de agendamento com lógica mista paciente/funcionário | **Resolvido** (Strategy + Facade)              |
| 2   | Regras de agendamento espalhadas entre lib e rotas         | **Resolvido** (Facade centraliza casos de uso) |
| 3   | Duplicação de `dataIsoLocal` / formatação no front         | **Resolvido** (agenda funcionário)             |
| 4   | Condicionais por tipo em `register-user.ts`                | **Resolvido** (Factory Method)                 |


## ETAPA 2 — Padrões escolhidos e onde foram aplicados


| Padrão             | Tipo           | Onde está no código                                                                  |
| ------------------ | -------------- | ------------------------------------------------------------------------------------ |
| **Factory Method** | Criacional     | `src/lib/user-creators/`* + `src/lib/register-user.ts`                               |
| **Facade**         | Estrutural     | `src/lib/agendamento-facade.ts` + rotas `src/app/api/agendamentos/`**                |
| **Strategy**       | Comportamental | `src/lib/agendamento-update-strategies/`*, usada por `AgendamentoFacade.atualizar()` |


## Factory Method (Criacional)

### 1. Problema antes da refatoração

- `register-user.ts` decidia por `if/else` qual validação e criação executar.
- Violação de **SRP** e **OCP**: novo tipo de usuário exigia editar o núcleo condicional.

O **Princípio da Responsabilidade Única** diz que:

> Uma classe deve ter apenas um motivo para mudar.

O **OCP (Princípio Aberto/Fechado)** é outro princípio do SOLID Ele diz:

> Uma classe deve estar aberta para extensão, mas fechada para modificação.

### 2. Motivo da escolha

- Encapsula variação por tipo em classes `PacienteCreator` e `FuncionarioCreator`.
- A factory escolhe a implementação; o fluxo de `createUserByType` permanece estável.

### 3. Código ANTES (histórico)

Arquivo: `src/lib/register-user.ts` (versão anterior)

```tsx
const fieldErrors: FormFieldErrors =
  tipo === "paciente"
    ? validatePacienteApiBody(body as Record<string, unknown>)
    : validateFuncionarioApiBody(body as Record<string, unknown>);

const user =
  tipo === "paciente"
    ? await Paciente.create(buildPacientePayload(body))
    : await Funcionario.create(buildFuncionarioPayload(body));

```

### 4. Onde a refatoração realizada

1. `src/lib/user-creators/types.ts` — interface `UserCreator`.
2. `src/lib/user-creators/paciente-creator.ts` — implementação paciente.
3. `src/lib/user-creators/funcionario-creator.ts` — implementação funcionário.
4. `src/lib/user-creators/factory.ts` — `createUserCreator(tipo)`.
5. `src/lib/register-user.ts` — orquestração sem condicionais de domínio.

### 5. Código DEPOIS (implementado)

```tsx
// src/lib/user-creators/factory.ts
export function createUserCreator(tipo: TipoUsuario): UserCreator {
  if (tipo === "paciente") return new PacienteCreator();
  return new FuncionarioCreator();
}

```

```tsx
// src/lib/register-user.ts
export async function createUserByType(body: RegisterInput, tipo: TipoUsuario) {
  const creator = createUserCreator(tipo);
  const fieldErrors = creator.validate(body as Record<string, unknown>);

  if (hasFieldErrors(fieldErrors)) {
    return { ok: false as const, status: 400, data: { error: "...", fields: fieldErrors } };
  }

  const payload = creator.buildPayload(body as Record<string, unknown>);
  const user = await creator.create(payload);
  return { ok: true as const, status: 201, data: sanitizeUser(user) };
}

```

### 6. Vantagens e desvantagens

**Vantagens:** extensibilidade, testes por tipo, menor acoplamento.

**Desvantagens:** mais arquivos; curva de leitura para quem não conhece o padrão.

---

## Facade (Estrutural)

### 1. Problema antes da refatoração

- Handlers importavam dezenas de funções de `agendamentos.ts` e repetiam lógica de listagem, criação e update.
- Violação de **SRP** e **DIP** na camada HTTP.

O **Princípio da Responsabilidade Única** diz que:

> Uma classe deve ter apenas um motivo para mudar.

O **Princípio da Inversão de Dependência** diz:

> Classes de alto nível não devem depender de classes de baixo nível.
>
> Ambas devem depender de abstrações.

### 2. Motivo da escolha

- Um ponto de entrada (`AgendamentoFacade`) para casos de uso do domínio.
- Rotas ficam finas: autenticação HTTP + delegação + tratamento de erro.

### 3. Código ANTES (histórico)

`src/app/api/agendamentos/[id]/route.ts` importava diretamente:

```tsx
import {
  serializeAgendamento,
  normalizeStatus,
  findAgendamentoPopulado,
  getNomeUsuario,
  normalizarHora,
  normalizarDataIso,
} from "@/lib/agendamentos";
// + ~160 linhas de regra de negócio no handler PATCH

```

### 4. Refatoração realizada

1. `src/lib/agendamento-facade.ts` com métodos:
  - `obterAutorizado(id, loggedUser)`
  - `listar(loggedUser, { verTodos, dataParam })`
  - `criar(loggedUser, body)`
  - `atualizar(id, body, loggedUser)` → delega à Strategy
  - `horariosDisponiveis(profissionalId, data, excludeId?)`
2. Erros de domínio via `AgendamentoDomainError` + `agendamentoErrorResponse`.
3. Rotas em `src/app/api/agendamentos/**` reduzidas a adaptadores HTTP.

### 5. Código DEPOIS (implementado)

```tsx
// src/lib/agendamento-facade.ts (trecho)
export class AgendamentoFacade {
  async atualizar(id: string, body: Record<string, unknown>, loggedUser: TokenPayload) {
    const strategy = resolveUpdateStrategy(loggedUser.tipo);
    return strategy.execute({ id, body, loggedUser });
  }
}

export const agendamentoFacade = new AgendamentoFacade();

```

```tsx
// src/app/api/agendamentos/route.ts (POST)
const criado = await agendamentoFacade.criar(loggedUser, body);
return Response.json(criado, { status: 201 });

```

```tsx
// src/app/api/agendamentos/[id]/route.ts (PATCH — ~15 linhas de lógica)
const atualizado = await agendamentoFacade.atualizar(id, body, loggedUser);
return Response.json(atualizado, { status: 200 });

```

### 6. Vantagens e desvantagens

**Vantagens:** handlers legíveis, regras centralizadas, reuso entre endpoints.

**Desvantagens:** a facade pode crescer; convém manter strategies/creators para não concentrar tudo nela.

---

## Strategy (Comportamental)

### 1. Problema antes da refatoração

- Um único `PATCH` com blocos `if (loggedUser.tipo === "paciente")` e `if (loggedUser.tipo !== "funcionario")`.
- Violação de **SRP** e **OCP**.

O **Princípio da Responsabilidade Única** diz que:

> Uma classe deve ter apenas um motivo para mudar.

O **OCP (Princípio Aberto/Fechado)** é outro princípio do SOLID Ele diz:

> Uma classe deve estar aberta para extensão, mas fechada para modificação.

### 2. Motivo da escolha

- Cada perfil tem política de atualização isolada em sua própria classe.
- A facade resolve a estratégia por `tipo` sem o handler HTTP saber os detalhes.

### 3. Código ANTES (histórico)

```tsx
if (loggedUser.tipo === "paciente") {
  // cancelar ou remarcar com restrições
  ...
}
if (loggedUser.tipo !== "funcionario") {
  return Response.json({ error: "Acesso negado" }, { status: 403 });
}
// funcionário: editar data, hora, status, observações...

```

### 4. Refatoração realizada

1. `src/lib/agendamento-update-strategies/types.ts`
2. `paciente-update-strategy.ts` — cancelamento e remarcação
3. `funcionario-update-strategy.ts` — edição ampla e histórico de status
4. `resolve-strategy.ts` — seleção por `tipo`

### 5. Código DEPOIS (implementado)

```tsx
// src/lib/agendamento-update-strategies/resolve-strategy.ts
export function resolveUpdateStrategy(tipo: string): AgendamentoUpdateStrategy {
  if (tipo === "paciente") return new PacienteUpdateStrategy();
  if (tipo === "funcionario") return new FuncionarioUpdateStrategy();
  throw new AgendamentoDomainError(403, "Acesso negado");
}

```

```tsx
// PacienteUpdateStrategy — regras preservadas:
// - só pode cancelar via status
// - remarcação exige data ou hora
// - bloqueio se status final (cancelado, realizado, ausente)

```

```tsx
// FuncionarioUpdateStrategy — regras preservadas:
// - altera data, hora, observações, tipo, modalidade, status
// - registra histórico com labels de status

```

### 6. Vantagens e desvantagens

**Vantagens:** coesão por perfil, testes unitários por strategy, menor risco de regressão cruzada.

**Desvantagens:** mais módulos; interface comum deve permanecer estável.

Em desenvolvimento de software, “regressão” acontece quando:

> uma alteração no sistema quebra algo que antes funcionava.

### 1. Introdução (1–2 min)

- **Projeto:** portal de saúde do Ambulatório TT (agendamentos, pacientes, funcionários, conteúdo).
- **Stack:** Next.js 16, TypeScript, MongoDB/Mongoose, App Router.
- **Objetivo da refatoração:** aplicar três padrões de projeto em problemas reais, sem alterar regras de negócio.

### 2. Problemas encontrados (2 min)

- Mostrar o PATCH antigo ~~(~~48 linhas no arquivo da rota).
- Mostrar condicionais em `register-user` antes da factory.
- Mencionar duplicação de datas no front (corrigida na agenda).

### 3. Factory Method (2 min)

- Conceito: família de criadores; factory escolhe qual usar.
- Demo: abrir `user-creators/factory.ts` e `register-user.ts`.
- Benefício: cadastro de paciente/funcionário extensível.

### 4. Facade (2 min)

- Conceito: interface única para subsistema complexo.
- Demo: `agendamento-facade.ts` e rota `agendamentos/route.ts`.
- Benefício: APIs finas e domínio centralizado.

### 5. Strategy (2 min)

- Conceito: algoritmos intercambiáveis por contexto.
- Demo: `paciente-update-strategy.ts` vs `funcionario-update-strategy.ts`.
- Benefício: regras de perfil isoladas.

### 6. Antes vs depois (1 min)


| Aspecto           | Antes                             | Depois                          |
| ----------------- | --------------------------------- | ------------------------------- |
| PATCH agendamento | ~160 linhas de regra no handler   | Delegação à facade + strategy   |
| Cadastro por tipo | `if/else` no núcleo               | Factory + creators              |
| Imports nas rotas | Muitos símbolos de `agendamentos` | `agendamentoFacade` + erro HTTP |
| Extensibilidade   | Editar arquivo central            | Novas classes                   |


### 7. Conclusão (1 min)

- Padrões aplicados onde havia dor real.
- Comportamento funcional preservado (build OK).
- Próximos passos: Template Method para auth repetida nas APIs; testes unitários das strategies.

