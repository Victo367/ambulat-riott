"use server";

import mongoose from "mongoose";
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
    senha: normalizarTexto(formData.get("senha")),
  };
}

function senhaForte(senha: string): boolean {
  return (
    senha.length >= 8 &&
    /[A-Z]/.test(senha) &&
    /[^A-Za-z0-9]/.test(senha)
  );
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
  if (!input.senha) redirect("/pacientes/novo?erro=senha_obrigatoria");
  if (!senhaForte(input.senha)) redirect("/pacientes/novo?erro=senha_invalida");
}

function validarObrigatoriosEdicao(id: string, input: PacienteInput): void {
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
  if (input.senha && !senhaForte(input.senha)) {
    redirect(`/pacientes/${id}/editar?erro=senha_invalida`);
  }
}

function isDuplicateKeyError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code?: number }).code === 11000
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
  const id = String(formData.get("id") ?? "").trim();
  if (!id || !mongoose.isValidObjectId(id)) {
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
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }
  await excluirPaciente(id);
  revalidatePath("/pacientes");
}
