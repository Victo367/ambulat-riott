import { AgendamentoDomainError } from "./errors";

export function agendamentoErrorResponse(error: unknown) {
  if (error instanceof AgendamentoDomainError) {
    return Response.json(
      {
        error: error.message,
        ...(error.fields ? { fields: error.fields } : {}),
      },
      { status: error.status }
    );
  }

  const message = error instanceof Error ? error.message : "Erro interno";
  return Response.json({ error: message }, { status: 500 });
}
