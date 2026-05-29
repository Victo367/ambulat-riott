/** Erro de domínio convertido em resposta HTTP nas rotas de agendamento. */
export class AgendamentoDomainError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
  }
}
