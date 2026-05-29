import { findAgendamentoPopulado } from "@/lib/agendamentos";

type AuthError = { error: string; status: 403 | 404 };
type AuthSuccess = { agendamento: Awaited<ReturnType<typeof findAgendamentoPopulado>> };

export async function obterAgendamentoAutorizado(
  id: string,
  userId: string,
  tipo: string
): Promise<AuthError | AuthSuccess> {
  const agendamento = await findAgendamentoPopulado(id);
  if (!agendamento) {
    return { error: "Agendamento não encontrado", status: 404 };
  }

  if (tipo === "paciente") {
    const paciente = agendamento.paciente as {
      _id?: { toString: () => string };
    };
    if (paciente?._id?.toString() !== userId) {
      return { error: "Acesso negado", status: 403 };
    }
  }

  return { agendamento };
}
