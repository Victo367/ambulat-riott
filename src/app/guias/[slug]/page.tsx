"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon, BookOpenIcon } from "@heroicons/react/24/outline";

type MateriaProps = {
  title: string;
  content: string;
  image: string;
};

export default function LerGuia() {
  const params = useParams();
  const router = useRouter();
  const [materia, setMateria] = useState<MateriaProps | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarMateriaPorSlug() {
      try {
        // O seu backend precisa ter uma rota que busque pela slug!
        const response = await fetch(
          `/api/conteudo/slug/${encodeURIComponent(String(params.slug))}`
        );
        if (response.ok) {
          const data = await response.json();
          setMateria(data);
        }
      } catch (error) {
        console.error("Erro ao buscar matéria:", error);
      } finally {
        setCarregando(false);
      }
    }

    if (params.slug) {
      buscarMateriaPorSlug();
    }
  }, [params.slug]);

  if (carregando) return <div className="text-center py-20 text-slate-400 font-medium">Carregando conteúdo do servidor...</div>;

  if (!materia) {
    return (
      <div className="text-center py-20 space-y-4 max-w-md mx-auto px-4">
        <h1 className="text-xl font-bold text-slate-800">Artigo não encontrado</h1>
        <button onClick={() => router.push("/")} className="text-sm text-cyan-600 font-bold underline cursor-pointer">Voltar para a Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 animate-fade-in pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-700 transition-colors cursor-pointer group">
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> VOLTAR
      </button>

      {materia.image && (
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
          <Image src={materia.image} alt={materia.title} fill className="object-cover" />
        </div>
      )}

      <article className="bg-white p-6 md:p-10 rounded-2xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] space-y-6">
        <div className="flex items-center gap-2 text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full w-fit text-[11px] font-bold uppercase tracking-wider">
          <BookOpenIcon className="w-3.5 h-3.5" /> Guia Informativo de Saúde
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
          {materia.title}
        </h1>

        <div className="text-slate-600 text-base leading-relaxed font-medium whitespace-pre-line pt-2">
          {materia.content}
        </div>
      </article>
    </div>
  );
}