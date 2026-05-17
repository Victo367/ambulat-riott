import Conteudo from "@/models/Conteudo";
import ConteudoImagem from "@/models/ConteudoImagem";
import { connectDB } from "@/lib/db";
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
  await connectDB();

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const nomeSeguro = `${Date.now()}-${slug}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;

  const imagem = await ConteudoImagem.create({
    data: buffer,
    contentType,
    filename: nomeSeguro,
  });

  return `/api/conteudo/imagem/${imagem._id.toString()}`;
}
