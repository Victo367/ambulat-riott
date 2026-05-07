import { jwtDecode } from "jwt-decode";

export type TokenPayload = {
  id: string;
  tipo: "paciente" | "funcionario";
};

export function getUserFromToken(token?: string): TokenPayload | null {
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}
