import mysql from "mysql2/promise";

import type { Pool } from "mysql2/promise";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function createPool(): Pool {
  const host = requireEnv("MYSQL_HOST");
  const user = requireEnv("MYSQL_USER");
  const password = requireEnv("MYSQL_PASSWORD");
  const database = process.env.MYSQL_DATABASE ?? "ambulatoriott";
  const port = Number(process.env.MYSQL_PORT ?? 3306);
  const connectionLimit = Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10);

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit,
    queueLimit: 0,
  });
}

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: Pool | undefined;
}

function getPool(): Pool {
  if (!globalThis.__mysqlPool) {
    globalThis.__mysqlPool = createPool();
  }
  return globalThis.__mysqlPool;
}

export function getMySqlPool(): Pool {
  return getPool();
}

