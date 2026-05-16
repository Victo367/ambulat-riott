"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  MapPinIcon,
  InformationCircleIcon // Adicionado para o banner da Terapia
} from "@heroicons/react/24/outline";

export default function DetalhesAgendamento() {
  const router = useRouter();

  // Dados mockados atualizados com a estrutura de Terapia Hormonal
  const agendamento = {
    paciente: "Marcos Eduardo",
    horario: "08:00",
    data: "28 de Abril de 2026",
    tipo: "Consulta Inicial",
    status: "Confirmado",
    profissional: "Dr. João Henrique",
    modalidade: "Presencial",
    observacoes: "Paciente relatou dores constantes na região lombar. Necessário avaliação física detalhada e histórico de exames anteriores.",
    // Dados de terapia puxados automaticamente do cadastro do paciente
    pacienteTerapia: {
      dosagem_hormonio: "2mg Valerato de Estradiol / dia",
      bloqueador_hormonal: "50mg Espironolactona / dia"
    }
  };

  const possuiTerapia = agendamento.pacienteTerapia && 
    (agendamento.pacienteTerapia.dosagem_hormonio || agendamento.pacienteTerapia.bloqueador_hormonal);

  // Estilos para o status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelado":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Detalhes do Agendamento
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              ID do Registro: #88291-A
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/funcionario/agenda/editar')}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Editar
          </button>
        </div>
      </header>

      {/* GRID DE INFORMAÇÕES PRINCIPAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: CARD DO PACIENTE E INFOS GERAIS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* CARD PRINCIPAL */}
          <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8">
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <UserIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{agendamento.paciente}</h2>
                  <p className="text-slate-500 font-medium">{agendamento.tipo}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(agendamento.status)}`}>
                {agendamento.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <CalendarIcon className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data</p>
                  <p className="text-slate-700 font-semibold">{agendamento.data}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <ClockIcon className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Horário</p>
                  <p className="text-slate-700 font-semibold">{agendamento.horario}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <BeakerIcon className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profissional</p>
                  <p className="text-slate-700 font-semibold">{agendamento.profissional}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <MapPinIcon className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Modalidade</p>
                  <p className="text-slate-700 font-semibold">{agendamento.modalidade}</p>
                </div>
              </div>
            </div>

            {/* BANNER DE TERAPIA HORMONAL */}
            {possuiTerapia && (
              <div className="mt-8 bg-cyan-50/50 border border-cyan-100 rounded-[20px] p-6 flex gap-4">
                <InformationCircleIcon className="w-6 h-6 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    Terapia Hormonal em Andamento
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Informações ativas no prontuário do paciente:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-y-2 gap-x-6">
                    {agendamento.pacienteTerapia.dosagem_hormonio && (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span className="text-sm font-medium text-slate-700">
                          <span className="text-slate-500 mr-1">Dosagem:</span> 
                          {agendamento.pacienteTerapia.dosagem_hormonio}
                        </span>
                      </div>
                    )}
                    {agendamento.pacienteTerapia.bloqueador_hormonal && (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span className="text-sm font-medium text-slate-700">
                          <span className="text-slate-500 mr-1">Bloqueador:</span> 
                          {agendamento.pacienteTerapia.bloqueador_hormonal}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CARD DE OBSERVAÇÕES */}
          <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-cyan-600" />
              <h3 className="text-lg font-bold text-slate-900">Observações do Atendimento</h3>
            </div>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {agendamento.observacoes}
            </p>
          </div>
        </div>

        {/* COLUNA DIREITA: TIMELINE OU INFOS ADICIONAIS */}
        <div className="space-y-8">
          <div className="bg-cyan-600 rounded-[32px] p-8 text-white shadow-lg shadow-cyan-600/20">
            <h3 className="text-lg font-bold mb-4">Ações de Status</h3>
            <p className="text-cyan-100 text-sm mb-6">Atualize o andamento do paciente diretamente por aqui.</p>
            
            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl text-sm font-bold transition-all cursor-pointer">
                Check-in realizado
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl text-sm font-bold transition-all cursor-pointer">
                Marcar como Ausente
              </button>
              <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer">
                Cancelar Horário
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-8">
            <h3 className="text-slate-900 font-bold mb-4">Histórico Rápido</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                <p className="text-xs text-slate-500"><b className="text-slate-700">10:45</b> - Agendamento criado por Administrativo</p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                <p className="text-xs text-slate-500"><b className="text-slate-700">11:30</b> - Status alterado para Confirmado</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}