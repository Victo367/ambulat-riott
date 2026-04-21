import { connectDB } from "@/lib/db";
import Paciente from "@/models/Paciente";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);
    if (!user) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (user.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const pacientes = await Paciente.find().select("-senha");
    return Response.json(pacientes, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
