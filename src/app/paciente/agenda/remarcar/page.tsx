"use client";

import { useState } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export default function RemarcarConsulta() {
  const router = useRouter();

  // Dados da consulta atual (em um cenário real viriam via ID da URL ou Estado)
  const consultaAtual = {
    especialidade: "Terapia Hormonal (Endocrinologista)",
    medico: "Dra. Ana Silveira",
    dataAtual: "05/03/2026",
    horaAtual: "14:30"
  };

  // Estados para a NOVA data e horário
  const [novaData, setNovaData] = usePersistedState("novaData", "");
  const [novaHora, setNovaHora] = usePersistedState("novaHora", "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const horariosDisponiveis = ["08:00", "09:00", "10:30", "11:00", "14:00", "15:00", "16:30"];

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!novaData || !novaHora) return;

    setIsSubmitting(true);
    
    // Simulação de Integração com Back-end
    setTimeout(() => {
      alert(`Consulta remarcada para o dia ${novaData} às ${novaHora}`);
      router.push("/paciente/agenda");
    }, 1500);
  }

  const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2";
  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all appearance-none";
  // Estilo para campos bloqueados
  const disabledClass = "w-full bg-slate-100 border border-slate-200 text-slate-400 text-sm rounded-2xl px-4 py-3.5 cursor-not-allowed opacity-70";

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-3xl mx-auto mt-8 px-4 sm:px-0">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Remarcar Consulta
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Selecione um novo momento para o seu atendimento
          </p>
        </div>
      </header>

      {/* AVISO INFORMATIVO */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
        <InformationCircleIcon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800 leading-relaxed">
          Para alterar a <b>especialidade</b> ou o <b>profissional</b>, por favor cancele este agendamento e crie um novo. Na remarcação, apenas a data e hora podem ser ajustadas.
        </p>
      </div>

      {/* FORMULÁRIO */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10">
        <form onSubmit={handleUpdate} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Especialidade (BLOQUEADO) */}
            <div className="md:col-span-2">
              <label className={labelClass}>Especialidade</label>
              <div className={disabledClass}>{consultaAtual.especialidade}</div>
            </div>

            {/* Profissional (BLOQUEADO) */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                <UserIcon className="w-4 h-4" />
                Profissional
              </label>
              <div className={disabledClass}>{consultaAtual.medico}</div>
            </div>

            {/* NOVA DATA */}
            <div>
              <label className={labelClass}>
                <CalendarDaysIcon className="w-4 h-4 text-cyan-600" />
                Nova Data Desejada *
              </label>
              <input 
                type="date" 
                required
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={inputClass}
              />
              <p className="text-[10px] text-slate-400 mt-2 ml-1">
                Data atual: {consultaAtual.dataAtual}
              </p>
            </div>

            {/* NOVOS HORÁRIOS */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                <ClockIcon className="w-4 h-4 text-cyan-600" />
                Selecione o Novo Horário *
              </label>
              
              {!novaData ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-500 font-medium">
                  Escolha uma data para ver os horários disponíveis.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {horariosDisponiveis.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setNovaHora(h)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border cursor-pointer
                        ${novaHora === h 
                          ? 'bg-cyan-600 border-cyan-600 text-white shadow-md shadow-cyan-600/20' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-cyan-600'
                        }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
               <p className="text-[10px] text-slate-400 mt-3 ml-1">
                Horário anterior: {consultaAtual.horaAtual}
              </p>
            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 pt-8 border-t border-slate-100 mt-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Manter Horário Atual
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !novaHora}
              className="w-full md:w-auto bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Atualizando..." : "Confirmar Nova Data"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}