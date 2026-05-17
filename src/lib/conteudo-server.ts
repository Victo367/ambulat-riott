import Conteudo from "@/models/Conteudo";
import ConteudoImagem from "@/models/ConteudoImagem";
import { connectDB } from "@/lib/db";
import { slugify, type ConteudoSerializado, serializeConteudo } from "@/lib/conteudo-utils";
import { GUIAS_PADRAO, SLUGS_GUIAS_PADRAO } from "@/lib/conteudo-padrao";

/** Garante que os quatro guias da home existam no banco (só cria se o slug ainda não existir). */
export async function ensureConteudoPadrao() {
  await connectDB();

  for (const guia of GUIAS_PADRAO) {
    await Conteudo.findOneAndUpdate(
      { slug: guia.slug },
      {
        $setOnInsert: {
          title: guia.title,
          description: guia.description,
          content: guia.content,
          image: guia.image,
          slug: guia.slug,
        },
      },
      { upsert: true }
    );
  }
}

export function ordenarConteudoHome(
  docs: Array<Record<string, unknown> & { slug?: string; createdAt?: Date }>
): ConteudoSerializado[] {
  const ordem = new Map<string, number>(
    SLUGS_GUIAS_PADRAO.map((slug, i) => [slug, i])
  );

  return [...docs]
    .sort((a, b) => {
      const slugA = String(a.slug || "");
      const slugB = String(b.slug || "");
      const posA = ordem.has(slugA) ? ordem.get(slugA)! : undefined;
      const posB = ordem.has(slugB) ? ordem.get(slugB)! : undefined;

      if (posA !== undefined && posB !== undefined) return posA - posB;
      if (posA !== undefined) return -1;
      if (posB !== undefined) return 1;

      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    })
    .map((doc) => serializeConteudo(doc as Record<string, unknown>));
}

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

export async function salvarImagemConteudo(
  file: Blob & { name?: string; type?: string },
  slug: string
) {
  await connectDB();

  const nomeOriginal = file.name || "imagem.jpg";
  const ext = nomeOriginal.split(".").pop()?.toLowerCase() || "jpg";
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
