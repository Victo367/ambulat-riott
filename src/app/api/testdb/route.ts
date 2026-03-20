import { NextResponse } from "next/server";

import { testMysqlConnection } from "../../../lib/db";

export async function GET() {
  try {
    const result = await testMysqlConnection();
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

