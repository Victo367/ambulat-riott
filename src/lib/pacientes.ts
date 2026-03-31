import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "./db";

const COLUNAS_PACIENTES: readonly { nome: string; ddl: string }[] = [
  { nome: "cpf", ddl: "ADD COLUMN cpf VARCHAR(14) NULL" },
  { nome: "data_nascimento", ddl: "ADD COLUMN data_nascimento DATE NULL" },
  { nome: "nome_social", ddl: "ADD COLUMN nome_social VARCHAR(255) NULL" },
  {
    nome: "identidade_genero",
    ddl: "ADD COLUMN identidade_genero VARCHAR(120) NULL",
  },
  { nome: "pronome", ddl: "ADD COLUMN pronome VARCHAR(120) NULL" },
  { nome: "telefone", ddl: "ADD COLUMN telefone VARCHAR(40) NULL" },
  { nome: "email", ddl: "ADD COLUMN email VARCHAR(255) NULL" },
  { nome: "endereco", ddl: "ADD COLUMN endereco TEXT NULL" },
  {
    nome: "created_at",
    ddl: "ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
  },
  {
    nome: "updated_at",
    ddl:
      "ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  },
];

async function garantirSchemaPacientes(pool: Pool): Promise<void> {
  const [cols] = await pool.execute<RowDataPacket[]>(
    `SELECT COLUMN_NAME AS n FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pacientes'`,
  );
  const existentes = new Set(cols.map((r) => String(r.n).toLowerCase()));

  for (const { nome, ddl } of COLUNAS_PACIENTES) {
    if (existentes.has(nome.toLowerCase())) continue;
    try {
      await pool.execute(`ALTER TABLE pacientes ${ddl}`);
      existentes.add(nome.toLowerCase());
    } catch (e) {
      const err = e as { errno?: number };

      if (err.errno !== 1060) throw e;
      existentes.add(nome.toLowerCase());
    }
  }

  
  if (existentes.has("nome")) {
    try {
      await pool.execute(
        `ALTER TABLE pacientes MODIFY COLUMN nome VARCHAR(255) NULL`,
      );
    } catch {
     
    }
  }
}

export type Paciente = {
  id: number;
  nome_social: string;
  identidade_genero: string | null;
  pronome: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  created_at: Date;
  updated_at: Date;
};

type PacienteRow = RowDataPacket & {
  id: number;
  nome_social: string | null;
  identidade_genero: string | null;
  pronome: string | null;
  cpf: string | null;
  data_nascimento: Date | string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  created_at: Date;
  updated_at: Date;
};

function rowToPaciente(row: PacienteRow): Paciente {
  const dn = row.data_nascimento;
  return {
    id: row.id,
    nome_social: (row.nome_social ?? "").trim() || "(Sem nome)",
    identidade_genero: row.identidade_genero,
    pronome: row.pronome,
    cpf: row.cpf,
    data_nascimento:
      dn === null
        ? null
        : typeof dn === "string"
          ? dn.slice(0, 10)
          : dn instanceof Date
            ? dn.toISOString().slice(0, 10)
            : String(dn).slice(0, 10),
    telefone: row.telefone,
    email: row.email,
    endereco: row.endereco,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listarPacientes(): Promise<Paciente[]> {
  const pool = getMySqlPool();
  await garantirSchemaPacientes(pool);
  const [rows] = await pool.execute<PacienteRow[]>(
    `SELECT id, nome_social, identidade_genero, pronome, cpf, data_nascimento, telefone, email, endereco, created_at, updated_at
     FROM pacientes
     ORDER BY nome_social ASC`,
  );
  return rows.map(rowToPaciente);
}

export async function obterPaciente(id: number): Promise<Paciente | null> {
  const pool = getMySqlPool();
  await garantirSchemaPacientes(pool);
  const [rows] = await pool.execute<PacienteRow[]>(
    `SELECT id, nome_social, identidade_genero, pronome, cpf, data_nascimento, telefone, email, endereco, created_at, updated_at
     FROM pacientes
     WHERE id = ?
     LIMIT 1`,
    [id],
  );
  const row = rows[0];
  return row ? rowToPaciente(row) : null;
}

export type PacienteInput = {
  nome_social: string | null;
  identidade_genero: string | null;
  pronome: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
};

export async function inserirPaciente(input: PacienteInput): Promise<number> {
  const pool = getMySqlPool();
  await garantirSchemaPacientes(pool);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO pacientes (nome_social, identidade_genero, pronome, cpf, data_nascimento, telefone, email, endereco)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.nome_social,
      input.identidade_genero,
      input.pronome,
      input.cpf,
      input.data_nascimento,
      input.telefone,
      input.email,
      input.endereco,
    ],
  );
  return result.insertId;
}

export async function atualizarPaciente(
  id: number,
  input: PacienteInput,
): Promise<void> {
  const pool = getMySqlPool();
  await garantirSchemaPacientes(pool);
  await pool.execute(
    `UPDATE pacientes SET
       nome_social = ?, identidade_genero = ?, pronome = ?, cpf = ?, data_nascimento = ?, telefone = ?, email = ?, endereco = ?
     WHERE id = ?`,
    [
      input.nome_social,
      input.identidade_genero,
      input.pronome,
      input.cpf,
      input.data_nascimento,
      input.telefone,
      input.email,
      input.endereco,
      id,
    ],
  );
}

export async function excluirPaciente(id: number): Promise<void> {
  const pool = getMySqlPool();
  await pool.execute(`DELETE FROM pacientes WHERE id = ?`, [id]);
}
