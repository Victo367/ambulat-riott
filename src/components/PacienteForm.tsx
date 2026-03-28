import { CpfInput } from "@/components/CpfInput";
import { TelefoneInput } from "@/components/TelefoneInput";
import type { Paciente } from "@/lib/pacientes";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  paciente?: Paciente;
  submitLabel: string;
  erro?: string | null;
};

const mensagensErro: Record<string, string> = {
  nome_obrigatorio: "Informe o nome civil do paciente.",
  nome_social_obrigatorio: "Informe o nome social.",
  cpf_obrigatorio: "Informe o CPF.",
  cpf_invalido: "O CPF deve ter 11 dígitos.",
  telefone_obrigatorio: "Informe o telefone.",
  endereco_obrigatorio: "Informe o endereço.",
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
        <label htmlFor="nome_social" className="text-sm font-medium">
          Nome social <span className="text-red-600">*</span>
        </label>
        <input
          id="nome_social"
          name="nome_social"
          type="text"
          required
          maxLength={255}
          autoComplete="off"
          placeholder="Como prefere ser chamado(a) na unidade"
          defaultValue={paciente?.nome_social ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Exibido em primeiro na listagem.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className="text-sm font-medium">
          Nome civil <span className="text-red-600">*</span>
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

      <div className="flex flex-col gap-1">
        <label htmlFor="pronome" className="text-sm font-medium">
          Pronome
        </label>
        <input
          id="pronome"
          name="pronome"
          type="text"
          maxLength={120}
          autoComplete="off"
          placeholder="ex.: ela, ele, elu, outro"
          defaultValue={paciente?.pronome ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Como a pessoa prefere ser tratada (opcional).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="cpf" className="text-sm font-medium">
            CPF <span className="text-red-600">*</span>
          </label>
          <CpfInput
            id="cpf"
            defaultValue={paciente?.cpf ?? ""}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
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
        <span className="text-sm font-medium">Sexo atribuido ao nascer </span>
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
            Telefone <span className="text-red-600">*</span>
          </label>
          <TelefoneInput
            id="telefone"
            defaultValue={paciente?.telefone ?? ""}
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
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
          Endereço <span className="text-red-600">*</span>
        </label>
        <textarea
          id="endereco"
          name="endereco"
          required
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
