import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { buildUserUpdateData } from "@/lib/update-user";
import Paciente from "@/models/Paciente";
import Funcionario from "@/models/Funcionario";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // Adicione Promise aqui
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const loggedUser = await getUserFromRequest();

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

    const base = await User.findById(id).select("-senha").lean();

    if (!base) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const Model =
      base.tipo_usuario === "paciente" ? Paciente : Funcionario;

    const user =
      (await Model.findById(id).select("-senha").lean()) ?? base;

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

    const { id } = await context.params;
    const body = await req.json();

    const loggedUser = await getUserFromRequest();

    if (!loggedUser) {
      return Response.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    if (loggedUser.tipo !== "funcionario") {
      return Response.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const updatePayload = await buildUserUpdateData(id, body);

    if (!updatePayload.ok) {
      return Response.json(
        updatePayload.data,
        { status: updatePayload.status }
      );
    }

    const existingUser = await User.findById(id).select("tipo_usuario");

    if (!existingUser) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const Model =
      existingUser.tipo_usuario === "paciente"
        ? Paciente
        : Funcionario;

    const user = await Model.findByIdAndUpdate(
      id,
      { $set: updatePayload.data },
      {
        new: true,
        runValidators: true
      }
    ).select("-senha");

    return Response.json(user);

  } catch (error: any) {
    if (error?.code === 11000) {
      return Response.json(
        { error: "E-mail já cadastrado" },
        { status: 409 }
      );
    }

    return Response.json(
      { error: error.message || "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = await context.params;

    const loggedUser = await getUserFromRequest();

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
