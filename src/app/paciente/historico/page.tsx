"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  BeakerIcon
} from "@heroicons/react/24/outline";

// Tipagem para os itens do histórico atualizada
interface ItemHistorico {
  id: string;
  data: string;
  ano: string;
  especialidade: string;
  medico: string;
  tipo: "Consulta" | "Exame" | "Retorno";
  diagnostico: string;
  terapia?: {
    dosagem_hormonio?: string;
    bloqueador_hormonal?: string;
    status_mudanca: "Dosagem Reduzida" | "Nova Prescrição" | "Dosagem Aumentada" | "Em Uso Contínuo";
  };
}

export default function HistoricoPaciente() {
  const [busca, setBusca] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("todos");

  // Mock de histórico: Agora TODAS as consultas mostram o que a paciente estava tomando na data
  const historicoCompleto: ItemHistorico[] = [
    {
      id: "1",
      data: "12 de Abril",
      ano: "2026",
      especialidade: "Nutrição",
      medico: "Dra. Marcela Costa",
      tipo: "Consulta",
      diagnostico: "Plano alimentar adaptado para rotina de treinos e ajuste metabólico inicial.",
      terapia: {
        dosagem_hormonio: "2mg Valerato de Estradiol / dia",
        bloqueador_hormonal: "25mg Espironolactona / dia",
        status_mudanca: "Em Uso Contínuo", // Aqui a dosagem só foi mantida
      }
    },
    {
      id: "2",
      data: "10 de Fevereiro",
      ano: "2026",
      especialidade: "Terapia Hormonal",
      medico: "Dra. Ana Silveira",
      tipo: "Retorno",
      diagnostico: "Exames de sangue mostram testosterona bem suprimida. Paciente relata leve fadiga. Decidimos reduzir novamente o bloqueador para encontrar a dose mínima efetiva.",
      terapia: {
        dosagem_hormonio: "2mg Valerato de Estradiol / dia",
        bloqueador_hormonal: "25mg Espironolactona / dia",
        status_mudanca: "Dosagem Reduzida", // Aqui houve uma alteração
      }
    },
    {
      id: "3",
      data: "15 de Novembro",
      ano: "2025",
      especialidade: "Terapia Hormonal",
      medico: "Dra. Ana Silveira",
      tipo: "Retorno",
      diagnostico: "Níveis hormonais estabilizando. Paciente se queixou de muita vontade de urinar e leve tontura postural. Bloqueador foi reduzido pela metade.",
      terapia: {
        dosagem_hormonio: "2mg Valerato de Estradiol / dia",
        bloqueador_hormonal: "50mg Espironolactona / dia",
        status_mudanca: "Dosagem Reduzida", // Alteração
      }
    },
    {
      id: "4",
      data: "10 de Agosto",
      ano: "2025",
      especialidade: "Terapia Hormonal",
      medico: "Dra. Ana Silveira",
      tipo: "Consulta",
      diagnostico: "Início do protocolo de terapia hormonal. Exames hepáticos e renais normais. Prescrita dosagem padrão inicial para supressão androgênica.",
      terapia: {
        dosagem_hormonio: "2mg Valerato de Estradiol / dia",
        bloqueador_hormonal: "100mg Espironolactona / dia",
        status_mudanca: "Nova Prescrição", // Criação
      }
    }
  ];

  // Lógica de filtragem dinâmica
  const historicoFiltrado = historicoCompleto.filter((item) => {
    const correspondeBusca = 
      item.medico.toLowerCase().includes(busca.toLowerCase()) || 
      item.diagnostico.toLowerCase().includes(busca.toLowerCase()) ||
      item.especialidade.toLowerCase().includes(busca.toLowerCase());

    const correspondeFiltro = 
      filtroEspecialidade === "todos" || item.especialidade === filtroEspecialidade;

    return correspondeBusca && correspondeFiltro;
  });

  const labelFiltroClass = "text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1";

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto mt-8 px-4 sm:px-0">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 shadow-sm shrink-0">
            <ClipboardDocumentListIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Meu Histórico Médico
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Consulte prontuários passados, diagnósticos e evoluções clínicas
            </p>
          </div>
        </div>
      </header>

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label className={labelFiltroClass}>Buscar no histórico</label>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Busque por médico, diagnóstico, palavra-chave..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className={labelFiltroClass}>
            <span className="flex items-center gap-1.5">
              <FunnelIcon className="w-3.5 h-3.5 text-slate-400" /> Especialidade
            </span>
          </label>
          <select
            value={filtroEspecialidade}
            onChange={(e) => setFiltroEspecialidade(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all appearance-none"
          >
            <option value="todos">Todas as especialidades</option>
            <option value="Clínico Geral">Clínico Geral</option>
            <option value="Acompanhamento Psicológico">Psicologia</option>
            <option value="Terapia Hormonal">Terapia Hormonal</option>
            <option value="Nutrição">Nutrição</option>
          </select>
        </div>
      </div>

      {/* CRONOLOGIA / TIMELINE */}
      <div className="space-y-6">
        {historicoFiltrado.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center text-slate-500 font-medium">
            Nenhum registro encontrado para os filtros aplicados.
          </div>
        ) : (
          historicoFiltrado.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-[32px] shadow-[0_4px_25px_rgba(0,0,0,0.01)] border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden"
            >
              {/* Linha vertical de timeline no mobile */}
              <div className="absolute left-12 top-24 bottom-0 w-[2px] bg-slate-50 hidden md:block" />

              {/* Data lateral esquerda */}
              <div className="flex md:flex-col items-center justify-start gap-2 md:w-32 shrink-0 md:border-r border-slate-100 md:pr-6 z-10 bg-white">
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                  <CalendarDaysIcon className="w-6 h-6" />
                </div>
                <div className="text-left md:text-center mt-1">
                  <p className="text-sm font-black text-slate-900 whitespace-nowrap">{item.data}</p>
                  <p className="text-xs text-slate-400 font-bold">{item.ano}</p>
                </div>
              </div>

              {/* Informações centrais da Consulta */}
              <div className="flex-1 space-y-5 w-full z-10">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-black tracking-wider text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full uppercase">
                      {item.especialidade}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                      {item.tipo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 font-bold text-base mt-3">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>{item.medico}</span>
                  </div>
                </div>

                {/* Texto do Diagnóstico / Evolução */}
                <div className="bg-slate-50/70 border border-slate-100/50 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Evolução Clínica / Resumo
                  </h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {item.diagnostico}
                  </p>
                </div>

                {/* BLOCO CONDICIONAL: Histórico de Terapia Hormonal */}
                {item.terapia && (
                  <div className={`border rounded-2xl p-5 mt-4 ${
                    item.terapia.status_mudanca === "Em Uso Contínuo" 
                      ? "bg-slate-50 border-slate-200" // Cor neutra para quando não há mudança
                      : "bg-cyan-50/50 border-cyan-100" // Cor ciano para quando há nova prescrição/redução
                  }`}>
                    <div className="flex items-start sm:items-center justify-between gap-4 mb-4 flex-col sm:flex-row">
                      <div className={`flex items-center gap-2 font-bold ${
                        item.terapia.status_mudanca === "Em Uso Contínuo" ? "text-slate-600" : "text-cyan-700"
                      }`}>
                        <BeakerIcon className="w-5 h-5" />
                        <h4 className="text-sm">
                          {item.terapia.status_mudanca === "Em Uso Contínuo" 
                            ? "Terapia Hormonal Atual" 
                            : "Prescrição Atualizada"}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider bg-white border px-2.5 py-1 rounded-md shadow-sm ${
                        item.terapia.status_mudanca === "Em Uso Contínuo" 
                          ? "border-slate-200 text-slate-500" 
                          : "border-cyan-200 text-cyan-600"
                      }`}>
                        {item.terapia.status_mudanca}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {item.terapia.dosagem_hormonio && (
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${
                            item.terapia.status_mudanca === "Em Uso Contínuo" ? "bg-slate-400" : "bg-cyan-400"
                          }`}></div>
                          <p className="text-sm font-medium text-slate-700">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mr-2">Dosagem:</span>
                            {item.terapia.dosagem_hormonio}
                          </p>
                        </div>
                      )}
                      
                      {item.terapia.bloqueador_hormonal && (
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${
                            item.terapia.status_mudanca === "Em Uso Contínuo" ? "bg-slate-400" : "bg-cyan-400"
                          }`}></div>
                          <p className="text-sm font-medium text-slate-700">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mr-2">Bloqueador:</span>
                            {item.terapia.bloqueador_hormonal}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}