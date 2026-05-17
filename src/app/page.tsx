"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ConteudoCoverImage from "@/components/ConteudoCoverImage";
import { 
  ArrowUpRightIcon, 
  BookOpenIcon, 
  IdentificationIcon, 
  ShieldCheckIcon,
  SparklesIcon 
} from "@heroicons/react/24/outline";

type MateriaProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
};

export default function Home() {
  const router = useRouter();
  
  // Estados para gerenciar os artigos vindos do backend
  const [artigosDinamicos, setArtigosDinamicos] = useState<MateriaProps[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os artigos novos assim que a página carrega
  useEffect(() => {
    async function carregarArtigos() {
      try {
        const response = await fetch("/api/conteudo");
        if (response.ok) {
          const data = await response.json();
          setArtigosDinamicos(data);
        }
      } catch (error) {
        console.error("Erro ao carregar artigos dinâmicos:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarArtigos();
  }, []);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      
      {/* SEÇÃO HERO (ASSIMÉTRICA) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-100 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-700 uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4 text-cyan-600" />
            Saúde Integral e Acolhimento
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Ambulatório TT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-700">
              Marcela Prado
            </span>
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-2xl">
            Integrado à rede hospitalar do Governo da Paraíba no Hospital de Emergência e Trauma Dom Luiz Gonzaga Fernandes, em Campina Grande. Nosso propósito é oferecer atenção básica humanizada e especializada para a comunidade de travestis e transexuais.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => router.push('/paciente/agenda/novo')} 
              className="bg-cyan-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-md shadow-cyan-600/10 hover:bg-cyan-700 transition cursor-pointer"
            >
              Agendar Atendimento
            </button>
            <button 
              onClick={() => router.push('/especialidades')} 
              className="border border-slate-200 text-slate-600 text-sm font-semibold px-5 py-3 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              Conhecer Especialidades
            </button>
          </div>
        </div>
        
        {/* Banner com clipping moderno */}
        <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
          <Image
            src="/ambulatorio.jpg"
            alt="Ambulatório"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* GRID BENTO DE INFORMAÇÕES */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Guias e Serviços Informativos</h2>
          <p className="text-xs text-slate-400">Clique nos cards para expandir as diretrizes de saúde e direitos.</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* ========================================= */}
          {/* CARDS FIXOS / PADRÃO DA PÁGINA            */}
          {/* ========================================= */}
          
          {/* CARD 1: TERAPIA HORMONAL */}
          <div 
            onClick={() => router.push('/guias/terapia-hormonal')}
            className="md:col-span-2 group bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-cyan-200/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors flex items-center gap-2">
                  Terapia hormonal segura 
                  <ArrowUpRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  A jornada da terapia hormonal para pessoas trans é altamente monitorada e segura, focando integralmente na melhoria da qualidade de vida, bem-estar psicossocial e na afirmação de gênero saudável.
                </p>
              </div>
              <div className="w-full md:w-44 h-32 relative rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                <Image src="/th.jpg" alt="Hormonoterapia" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* CARD 2: TRANSGENERIDADE */}
          <div 
            onClick={() => router.push('/guias/identidade')}
            className="group bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-cyan-200/50 transition-all duration-300 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl w-fit">
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                Conceito & Identidade
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A transgeneridade compreende indivíduos cuja identidade difere do sexo atribuído ao nascer. O suporte clínico individualizado é um pilar essencial desse processo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
              <span>Ler artigo completo</span>
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>

          {/* CARD 3: RETIFICAÇÃO DE NOME E GÊNERO */}
          <div 
            onClick={() => router.push('/guias/retificacao')}
            className="group bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-cyan-200/50 transition-all duration-300 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit">
                <IdentificationIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                Retificação de Nome e Gênero
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Entenda o passo a passo para alteração diretamente no Cartório de Registro Civil. Saiba quais documentos são mandatórios e como proceder diante de pendências.
              </p>
            </div>
            <div className="mt-4 h-24 relative rounded-xl overflow-hidden">
              <Image src="/retificacao.jpg" alt="Documentos" fill className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>

          {/* CARD 4: PROCEDIMENTOS CIRÚRGICOS SUS */}
          <div 
            onClick={() => router.push('/guias/sus')}
            className="md:col-span-2 group bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-cyan-200/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-1 rounded-md w-fit inline-block">Acesso Público</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-cyan-700 transition-colors">
                  Processo Transexualizador no SUS
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  O Sistema Único de Saúde assegura o cuidado integral especializado. Conheça a rede de hormonioterapia, amparo multiprofissional e cirurgias de afirmação regulamentadas.
                </p>
              </div>
              <span className="text-xs text-cyan-600 font-semibold flex items-center gap-1.5 group-hover:underline">
                Ver pré-requisitos e fluxos de atendimento &rarr;
              </span>
            </div>
            <div className="w-full md:w-52 h-full min-h-[140px] relative rounded-2xl overflow-hidden shrink-0 bg-slate-50">
              <Image src="/cirurgia.jpg" alt="Equipe Cirúrgica" fill className="object-cover" />
            </div>
          </div>

          {/* ========================================= */}
          {/* CARDS DINÂMICOS (VINDOS DO BANCO DE DADOS)  */}
          {/* ========================================= */}
          
          {artigosDinamicos.map((artigo) => (
            <div 
              key={artigo.id}
              onClick={() => router.push(`/guias/${artigo.slug}`)}
              className="group bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-cyan-200/50 transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
                  <BookOpenIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2">
                  {artigo.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {artigo.description}
                </p>
              </div>
              
              {/* Se o artigo tiver imagem, exibe ela aqui em baixo */}
              {artigo.image && (
                <div className="mt-4 h-28 relative rounded-xl overflow-hidden shrink-0">
                  <ConteudoCoverImage
                    src={artigo.image}
                    alt={artigo.title}
                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
                <span>Ler artigo completo</span>
                <ArrowUpRightIcon className="w-4 h-4" />
              </div>
            </div>
          ))}

        </section>
      </div>
    </div>
  );
}