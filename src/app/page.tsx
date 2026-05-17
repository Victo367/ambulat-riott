"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GuiaCard from "@/components/GuiaCard";
import { SparklesIcon } from "@heroicons/react/24/outline";

type MateriaProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
};

export default function Home() {
  const router = useRouter();
  const [artigos, setArtigos] = useState<MateriaProps[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarArtigos() {
      try {
        const response = await fetch("/api/conteudo");
        if (response.ok) {
          const data = await response.json();
          setArtigos(data);
        }
      } catch (error) {
        console.error("Erro ao carregar artigos:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarArtigos();
  }, []);

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in pb-12">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-white p-4 sm:p-6 lg:p-8 rounded-[24px] sm:rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-100 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-700 uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4 text-cyan-600" />
            Saúde Integral e Acolhimento
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Ambulatório TT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-700">
              Marcela Prado
            </span>
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-2xl">
            Integrado à rede hospitalar do Governo da Paraíba no Hospital de Emergência e Trauma Dom
            Luiz Gonzaga Fernandes, em Campina Grande. Nosso propósito é oferecer atenção básica
            humanizada e especializada para a comunidade de travestis e transexuais.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3">
            <button
              onClick={() => router.push("/paciente/agenda/novo")}
              className="w-full sm:w-auto bg-cyan-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-md shadow-cyan-600/10 hover:bg-cyan-700 transition cursor-pointer text-center"
            >
              Agendar Atendimento
            </button>
            <button
              onClick={() => router.push("/especialidades")}
              className="border border-slate-200 text-slate-600 text-sm font-semibold px-5 py-3 rounded-xl hover:bg-slate-50 transition cursor-pointer w-full sm:w-auto text-center"
            >
              Conhecer Especialidades
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
          <Image
            src="/ambulatorio.jpg"
            alt="Ambulatório"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        </div>
      </section>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Guias e Serviços Informativos
          </h2>
          <p className="text-xs text-slate-400">
            Clique nos cards para expandir as diretrizes de saúde e direitos.
          </p>
        </div>

        {carregando ? (
          <p className="text-sm text-slate-400 py-8 text-center">Carregando guias...</p>
        ) : artigos.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">
            Nenhum guia publicado no momento.
          </p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artigos.map((artigo) => (
              <GuiaCard
                key={artigo.id}
                title={artigo.title}
                description={artigo.description}
                image={artigo.image}
                slug={artigo.slug}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
