import { connectDB } from "@/lib/db";
import Paciente from "@/models/Paciente";
import Funcionario from "@/models/Funcionario";

export async function POST(req: Request) {
  try {
    await connectDB();

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

    return Response.json(user, { status: 201 });

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
