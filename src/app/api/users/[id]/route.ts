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
    console.log("USER:", loggedUser);

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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ AQUI
    const body = await req.json();

    const loggedUser = getUserFromRequest(req);

    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (loggedUser.tipo !== "funcionario") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const allowedFields = ["nome", "email", "status"];

    const updateData: any = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: "Nenhum campo válido para atualizar" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        returnDocument: "after"
      }
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

    const { id } = await context.params;

    const loggedUser = getUserFromRequest(req);
    console.log("USER:", loggedUser);

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
