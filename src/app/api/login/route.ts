import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { email, senha } = await req.json();
  const fields: Record<string, string> = {};

  if (!email?.trim()) fields.email = "Informe o e-mail";
  if (!senha?.trim()) fields.senha = "Informe a senha";

  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: "Preencha e-mail e senha", fields },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).lean();

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
