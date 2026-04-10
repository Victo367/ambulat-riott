import mongoose, { Schema, model, models } from "mongoose";
import type { Types } from "mongoose";

import { connectDB } from "./db";

const PacienteSchema = new Schema(
  {
    nome: { type: String, default: "" },
    identidade_genero: { type: String, default: null },
    pronome: { type: String, default: null },
    cpf: { type: String, default: null },
    data_nascimento: { type: String, default: null },
    telefone: { type: String, default: null },
    senha: { type: String, default: null },
  },
  {
    collection: "pacientes",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

PacienteSchema.index(
  { cpf: 1 },
  {
    unique: true,
    partialFilterExpression: {
      cpf: { $type: "string", $nin: [null, ""] },
    },
  },
);

type PacienteLean = {
  _id: Types.ObjectId;
  nome?: string | null;
  identidade_genero?: string | null;
  pronome?: string | null;
  cpf?: string | null;
  data_nascimento?: string | null;
  telefone?: string | null;
  created_at: Date;
  updated_at: Date;
};

const PacienteModel =
  models.Paciente ?? model("Paciente", PacienteSchema);

function docToPaciente(doc: PacienteLean): Paciente {
  return {
    id: doc._id.toString(),
    nome: (doc.nome ?? "").trim() || "(Sem nome)",
    identidade_genero: doc.identidade_genero ?? null,
    pronome: doc.pronome ?? null,
    cpf: doc.cpf ?? null,
    data_nascimento: doc.data_nascimento ?? null,
    telefone: doc.telefone ?? null,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
}

export type Paciente = {
  id: string;
  nome: string;
  identidade_genero: string | null;
  pronome: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  created_at: Date;
  updated_at: Date;
};

export type PacienteInput = {
  nome: string | null;
  identidade_genero: string | null;
  pronome: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  senha: string | null;
};

export async function listarPacientes(): Promise<Paciente[]> {
  await connectDB();
  const docs = await PacienteModel.find()
    .sort({ nome: 1 })
    .lean<PacienteLean[]>()
    .exec();
  return docs.map(docToPaciente);
}

export async function obterPaciente(id: string): Promise<Paciente | null> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return null;
  const doc = await PacienteModel.findById(id).lean<PacienteLean | null>().exec();
  if (!doc) return null;
  return docToPaciente(doc);
}

export async function inserirPaciente(input: PacienteInput): Promise<string> {
  await connectDB();
  const created = await PacienteModel.create({
    nome: input.nome,
    identidade_genero: input.identidade_genero,
    pronome: input.pronome,
    cpf: input.cpf,
    data_nascimento: input.data_nascimento,
    telefone: input.telefone,
    senha: input.senha,
  });
  return created._id.toString();
}

export async function atualizarPaciente(
  id: string,
  input: PacienteInput,
): Promise<void> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("ID inválido");
  }

  const set: Record<string, unknown> = {
    nome: input.nome,
    identidade_genero: input.identidade_genero,
    pronome: input.pronome,
    cpf: input.cpf,
    data_nascimento: input.data_nascimento,
    telefone: input.telefone,
  };
  if (input.senha) {
    set.senha = input.senha;
  }

  await PacienteModel.findByIdAndUpdate(id, { $set: set }).exec();
}

export async function excluirPaciente(id: string): Promise<void> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return;
  await PacienteModel.findByIdAndDelete(id).exec();
}
