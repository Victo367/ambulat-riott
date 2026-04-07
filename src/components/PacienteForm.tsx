import { CpfInput } from "@/components/CpfInput";
import { PasswordInput } from "@/components/PasswordInput";
import { TelefoneInput } from "@/components/TelefoneInput";
import type { Paciente } from "@/lib/pacientes";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  paciente?: Paciente;
  submitLabel: string;
  erro?: string | null;
};

const mensagensErro: Record<string, string> = {
  nome_obrigatorio: "Informe o nome.",
  pronome_obrigatorio: "Informe os pronomes.",
  identidade_genero_obrigatoria: "Informe a identidade de gênero.",
  cpf_obrigatorio: "Informe o CPF.",
  cpf_invalido: "O CPF deve ter 11 dígitos.",
  data_nascimento_obrigatoria: "Informe a data de nascimento.",
  telefone_obrigatorio: "Informe o telefone.",
  senha_obrigatoria: "Informe a senha.",
  senha_invalida:
    "A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 caractere especial.",
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
          Nome <span className="text-red-600">*</span>
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={255}
          autoComplete="off"
          placeholder="Nome do paciente"
          defaultValue={paciente?.nome ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="pronome" className="text-sm font-medium">
          Pronomes <span className="text-red-600">*</span>
        </label>
        <input
          id="pronome"
          name="pronome"
          type="text"
          required
          maxLength={120}
          autoComplete="off"
          placeholder="ex.: ela, ele, elu, outro"
          defaultValue={paciente?.pronome ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="identidade_genero" className="text-sm font-medium">
          Identidade de gênero <span className="text-red-600">*</span>
        </label>
        <input
          id="identidade_genero"
          name="identidade_genero"
          type="text"
          required
          maxLength={120}
          autoComplete="off"
          placeholder="ex.: mulher, homem, não-binárie, outro"
          defaultValue={paciente?.identidade_genero ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
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
            Data de nascimento <span className="text-red-600">*</span>
          </label>
          <input
            id="data_nascimento"
            name="data_nascimento"
            type="date"
            required
            defaultValue={paciente?.data_nascimento ?? ""}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

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
        <label htmlFor="senha" className="text-sm font-medium">
          Senha {!paciente ? <span className="text-red-600">*</span> : null}
        </label>
        <PasswordInput
          id="senha"
          name="senha"
          required={!paciente}
          minLength={8}
          autoComplete="new-password"
          placeholder={!paciente ? "Crie uma senha forte" : "Nova senha (opcional)"}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
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
