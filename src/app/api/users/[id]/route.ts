import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const loggedUser = getUserFromRequest(req);

    if (!loggedUser) {
      return Response.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    if (
      loggedUser.tipo !== "funcionario" &&
      loggedUser.id !== id
    ) {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const user = await User.findById(id).select("-senha");

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

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = context.params;
    const body = await req.json();

    const loggedUser = getUserFromRequest(req);

    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (loggedUser.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    // ✅ WHITELIST (campos permitidos)
    const allowedFields = ["nome", "email", "status"];

    const updateData: any = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-senha");

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

export async function DELETE(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = context.params;

    const loggedUser = getUserFromRequest(req);

    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (loggedUser.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Usuário deletado com sucesso" });

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
