import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const { email, senha } = await req.json();

  const user = await User.findOne({ email }).lean();

  if (!user) {
    return Response.json({ error: "Usuário não encontrado" }, { status: 401 });
  }

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    return Response.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const token = generateToken({
    id: user._id.toString(),
    tipo: user.tipo_usuario
  });
 
  return Response.json({ token });
}
