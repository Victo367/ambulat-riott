export type ErrorKind =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NETWORK"
  | "DATABASE"
  | "CHUNK_LOAD"
  | "SERVER"
  | "COMPONENT"
  | "UNKNOWN";

export type ErrorContent = {
  code: string;
  title: string;
  description: string;
  why: string;
  suggestions: string[];
  primaryLabel: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};
