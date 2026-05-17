"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearPageState, usePersistedState } from "@/hooks/usePersistedState";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import AgendamentoErroAlert from "@/components/agendamento/AgendamentoErroAlert";
import { lerMensagemErroAgendamento } from "@/lib/agendamentos-utils";

// Interface para tipar o médico que vem do banco de dados
interface Profissional {
  id: string;
  nome: string;
}

export default function NovoAgendamentoPaciente() {
  const router = useRouter();
  const pathname = usePathname();

  const [especialidade, setEspecialidade] = usePersistedState("especialidade", "");
  const [medico, setMedico] = usePersistedState("medico", "");
  const [data, setData] = usePersistedState("data", "");
  const [hora, setHora] = usePersistedState("hora", "");
  const [observacoes, setObservacoes] = usePersistedState("observacoes", "");
  
  // Estados de controle da API
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loadingProfissionais, setLoadingProfissionais] = useState(false);
  const [erroProfissionais, setErroProfissionais] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroAgendamento, setErroAgendamento] = useState("");
  const [erroConflito, setErroConflito] = useState(false);

  // Mocks de horários disponíveis (Em um sistema completo, estes horários também viriam 
  // de uma API baseada na data e no médico selecionado)
  const horariosDisponiveis = ["08:00", "09:30", "10:00", "13:30", "14:00", "15:30", "16:00"];

  // EFEITO: Sempre que a especialidade mudar, busca os médicos do back-end
  useEffect(() => {
    if (!especialidade) {
      setProfissionais([]);
      return;
    }

    async function buscarProfissionais() {
      setLoadingProfissionais(true);
      setErroProfissionais("");
      try {
        const res = await fetch(
          `/api/profissionais?especialidade=${encodeURIComponent(especialidade)}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erro ao buscar profissionais");
        }

        const dados: Profissional[] = await res.json();
        setProfissionais(dados);
        if (dados.length === 0) {
          setErroProfissionais(
            "Nenhum profissional disponível para esta especialidade no momento."
          );
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        const msg =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar a lista de médicos.";
        setErroProfissionais(msg);
        setProfissionais([]);
      } finally {
        setLoadingProfissionais(false);
      }
    }

    buscarProfissionais();
  }, [especialidade]);

  // Função para lidar com a troca de especialidade
  function handleEspecialidadeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEspecialidade(e.target.value);
    setMedico(""); // Reseta o médico anterior para não enviar ID errado
    setHora("");   // Reseta a hora por segurança
  }

  // Envio dos dados para salvar no banco de dados
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!especialidade || !medico || !data || !hora) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setErroAgendamento("");
    setErroConflito(false);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          especialidade,
          profissionalId: medico,
          data,
          hora,
          observacoes,
        }),
      });

      if (!res.ok) {
        try {
          const data = await res.json();
          if (typeof data?.error === "string") {
            setErroAgendamento(data.error);
            setErroConflito(data?.code === "CONFLITO_HORARIO");
            return;
          }
        } catch {
          // ignora parse
        }
        setErroAgendamento(await lerMensagemErroAgendamento(res));
        setErroConflito(res.status === 409);
        return;
      }

      alert("Consulta agendada com sucesso!");
      clearPageState(pathname);
      router.push("/paciente/agenda");
      router.refresh();
    } catch {
      setErroAgendamento(
        "Erro ao conectar com o servidor. Verifique sua conexão e tente novamente."
      );
      setErroConflito(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Estilos padronizados
  const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2";
  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400 appearance-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-3xl mx-auto mt-8 px-4 sm:px-0">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col sm:flex-row sm:items-center gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Agendar Nova Consulta
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Preencha os dados abaixo para reservar o seu horário
          </p>
        </div>
      </header>

      {/* FORMULÁRIO */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {erroAgendamento && (
            <AgendamentoErroAlert
              mensagem={erroAgendamento}
              variante={erroConflito ? "conflito" : "erro"}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Especialidade */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                Especialidade ou Tipo de Atendimento *
              </label>
              <select 
                value={especialidade}
                onChange={handleEspecialidadeChange}
                className={inputClass}
                required
              >
                <option value="" disabled>Selecione o motivo da consulta</option>
                <option value="clinico">Clínico Geral</option>
                <option value="psicologia">Acompanhamento Psicológico</option>
                <option value="hormonal">Endocrinologista</option>
                <option value="nutricao">Nutricionista</option>
              </select>
            </div>

            {/* Profissional (Dinâmico vindo da API) */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                <UserIcon className="w-4 h-4 text-cyan-600" />
                Profissional de Preferência *
              </label>
              <select 
                value={medico}
                onChange={(e) => setMedico(e.target.value)}
                className={inputClass}
                required
                disabled={!especialidade || loadingProfissionais}
              >
                <option value="" disabled>
                  {loadingProfissionais 
                    ? "Buscando médicos disponíveis..." 
                    : !especialidade 
                      ? "Selecione uma especialidade primeiro" 
                      : "Selecione o profissional disponível"}
                </option>
                
                {/* Renderiza os profissionais reais retornados do banco */}
                {profissionais.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </select>
              {erroProfissionais && (
                <p className="text-xs text-amber-700 font-medium mt-2 ml-1">
                  {erroProfissionais}
                </p>
              )}
            </div>

            {/* Data */}
            <div>
              <label className={labelClass}>
                <CalendarDaysIcon className="w-4 h-4 text-cyan-600" />
                Data Desejada *
              </label>
              <input 
                type="date" 
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={inputClass}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Horários (Condicional à escolha da data) */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                <ClockIcon className="w-4 h-4 text-cyan-600" />
                Horários Disponíveis *
              </label>
              
              {!data ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-500 font-medium">
                  Selecione uma data acima para ver os horários disponíveis.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {horariosDisponiveis.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHora(h)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border cursor-pointer
                        ${hora === h 
                          ? 'bg-cyan-600 border-cyan-600 text-white shadow-md shadow-cyan-600/20' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-cyan-600'
                        }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-cyan-600" />
                Motivo ou Observações (Opcional)
              </label>
              <textarea 
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className={`${inputClass} resize-none h-32`}
                placeholder="Descreva brevemente o que está sentindo ou o motivo da sua visita..."
              />
            </div>

          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 pt-8 border-t border-slate-100 mt-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !hora}
              className="w-full md:w-auto bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}