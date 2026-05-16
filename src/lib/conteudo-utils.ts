export type ConteudoSerializado = {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  slug: string;
};

export function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function serializeConteudo(doc: Record<string, unknown>): ConteudoSerializado {
  return {
    id: String(doc._id),
    title: String(doc.title || ""),
    description: String(doc.description || ""),
    content: String(doc.content || ""),
    image: String(doc.image || ""),
    slug: String(doc.slug || ""),
  };
}
