"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { PacienteInput } from "@/lib/pacientes";
import {
  atualizarPaciente,
  excluirPaciente,
  inserirPaciente,
} from "@/lib/pacientes";

function normalizarTexto(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

function normalizarCpf(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").replace(/\D/g, "");
  return s === "" ? null : s;
}

function parsePacienteInput(formData: FormData): PacienteInput {
  const dn = normalizarTexto(formData.get("data_nascimento"));

  return {
    nome: normalizarTexto(formData.get("nome")),
    identidade_genero: normalizarTexto(formData.get("identidade_genero")),
    pronome: normalizarTexto(formData.get("pronome")),
    cpf: normalizarCpf(formData.get("cpf")),
    data_nascimento: dn,
    telefone: normalizarTexto(formData.get("telefone")),
  };
}

function validarObrigatoriosNovo(input: PacienteInput): void {
  if (!input.nome) redirect("/pacientes/novo?erro=nome_obrigatorio");
  if (!input.pronome) redirect("/pacientes/novo?erro=pronome_obrigatorio");
  if (!input.identidade_genero) {
    redirect("/pacientes/novo?erro=identidade_genero_obrigatoria");
  }
  if (!input.cpf) redirect("/pacientes/novo?erro=cpf_obrigatorio");
  if (input.cpf.length !== 11) redirect("/pacientes/novo?erro=cpf_invalido");
  if (!input.data_nascimento) {
    redirect("/pacientes/novo?erro=data_nascimento_obrigatoria");
  }
  if (!input.telefone) redirect("/pacientes/novo?erro=telefone_obrigatorio");
}

function validarObrigatoriosEdicao(id: number, input: PacienteInput): void {
  if (!input.nome) {
    redirect(`/pacientes/${id}/editar?erro=nome_obrigatorio`);
  }
  if (!input.pronome) redirect(`/pacientes/${id}/editar?erro=pronome_obrigatorio`);
  if (!input.identidade_genero) {
    redirect(`/pacientes/${id}/editar?erro=identidade_genero_obrigatoria`);
  }
  if (!input.cpf) redirect(`/pacientes/${id}/editar?erro=cpf_obrigatorio`);
  if (input.cpf.length !== 11) redirect(`/pacientes/${id}/editar?erro=cpf_invalido`);
  if (!input.data_nascimento) {
    redirect(`/pacientes/${id}/editar?erro=data_nascimento_obrigatoria`);
  }
  if (!input.telefone) redirect(`/pacientes/${id}/editar?erro=telefone_obrigatorio`);
}

function isDuplicateKeyError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code?: string }).code === "ER_DUP_ENTRY"
  );
}

export async function criarPaciente(formData: FormData) {
  const input = parsePacienteInput(formData);
  validarObrigatoriosNovo(input);

  try {
    await inserirPaciente(input);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      redirect("/pacientes/novo?erro=cpf_duplicado");
    }
    throw e;
  }

  revalidatePath("/pacientes");
  redirect("/pacientes");
}

export async function salvarPaciente(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    redirect("/pacientes?erro=id_invalido");
  }

  const input = parsePacienteInput(formData);
  validarObrigatoriosEdicao(id, input);

  try {
    await atualizarPaciente(id, input);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      redirect(`/pacientes/${id}/editar?erro=cpf_duplicado`);
    }
    throw e;
  }

  revalidatePath("/pacientes");
  redirect("/pacientes");
}

export async function removerPaciente(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    return;
  }
  await excluirPaciente(id);
  revalidatePath("/pacientes");
}
