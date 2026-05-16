import { mkdir, writeFile } from "fs/promises";
import path from "path";
import Conteudo from "@/models/Conteudo";
import { slugify } from "@/lib/conteudo-utils";

export async function gerarSlugUnico(title: string) {
  const base = slugify(title) || "artigo";
  let slug = base;
  let sufixo = 1;

  while (await Conteudo.findOne({ slug }).lean()) {
    slug = `${base}-${sufixo}`;
    sufixo += 1;
  }

  return slug;
}

export async function salvarImagemConteudo(file: File, slug: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const nomeSeguro = `${Date.now()}-${slug}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "conteudo");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, nomeSeguro), buffer);

  return `/uploads/conteudo/${nomeSeguro}`;
}
