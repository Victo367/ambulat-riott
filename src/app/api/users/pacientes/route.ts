import { connectDB } from "@/lib/db";
import Paciente from "@/models/Paciente";
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

    const pacientes = await Paciente.find().select("-senha");
    const pacientesComEdicao = pacientes.map((paciente) => ({
      ...paciente.toObject(),
      canEdit: true,
      editEndpoint: `/api/users/${paciente._id}`,
    }));
    return Response.json(pacientesComEdicao, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
