import type { ErrorKind } from "./types";

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

export function classifyError(error: Error): ErrorKind {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();
  const combined = `${name} ${message}`;

  if (
    includesAny(combined, [
      "failed to fetch",
      "networkerror",
      "network request failed",
      "load failed",
      "err_internet_disconnected",
      "err_connection_refused",
      "err_connection_reset",
    ])
  ) {
    return "NETWORK";
  }

  if (
    includesAny(combined, [
      "loading chunk",
      "chunkloaderror",
      "failed to load chunk",
      "dynamically imported module",
    ])
  ) {
    return "CHUNK_LOAD";
  }

  if (
    includesAny(combined, [
      "mongodb",
      "mongoose",
      "econnrefused",
      "mongooseserverselectionerror",
      "querySrv",
      "buffering timed out",
      "topology was destroyed",
    ])
  ) {
    return "DATABASE";
  }

  if (
    includesAny(combined, [
      "não autenticado",
      "nao autenticado",
      "unauthorized",
      "jwt",
      "token",
      "sessão",
      "sessao",
      "invalid signature",
    ])
  ) {
    return "UNAUTHORIZED";
  }

  if (
    includesAny(combined, [
      "forbidden",
      "acesso negado",
      "sem permissão",
      "sem permissao",
      "not allowed",
    ])
  ) {
    return "FORBIDDEN";
  }

  if (
    includesAny(combined, [
      "not found",
      "não encontrado",
      "nao encontrado",
      "404",
    ])
  ) {
    return "NOT_FOUND";
  }

  if (
    includesAny(combined, [
      "not a react component",
      "default export",
      "element type is invalid",
      "is not a module",
    ])
  ) {
    return "COMPONENT";
  }

  if (
    includesAny(combined, [
      "internal server error",
      "erro interno",
      "500",
      "digest",
    ])
  ) {
    return "SERVER";
  }

  return "UNKNOWN";
}
