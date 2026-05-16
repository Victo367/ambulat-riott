import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Funcionario from "@/models/Funcionario";
import { ESPECIALIDADE_CARGO } from "@/lib/agendamentos";

export async function GET(req: Request) {
  try {
    await connectDB();

    const loggedUser = await getUserFromRequest();
    if (!loggedUser) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const especialidade = searchParams.get("especialidade")?.toLowerCase() || "";

    let funcionarios = await Funcionario.find({ status: "ativo" })
      .select("nome cargo")
      .lean();

    if (especialidade && ESPECIALIDADE_CARGO[especialidade]) {
      const termos = ESPECIALIDADE_CARGO[especialidade];
      funcionarios = funcionarios.filter((f) => {
        const cargo = (f.cargo || "").toLowerCase();
        return termos.some((termo) => cargo.includes(termo));
      });
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
