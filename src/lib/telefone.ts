/** Remove não dígitos; telefone BR costuma ter até 11 (DDD + número). */
export function somenteDigitosTelefone(s: string): string {
  return s.replace(/\D/g, "").slice(0, 11);
}

/**
 * Formata como (XX) XXXX-XXXX (10 dígitos) ou (XX) XXXXX-XXXX (11 dígitos).
 */
export function formatarTelefone(digitsOuTexto: string): string {
  const d = somenteDigitosTelefone(digitsOuTexto);
  if (d.length === 0) return "";
  if (d.length === 1) return `(${d}`;
  if (d.length === 2) return `(${d})`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
