/** Remove não dígitos e limita a 11 caracteres. */
export function somenteDigitosCpf(s: string): string {
  return s.replace(/\D/g, "").slice(0, 11);
}

/** Formata como 000.000.000-00 a partir dos dígitos. */
export function formatarCpf(digitsOuTexto: string): string {
  const d = somenteDigitosCpf(digitsOuTexto);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) {
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  }
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}
