import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { createUserByType } from "@/lib/register-user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();

    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (loggedUser.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await req.json();
    const result = await createUserByType(body, "funcionario");

    return Response.json(result.data, { status: result.status });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
