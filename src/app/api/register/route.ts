import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { createUserByType, parseTipoUsuario } from "@/lib/register-user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();

    // 🔐 precisa estar logado
    if (!loggedUser) {
      return Response.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // 🔒 só funcionário pode cadastrar
    if (loggedUser.tipo !== "funcionario") {
      return Response.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const tipoUsuario = parseTipoUsuario(body);

    if (!tipoUsuario) {
      return Response.json(
        { error: "Tipo de usuário inválido" },
        { status: 400 }
      );
    }

    const result = await createUserByType(body, tipoUsuario);

    return Response.json(result.data, { status: result.status });

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
