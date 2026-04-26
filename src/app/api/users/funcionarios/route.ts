import { connectDB } from "@/lib/db";
import Funcionario from "@/models/Funcionario";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (loggedUser.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const funcionarios = await Funcionario.find().select("-senha");
    const funcionariosComEdicao = funcionarios.map((funcionario) => ({
      ...funcionario.toObject(),
      canEdit: true,
      editEndpoint: `/api/users/${funcionario._id}`,
    }));
    return Response.json(funcionariosComEdicao, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
