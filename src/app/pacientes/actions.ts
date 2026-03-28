"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { PacienteInput, Sexo } from "@/lib/pacientes";
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
  const sexoRaw = normalizarTexto(formData.get("sexo"));
  const sexo: Sexo | null =
    sexoRaw === "M" || sexoRaw === "F" || sexoRaw === "O" ? sexoRaw : null;

  const dn = normalizarTexto(formData.get("data_nascimento"));

  return {
    nome: String(formData.get("nome") ?? "").trim(),
    nome_social: normalizarTexto(formData.get("nome_social")),
    pronome: normalizarTexto(formData.get("pronome")),
    cpf: normalizarCpf(formData.get("cpf")),
    data_nascimento: dn,
    sexo,
    telefone: normalizarTexto(formData.get("telefone")),
    email: normalizarTexto(formData.get("email")),
    endereco: normalizarTexto(formData.get("endereco")),
  };
}

function validarObrigatoriosNovo(input: PacienteInput): void {
  if (!input.nome) redirect("/pacientes/novo?erro=nome_obrigatorio");
  if (!input.nome_social) redirect("/pacientes/novo?erro=nome_social_obrigatorio");
  if (!input.cpf) redirect("/pacientes/novo?erro=cpf_obrigatorio");
  if (input.cpf.length !== 11) redirect("/pacientes/novo?erro=cpf_invalido");
  if (!input.telefone) redirect("/pacientes/novo?erro=telefone_obrigatorio");
  if (!input.endereco) redirect("/pacientes/novo?erro=endereco_obrigatorio");
}

function validarObrigatoriosEdicao(id: number, input: PacienteInput): void {
  if (!input.nome) redirect(`/pacientes/${id}/editar?erro=nome_obrigatorio`);
  if (!input.nome_social) {
    redirect(`/pacientes/${id}/editar?erro=nome_social_obrigatorio`);
  }
  if (!input.cpf) redirect(`/pacientes/${id}/editar?erro=cpf_obrigatorio`);
  if (input.cpf.length !== 11) redirect(`/pacientes/${id}/editar?erro=cpf_invalido`);
  if (!input.telefone) redirect(`/pacientes/${id}/editar?erro=telefone_obrigatorio`);
  if (!input.endereco) redirect(`/pacientes/${id}/editar?erro=endereco_obrigatorio`);
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
