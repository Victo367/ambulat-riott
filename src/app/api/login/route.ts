import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import {
  sanitizeEmail,
  validateLoginApiBody,
  hasFieldErrors,
} from "@/lib/field-validation";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const fields = validateLoginApiBody(body);

  if (hasFieldErrors(fields)) {
    return NextResponse.json(
      { error: "Verifique os campos destacados", fields },
      { status: 400 }
    );
  }

  const email = sanitizeEmail(String(body.email ?? ""));
  const senha = String(body.senha ?? "");

  const user = await User.findOne({ email }).lean();

  if (!user) {
    return NextResponse.json(
      {
        error: "Credenciais inválidas",
        fields: { email: "E-mail não encontrado" },
      },
      { status: 401 }
    );
  }

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    return NextResponse.json(
      {
        error: "Credenciais inválidas",
        fields: { senha: "Senha incorreta" },
      },
      { status: 401 }
    );
  }

  const token = generateToken({
    id: user._id.toString(),
    tipo: user.tipo_usuario,
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
