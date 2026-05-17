import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Funcionario from "@/models/Funcionario";
import { filtrarFuncionariosPorEspecialidade } from "@/lib/agendamentos-utils";

export async function GET(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const especialidade = searchParams.get("especialidade")?.toLowerCase().trim() || "";

    let funcionarios = await Funcionario.find({
      status: { $ne: "inativo" },
    })
      .select("nome cargo especialidades")
      .sort({ nome: 1 })
      .lean();

    if (especialidade) {
      funcionarios = filtrarFuncionariosPorEspecialidade(
        funcionarios as Array<{
          _id: unknown;
          nome: string;
          cargo?: string;
          especialidades?: string[];
        }>,
        especialidade
      );
    }

    const resultado = funcionarios.map((f) => ({
      id: String(f._id),
      nome: f.cargo ? `${f.nome} (${f.cargo})` : f.nome,
    }));

    return Response.json(resultado, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return Response.json({ error: message }, { status: 500 });
  }
}
