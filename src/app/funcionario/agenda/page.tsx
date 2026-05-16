"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PlusIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon // <-- Adicionado o ícone da sidebar
} from "@heroicons/react/24/outline";

export default function AgendaFuncionario() {
  const router = useRouter();

  // Lista de horários
  const horarios = [
    { hora: "08:00", paciente: "Marcos Eduardo", tipo: "Consulta Inicial", status: "Confirmado" },
    { hora: "09:30", paciente: "Ana Clara", tipo: "Retorno", status: "Confirmado" },
    { hora: "11:00", paciente: "João Pedro", tipo: "Avaliação", status: "Cancelado" },
    { hora: "14:00", paciente: "Fernanda Lima", tipo: "Consulta", status: "Confirmado" },
    { hora: "15:00", paciente: "Lucas Almeida", tipo: "Avaliação", status: "Pendente" },
    { hora: "16:00", paciente: "Carlos Henrique", tipo: "Retorno", status: "Cancelado" },
  ];

  // Cálculos dinâmicos para os cards de resumo
  const totalAgendamentos = horarios.length;
  const confirmados = horarios.filter((h) => h.status === "Confirmado").length;
  const cancelados = horarios.filter((h) => h.status === "Cancelado").length;

  // Data atual formatada (Ex: "Segunda-feira, 28 de Abril de 2026")
  const dataHoje = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Função para definir o estilo das etiquetas (badges) de status
  function getStatusStyle(status: string) {
    switch (status) {
      case "Confirmado":
        return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
      case "Pendente":
        return "bg-amber-50 text-amber-600 border-amber-200/50";
      case "Cancelado":
        return "bg-rose-50 text-rose-600 border-rose-200/50";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/50";
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
          
          {/* NOVO ÍCONE PADRONIZADO DA SIDEBAR */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 shadow-sm shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Agenda da Unidade
            </h1>
            <p className="text-sm text-slate-500 capitalize mt-0.5 font-medium">
              {dataHoje}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/funcionario/agenda/novo`)}
          className="bg-cyan-600 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md shadow-cyan-600/20 hover:bg-cyan-700 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Agendamento
        </button>
      </header>

      {/* CARDS DE RESUMO (BENTO STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card: Total */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.01)] border border-slate-100 p-6 flex items-center gap-5">
          <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-2xl">
            <CalendarDaysIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total do Dia</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{totalAgendamentos}</h2>
          </div>
        </div>

        {/* Card: Confirmados */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.01)] border border-slate-100 p-6 flex items-center gap-5">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircleIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmados</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{confirmados}</h2>
          </div>
        </div>

        {/* Card: Cancelados/Pendentes (Mudei para Cancelados para usar as 3 cores) */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.01)] border border-slate-100 p-6 flex items-center gap-5">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
            <XCircleIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cancelados</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{cancelados}</h2>
          </div>
        </div>

      </div>

      {/* ÁREA DA TABELA */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        
        {/* Título da Tabela */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
          <UserIcon className="w-5 h-5 text-cyan-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Lista de Pacientes
          </h2>
        </div>

        {/* Container para rolagem horizontal em telas pequenas */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-8 py-4">Horário</th>
                <th className="px-8 py-4">Paciente</th>
                <th className="px-8 py-4">Procedimento / Tipo</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {horarios.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50/80 transition-colors duration-150 group"
                >
                  {/* Coluna: Horário */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {item.hora}
                    </span>
                  </td>

                  {/* Coluna: Paciente */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {item.paciente}
                    </span>
                  </td>

                  {/* Coluna: Tipo */}
                  <td className="px-8 py-5 whitespace-nowrap text-slate-500 font-medium">
                    {item.tipo}
                  </td>

                  {/* Coluna: Status */}
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs rounded-full font-bold border ${getStatusStyle(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Coluna: Ações */}
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <button onClick={() => router.push('/funcionario/agenda/detalhes')} className="text-cyan-600 font-semibold hover:text-cyan-800 text-sm cursor-pointer hover:underline transition-all">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}