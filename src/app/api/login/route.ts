import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { email, senha } = body;

    // 🔍 verifica se usuário existe
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return Response.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    return Response.json(
      { message: "Login realizado com sucesso", user },
      { status: 200 }
    );

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
