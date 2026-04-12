import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Funcionario from "@/models/Funcionario";
import Paciente from "@/models/Paciente";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

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

    const { id } = await context.params;
    const body = await req.json();

    // 🔍 primeiro busca como User
    const baseUser = await User.findById(id);

    if (!baseUser) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    let user;

    // 🧬 escolhe o model correto
    if (baseUser.tipo_usuario === "funcionario") {
      user = await Funcionario.findById(id);
    } else if (baseUser.tipo_usuario === "paciente") {
      user = await Paciente.findById(id);
    } else {
      user = baseUser;
    }

    // 🔥 atualiza corretamente
    Object.assign(user, body);

    await user.save();

    const userSemSenha = user.toObject();
    delete userSemSenha.senha;

    return Response.json(userSemSenha);

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params; // 👈 correção aqui

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Usuário deletado com sucesso" },
      { status: 200 }
    );

  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
