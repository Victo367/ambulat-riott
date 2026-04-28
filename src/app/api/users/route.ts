import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();

    if(!loggedUser){
      return Response.json(
        {error: "Não autenticado"},
        {status: 401}
      )
    }

    if (loggedUser.tipo !== "funcionario") {
      return Response.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }
    const users = await User.find().select("-senha");

    return Response.json(users, { status: 200 });

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
