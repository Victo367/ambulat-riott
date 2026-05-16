"use client";

import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon // <-- Ícone importado da Sidebar
} from "@heroicons/react/24/outline";

export default function AgendaPaciente() {
  const router = useRouter();

  // Mock da próxima consulta (Destaque)
  const proximaConsulta = {
    id: "1",
    data: "05 de Março de 2026",
    diaSemana: "Quinta-feira",
    hora: "14:30",
    medico: "Dra. Ana Silveira",
    especialidade: "Terapia Hormonal",
    local: "Ambulatório TT - Sala 04",
    status: "Confirmado",
  };

  // Mock da lista de outras consultas
  const historicoConsultas = [
    {
      id: "2",
      data: "17/03/2026",
      hora: "09:00",
      medico: "Dr. Carlos Mendes",
      especialidade: "Acompanhamento Psicológico",
      status: "Realizado",
    },
    {
      id: "3",
      data: "10/02/2026",
      hora: "15:00",
      medico: "Dra. Ana Silveira",
      especialidade: "Terapia Hormonal",
      status: "Realizado",
    },
    {
      id: "4",
      data: "15/01/2026",
      hora: "10:30",
      medico: "Dr. João Batista",
      especialidade: "Clínico Geral",
      status: "Realizado",
    },
  ];

  // Função de estilo para as tags de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmado":
      case "Agendado":
        return "bg-cyan-50 text-cyan-600 border-cyan-200/50";
      case "Realizado":
        return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
      case "Cancelado":
        return "bg-rose-50 text-rose-600 border-rose-200/50";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/50";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto mt-8 px-4 sm:px-0">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
          {/* NOVO ÍCONE PADRONIZADO DA SIDEBAR */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 shadow-sm shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Minha Agenda
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Acompanhe suas consultas e retornos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/paciente/agenda/novo`)}
          className="bg-cyan-600 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <PlusIcon className="w-5 h-5" />
          Agendar Consulta
        </button>
      </header>

      {/* DESTAQUE: PRÓXIMA CONSULTA */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">
          Sua Próxima Consulta
        </h2>
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden relative">
          
          {/* Detalhe visual (faixa lateral azul) */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-cyan-500"></div>

          <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 pl-10">
            
            {/* Bloco de Data e Hora */}
            <div className="flex items-center gap-6 md:pr-8 md:border-r border-slate-100">
              <div className="bg-cyan-50 text-cyan-600 w-16 h-16 flex flex-col items-center justify-center rounded-2xl shrink-0">
                <span className="text-2xl font-black">{proximaConsulta.data.split(" ")[0]}</span>
                <span className="text-[10px] font-bold uppercase">{proximaConsulta.data.split(" ")[2].substring(0, 3)}</span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{proximaConsulta.diaSemana}</p>
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xl">
                  <ClockIcon className="w-6 h-6 text-cyan-500" />
                  {proximaConsulta.hora}
                </div>
              </div>
            </div>

            {/* Bloco de Detalhes (Médico e Local) */}
            <div className="flex-1 space-y-3">
              <div>
                <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border mb-2 ${getStatusBadge(proximaConsulta.status)}`}>
                  {proximaConsulta.status}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {proximaConsulta.especialidade}
                </h3>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                  <UserIcon className="w-4 h-4" />
                  <span className="font-medium text-sm">{proximaConsulta.medico}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPinIcon className="w-4 h-4" />
                <span>{proximaConsulta.local}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
              <button onClick={() => router.push('/paciente/agenda/remarcar')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm">
                Remarcar
              </button>
              <button className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-6 py-3 rounded-2xl text-sm font-bold transition-all">
                Cancelar
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* LISTA DE CONSULTAS FUTURAS / HISTÓRICO */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">
          Outros Agendamentos e Histórico
        </h2>
        
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {historicoConsultas.map((consulta) => (
              <div 
                key={consulta.id} 
                className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <CalendarDaysIcon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {consulta.especialidade}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="font-medium">{consulta.data} às {consulta.hora}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                      <span className="hidden sm:inline">{consulta.medico}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                  <span className={`px-3 py-1 text-xs rounded-full font-bold border ${getStatusBadge(consulta.status)}`}>
                    {consulta.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}