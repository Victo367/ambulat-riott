import type { Paciente } from "@/lib/pacientes";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  paciente?: Paciente;
  submitLabel: string;
  erro?: string | null;
};

const mensagensErro: Record<string, string> = {
  nome_obrigatorio: "Informe o nome do paciente.",
  cpf_duplicado: "Já existe um paciente com este CPF.",
  id_invalido: "Registro inválido.",
};

export function PacienteForm({ action, paciente, submitLabel, erro }: Props) {
  const textoErro = erro ? mensagensErro[erro] ?? erro : null;

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {textoErro ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {textoErro}
        </p>
      ) : null}

      {paciente ? (
        <input type="hidden" name="id" value={paciente.id} />
      ) : null}

      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className="text-sm font-medium">
          Nome completo <span className="text-red-600">*</span>
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={255}
          defaultValue={paciente?.nome ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="cpf" className="text-sm font-medium">
            CPF
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            defaultValue={paciente?.cpf ?? ""}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="data_nascimento" className="text-sm font-medium">
            Data de nascimento
          </label>
          <input
            id="data_nascimento"
            name="data_nascimento"
            type="date"
            defaultValue={paciente?.data_nascimento ?? ""}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Sexo</span>
        <div className="flex flex-wrap gap-4 text-sm">
          {(
            [
              { value: "", label: "Não informado" },
              { value: "M", label: "Masculino" },
              { value: "F", label: "Feminino" },
              { value: "O", label: "Outro" },
            ] as const
          ).map((opt) => (
            <label key={opt.value || "empty"} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="sexo"
                value={opt.value}
                defaultChecked={
                  paciente
                    ? (paciente.sexo ?? "") === opt.value
                    : opt.value === ""
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="telefone" className="text-sm font-medium">
            Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            autoComplete="tel"
            defaultValue={paciente?.telefone ?? ""}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={paciente?.email ?? ""}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="endereco" className="text-sm font-medium">
          Endereço
        </label>
        <textarea
          id="endereco"
          name="endereco"
          rows={3}
          defaultValue={paciente?.endereco ?? ""}
          className="resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
