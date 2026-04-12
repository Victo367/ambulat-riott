import { connectDB } from "@/lib/db";
import Paciente from "@/models/Paciente";
import Funcionario from "@/models/Funcionario";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req: Request) {
  try {
    await connectDB();

    const loggedUser = getUserFromRequest(req);

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

    let user;

    if (body.tipo_usuario === "paciente") {
      user = await Paciente.create(body);
    } else if (body.tipo_usuario === "funcionario") {
      user = await Funcionario.create(body);
    } else {
      return Response.json(
        { error: "Tipo de usuário inválido" },
        { status: 400 }
      );
    }

    // 🔥 remove senha da resposta
    const userObj = user.toObject();
    delete userObj.senha;

    return Response.json(userObj, { status: 201 });

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
