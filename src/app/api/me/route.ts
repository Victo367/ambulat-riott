import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();

    if (!loggedUser) {
      return Response.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const user = await User.findById(loggedUser.id).select("-senha -__v");

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return Response.json(user);

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
