"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  dataAgendamentoParaDate,
  formatDataCurta,
  formatDiaSemana,
  partesDataCard,
} from "@/lib/agendamentos-utils";
import InlineErrorState from "@/components/errors/InlineErrorState";

type AgendamentoItem = {
  id: string;
  data: string;
  dataFormatada: string;
  hora: string;
  profissional: string;
  especialidadeLabel: string;
  tipo: string;
  modalidade: string;
  observacoes: string;
  status: string;
  statusValue: string;
};

function ordenarAsc(a: AgendamentoItem, b: AgendamentoItem) {
  return (
    dataAgendamentoParaDate(a.data, a.hora).getTime() -
    dataAgendamentoParaDate(b.data, b.hora).getTime()
  );
}

function ordenarDesc(a: AgendamentoItem, b: AgendamentoItem) {
  return ordenarAsc(b, a);
}

function localAtendimento(modalidade: string) {
  return modalidade === "Online"
    ? "Atendimento Online"
    : "Ambulatório TT — Presencial";
}

export default function AgendaPaciente() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/agendamentos?todos=1");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao carregar agenda");
      }
      const dados: AgendamentoItem[] = await res.json();
      setAgendamentos(dados);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao carregar agenda";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const { proximaConsulta, demaisConsultas } = useMemo(() => {
    const agora = new Date();
    const ativos = agendamentos.filter((a) =>
      ["confirmado", "pendente"].includes(a.statusValue)
    );
    const futuros = ativos
      .filter((a) => dataAgendamentoParaDate(a.data, a.hora) >= agora)
      .sort(ordenarAsc);

    const passados = agendamentos
      .filter(
        (a) =>
          !futuros.some((f) => f.id === a.id) &&
          (["realizado", "ausente", "cancelado"].includes(a.statusValue) ||
            (["confirmado", "pendente"].includes(a.statusValue) &&
              dataAgendamentoParaDate(a.data, a.hora) < agora))
      )
      .sort(ordenarDesc);

    return {
      proximaConsulta: futuros[0] ?? null,
      demaisConsultas: [...futuros.slice(1), ...passados],
    };
  }, [agendamentos]);

  async function cancelarConsulta(id: string) {
    const confirmar = window.confirm(
      "Deseja realmente cancelar esta consulta?"
    );
    if (!confirmar) return;

    setCancelandoId(id);
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelado" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao cancelar");
      }
      await carregar();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao cancelar";
      alert(msg);
    } finally {
      setCancelandoId(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmado":
      case "Pendente":
        return "bg-cyan-50 text-cyan-600 border-cyan-200/50";
      case "Realizado":
        return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
      case "Cancelado":
        return "bg-rose-50 text-rose-600 border-rose-200/50";
      case "Ausente":
        return "bg-slate-50 text-slate-600 border-slate-200/50";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/50";
    }
  };

  if (loading) {
    return (
      <p className="text-center py-20 text-slate-500 font-medium">
        Carregando sua agenda...
      </p>
    );
  }

  if (erro) {
    return (
      <InlineErrorState message={erro} onRetry={carregar} className="max-w-5xl" />
    );
  }

  const cardData = proximaConsulta
    ? partesDataCard(proximaConsulta.data)
    : null;

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto mt-8 px-4 sm:px-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
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
          onClick={() => router.push("/paciente/agenda/novo")}
          className="bg-cyan-600 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <PlusIcon className="w-5 h-5" />
          Agendar Consulta
        </button>
      </header>

      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">
          Sua Próxima Consulta
        </h2>

        {!proximaConsulta ? (
          <div className="bg-white rounded-[32px] border border-slate-100 p-10 text-center">
            <p className="text-slate-500 font-medium mb-4">
              Você não tem consultas agendadas no momento.
            </p>
            <button
              type="button"
              onClick={() => router.push("/paciente/agenda/novo")}
              className="text-cyan-600 font-bold hover:underline"
            >
              Agendar uma consulta
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-cyan-500" />

            <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 pl-10">
              <div className="flex items-center gap-6 md:pr-8 md:border-r border-slate-100">
                {cardData && (
                  <div className="bg-cyan-50 text-cyan-600 w-16 h-16 flex flex-col items-center justify-center rounded-2xl shrink-0">
                    <span className="text-2xl font-black">{cardData.dia}</span>
                    <span className="text-[10px] font-bold uppercase">
                      {cardData.mes}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">
                    {formatDiaSemana(proximaConsulta.data)}
                  </p>
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xl">
                    <ClockIcon className="w-6 h-6 text-cyan-500" />
                    {proximaConsulta.hora}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <span
                    className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border mb-2 ${getStatusBadge(proximaConsulta.status)}`}
                  >
                    {proximaConsulta.status}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {proximaConsulta.especialidadeLabel}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 mt-1">
                    <UserIcon className="w-4 h-4" />
                    <span className="font-medium text-sm">
                      {proximaConsulta.profissional}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{localAtendimento(proximaConsulta.modalidade)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/paciente/agenda/remarcar?id=${proximaConsulta.id}`
                    )
                  }
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm cursor-pointer"
                >
                  Remarcar
                </button>
                <button
                  type="button"
                  disabled={cancelandoId === proximaConsulta.id}
                  onClick={() => cancelarConsulta(proximaConsulta.id)}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-6 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {cancelandoId === proximaConsulta.id
                    ? "Cancelando..."
                    : "Cancelar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">
          Outros Agendamentos e Histórico
        </h2>

        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          {demaisConsultas.length === 0 ? (
            <p className="p-10 text-center text-slate-500 font-medium">
              Nenhum outro registro na agenda.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {demaisConsultas.map((consulta) => (
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
                        {consulta.especialidadeLabel}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 flex-wrap">
                        <span className="font-medium">
                          {formatDataCurta(consulta.data)} às {consulta.hora}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                        <span className="hidden sm:inline">
                          {consulta.profissional}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-bold border shrink-0 ${getStatusBadge(consulta.status)}`}
                  >
                    {consulta.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
