import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "./db";

/** Colunas do cadastro completo; faltantes são criadas com ALTER (bases antigas). */
const COLUNAS_PACIENTES: readonly { nome: string; ddl: string }[] = [
  { nome: "cpf", ddl: "ADD COLUMN cpf VARCHAR(14) NULL" },
  { nome: "data_nascimento", ddl: "ADD COLUMN data_nascimento DATE NULL" },
  { nome: "sexo", ddl: "ADD COLUMN sexo ENUM('M', 'F', 'O') NULL" },
  { nome: "nome_social", ddl: "ADD COLUMN nome_social VARCHAR(255) NULL" },
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

/** Sem cache global: após migrar só `sexo`, o processo não pode “pular” `endereco` nas próximas chamadas. */
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
      // 1060 = coluna duplicada (corrida entre requisições)
      if (err.errno !== 1060) throw e;
      existentes.add(nome.toLowerCase());
    }
  }
}

export type Sexo = "M" | "F" | "O";

export type Paciente = {
  id: number;
  nome: string;
  nome_social: string | null;
  pronome: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  sexo: Sexo | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  created_at: Date;
  updated_at: Date;
};

type PacienteRow = RowDataPacket & {
  id: number;
  nome: string;
  nome_social: string | null;
  pronome: string | null;
  cpf: string | null;
  data_nascimento: Date | string | null;
  sexo: Sexo | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  created_at: Date;
  updated_at: Date;
};

/** Nome preferencial para exibição: nome social, se houver; senão nome civil. */
export function nomeExibicao(p: Pick<Paciente, "nome" | "nome_social">): string {
  const s = p.nome_social?.trim();
  if (s) return s;
  return p.nome.trim();
}

function rowToPaciente(row: PacienteRow): Paciente {
  const dn = row.data_nascimento;
  return {
    id: row.id,
    nome: row.nome,
    nome_social: row.nome_social,
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
    sexo: row.sexo,
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
    `SELECT id, nome, nome_social, pronome, cpf, data_nascimento, sexo, telefone, email, endereco, created_at, updated_at
     FROM pacientes
     ORDER BY COALESCE(NULLIF(TRIM(nome_social), ''), nome) ASC`,
  );
  return rows.map(rowToPaciente);
}

export async function obterPaciente(id: number): Promise<Paciente | null> {
  const pool = getMySqlPool();
  await garantirSchemaPacientes(pool);
  const [rows] = await pool.execute<PacienteRow[]>(
    `SELECT id, nome, nome_social, pronome, cpf, data_nascimento, sexo, telefone, email, endereco, created_at, updated_at
     FROM pacientes
     WHERE id = ?
     LIMIT 1`,
    [id],
  );
  const row = rows[0];
  return row ? rowToPaciente(row) : null;
}

export type PacienteInput = {
  nome: string;
  nome_social: string | null;
  pronome: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  sexo: Sexo | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
};

export async function inserirPaciente(input: PacienteInput): Promise<number> {
  const pool = getMySqlPool();
  await garantirSchemaPacientes(pool);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO pacientes (nome, nome_social, pronome, cpf, data_nascimento, sexo, telefone, email, endereco)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.nome,
      input.nome_social,
      input.pronome,
      input.cpf,
      input.data_nascimento,
      input.sexo,
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
       nome = ?, nome_social = ?, pronome = ?, cpf = ?, data_nascimento = ?, sexo = ?, telefone = ?, email = ?, endereco = ?
     WHERE id = ?`,
    [
      input.nome,
      input.nome_social,
      input.pronome,
      input.cpf,
      input.data_nascimento,
      input.sexo,
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
