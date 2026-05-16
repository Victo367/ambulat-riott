"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  BeakerIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

// Simulação de dados vindos do banco (Mock)
const pacientesMock = [
  { id: "1", nome: "Marcos Eduardo", dosagem_hormonio: "2mg Valerato de Estradiol / dia", bloqueador_hormonal: "50mg Espironolactona / dia" },
  { id: "2", nome: "Ana Clara", dosagem_hormonio: "", bloqueador_hormonal: "" }, // Sem terapia
  { id: "3", nome: "João Pedro", dosagem_hormonio: "1000mg Undecilato de Testosterona / 12 semanas", bloqueador_hormonal: "" },
];

export default function NovoAgendamento() {
  const router = useRouter();

  // Estado para controlar o paciente selecionado
  const [pacienteId, setPacienteId] = useState("");

  // Busca os dados do paciente selecionado
  const pacienteSelecionado = pacientesMock.find(p => p.id === pacienteId);
  const possuiTerapia = pacienteSelecionado && (pacienteSelecionado.dosagem_hormonio || pacienteSelecionado.bloqueador_hormonal);

  // Classes utilitárias para manter o padrão premium
  const inputClass =
    "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-400 focus:bg-white focus:border-cyan-600 focus:ring-4 focus:ring-cyan-600/10 outline-none transition-all appearance-none";

  const labelClass =
    "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER */}
      <header className="flex items-center gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Novo Agendamento
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Preencha os dados para reservar um horário na agenda
          </p>
        </div>
      </header>

      {/* CARD PRINCIPAL DO FORMULÁRIO */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10 max-w-5xl mx-auto">
        
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* SEÇÃO 1: PESSOAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* SELECIONAR PACIENTE */}
            <div className="space-y-1">
              <label className={labelClass}>Paciente Atendido *</label>
              <div className="relative group">
                <UserIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <select 
                  className={inputClass} 
                  required
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                >
                  <option value="">Selecione o paciente</option>
                  {pacientesMock.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* SELECIONAR MÉDICO */}
            <div className="space-y-1">
              <label className={labelClass}>Profissional Responsável *</label>
              <div className="relative group">
                <BeakerIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <select className={inputClass} required>
                  <option value="">Selecione o médico/especialista</option>
                  <option>Dr. João Henrique (Endocrinologia)</option>
                  <option>Dra. Fernanda Lima (Psicologia)</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* SESSÃO INFORMATIVA CONDICIONAL (Só aparece se o paciente tiver TH) */}
          {possuiTerapia && (
            <div className="bg-cyan-50/50 border border-cyan-100 rounded-[20px] p-6 animate-fade-in flex gap-4">
              <InformationCircleIcon className="w-6 h-6 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  Terapia Hormonal em Andamento
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Informações de protocolo ativas no cadastro deste paciente:
                </p>
                
                <div className="flex flex-col sm:flex-row gap-y-2 gap-x-6">
                  {pacienteSelecionado.dosagem_hormonio && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="text-sm font-medium text-slate-700">
                        <span className="text-slate-500 mr-1">Dosagem:</span> 
                        {pacienteSelecionado.dosagem_hormonio}
                      </span>
                    </div>
                  )}
                  {pacienteSelecionado.bloqueador_hormonal && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="text-sm font-medium text-slate-700">
                        <span className="text-slate-500 mr-1">Bloqueador:</span> 
                        {pacienteSelecionado.bloqueador_hormonal}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 2: DATA E HORA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* DATA */}
            <div className="space-y-1">
              <label className={labelClass}>Data da Consulta *</label>
              <div className="relative group">
                <CalendarIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <input type="date" className={inputClass} required />
              </div>
            </div>

            {/* HORÁRIO */}
            <div className="space-y-1">
              <label className={labelClass}>Horário *</label>
              <div className="relative group">
                <ClockIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <input type="time" className={inputClass} required />
              </div>
            </div>

            {/* STATUS */}
            <div className="space-y-1">
              <label className={labelClass}>Status Inicial</label>
              <div className="relative">
                <select className={`${inputClass} pl-4`}>
                  <option value="confirmado">Confirmado</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* SEÇÃO 3: OBSERVAÇÕES */}
          <div className="space-y-1">
            <label className={labelClass}>Observações Adicionais</label>
            <div className="relative group">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-400 absolute left-4 top-5 group-focus-within:text-cyan-600 transition-colors" />
              <textarea
                rows={4}
                placeholder="Detalhes sobre o encaminhamento ou necessidades específicas..."
                className={`${inputClass} pl-11 resize-none pt-4`}
              />
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Descartar Alterações
            </button>

            <button
              type="submit"
              className="w-full md:w-auto bg-cyan-600 text-white px-12 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 hover:shadow-cyan-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckIcon className="w-5 h-5" />
              Finalizar Agendamento
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}