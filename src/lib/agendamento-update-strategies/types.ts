import type { TokenPayload } from "@/lib/auth";

export type UpdateContext = {
  id: string;
  body: Record<string, unknown>;
  loggedUser: TokenPayload;
};

export interface AgendamentoUpdateStrategy {
  execute(ctx: UpdateContext): Promise<Record<string, unknown>>;
}
