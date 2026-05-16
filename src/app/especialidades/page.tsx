"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon,
  BeakerIcon, 
  HeartIcon, 
  UserGroupIcon, 
  ScaleIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

export default function Especialidades() {
  const router = useRouter();

  const especialidades = [
    {
      id: 1,
      nome: "Terapia Hormonal",
      descricao: "Acompanhamento médico especializado para transição física segura, com prescrição, monitoramento de exames e ajuste de dosagens hormonais.",
      icone: BeakerIcon,
      corIcone: "text-cyan-600",
      bgIcone: "bg-cyan-50",
      borderHover: "hover:border-cyan-200",
    },
    {
      id: 2,
      nome: "Acompanhamento Psicológico",
      descricao: "Espaço de escuta qualificada para suporte emocional, fortalecimento da autoimagem e acompanhamento de saúde mental durante o processo de transição.",
      icone: ChatBubbleLeftRightIcon,
      corIcone: "text-purple-600",
      bgIcone: "bg-purple-50",
      borderHover: "hover:border-purple-200",
    },
    {
      id: 3,
      nome: "Clínico Geral",
      descricao: "Atenção básica à saúde, prevenção de doenças, avaliação de queixas gerais e encaminhamento para outras especialidades médicas quando necessário.",
      icone: HeartIcon,
      corIcone: "text-emerald-600",
      bgIcone: "bg-emerald-50",
      borderHover: "hover:border-emerald-200",
    },
    {
      id: 4,
      nome: "Serviço Social",
      descricao: "Orientação sobre direitos, retificação de nome e gênero, acesso a benefícios e articulação com a rede de proteção social do estado.",
      icone: ScaleIcon,
      corIcone: "text-amber-600",
      bgIcone: "bg-amber-50",
      borderHover: "hover:border-amber-200",
    },
    {
      id: 5,
      nome: "Nutrição Clínica",
      descricao: "Planejamento alimentar focado no bem-estar metabólico, adequação da composição corporal e suporte nutricional durante a hormonoterapia.",
      icone: SparklesIcon,
      corIcone: "text-rose-600",
      bgIcone: "bg-rose-50",
      borderHover: "hover:border-rose-200",
    },
    {
      id: 6,
      nome: "Grupos de Acolhimento",
      descricao: "Encontros coletivos mediados por profissionais para troca de vivências, construção de redes de apoio e fortalecimento comunitário.",
      icone: UserGroupIcon,
      corIcone: "text-indigo-600",
      bgIcone: "bg-indigo-50",
      borderHover: "hover:border-indigo-200",
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto mt-4 px-4 sm:px-0">
      
      {/* BOTÃO DE VOLTAR */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-cyan-700 transition-colors cursor-pointer group w-fit"
      >
        <div className="p-1.5 rounded-full group-hover:bg-cyan-50 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
        </div>
        Voltar para o início
      </button>

      {/* HEADER DA PÁGINA */}
      <header className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Cuidado em <span className="text-cyan-600">todas as frentes</span>
        </h1>
        <p className="text-base text-slate-500 leading-relaxed md:px-12">
          O Ambulatório TT Marcela Prado atua com uma equipe multiprofissional para garantir que a sua saúde seja cuidada de forma integral, respeitosa e especializada. Conheça nossos serviços.
        </p>
      </header>

      {/* GRID DE ESPECIALIDADES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {especialidades.map((esp) => (
          <div 
            key={esp.id}
            className={`bg-white rounded-[28px] border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-xl transition-all duration-300 flex flex-col h-full ${esp.borderHover}`}
          >
            <div className="flex-1">
              <div className={`p-3 rounded-2xl w-fit mb-6 ${esp.bgIcone} ${esp.corIcone}`}>
                <esp.icone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                {esp.nome}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {esp.descricao}
              </p>
            </div>
            
            <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between">
              <button 
                onClick={() => router.push('/paciente/agenda/novo')}
                className="text-sm font-bold text-cyan-600 hover:text-cyan-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Agendar consulta
                <span className="text-lg leading-none">&rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CALL TO ACTION FINAL */}
      <div className="bg-slate-900 rounded-[32px] p-8 md:p-12 text-center mt-12 shadow-2xl relative overflow-hidden">
        {/* Efeito de brilho de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Pronta para iniciar seu acompanhamento?
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Seja para a primeira vez ou para dar continuidade ao seu tratamento, nossa equipe está de braços abertos para receber você.
          </p>
          <button 
            onClick={() => router.push('/paciente/agenda/novo')}
            className="mt-4 bg-cyan-500 text-slate-950 font-bold px-8 py-4 rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            Fazer meu Agendamento Agora
          </button>
        </div>
      </div>

    </div>
  );
}