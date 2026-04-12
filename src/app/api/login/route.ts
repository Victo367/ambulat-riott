import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, senha } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return Response.json({ error: "Senha inválida" }, { status: 401 });
    }

    // 🔥 CRIA TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        tipo: user.tipo_usuario
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({
      message: "Login realizado",
      token
    });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
