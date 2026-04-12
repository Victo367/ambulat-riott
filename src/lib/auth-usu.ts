import { jwtDecode } from "jwt-decode";

export type TokenPayload = {
    id: string;
    tipo: "paciente" | "funcionario";
};
export function getUserFromToken(): TokenPayload | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded;
    } catch {
        return null;
    }
}