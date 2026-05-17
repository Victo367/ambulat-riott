"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PlusIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface AgendamentoItem {
  id: string;
  hora: string;
  paciente: string;
  tipo: string;
  status: string;
  data: string;
  dataFormatada: string;
}

function dataIsoLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const AGENDA_QUERY_KEY = "page-state:/funcionario/agenda:__query";

function salvarUltimaVisaoAgenda(query: string) {
  if (typeof window === "undefined") return;
  if (query) {
    sessionStorage.setItem(AGENDA_QUERY_KEY, query);
  } else {
    sessionStorage.removeItem(AGENDA_QUERY_KEY);
  }
}

function formatarDataExibicao(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function AgendaConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hoje = dataIsoLocal();
  const verTodos = searchParams.get("todos") === "1";
  const dataFiltro = searchParams.get("data") || hoje;

  const [horarios, setHorarios] = useState<AgendamentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const dataExibicao = verTodos
    ? "Todos os agendamentos"
    : formatarDataExibicao(dataFiltro);
  const ehHoje = !verTodos && dataFiltro === hoje;

  const carregarAgenda = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const url = verTodos
        ? "/api/agendamentos?todos=1"
        : `/api/agendamentos?data=${dataFiltro}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao carregar agenda");
      const dados = await res.json();
      setHorarios(dados);
    } catch {
      setErro("Nao foi possivel carregar a agenda.");
    } finally {
      setLoading(false);
    }
  }, [dataFiltro, verTodos]);

  useEffect(() => {
    const temData = searchParams.has("data");
    const temTodos = searchParams.get("todos") === "1";
    if (!temData && !temTodos && typeof window !== "undefined") {
      const ultima = sessionStorage.getItem(AGENDA_QUERY_KEY);
      if (ultima) {
        router.replace(`/funcionario/agenda?${ultima}`);
        return;
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    carregarAgenda();
  }, [carregarAgenda]);

  useEffect(() => {
    function aoVoltarParaPagina() {
      if (document.visibilityState === "visible") {
        carregarAgenda();
      }
    }
    document.addEventListener("visibilitychange", aoVoltarParaPagina);
    return () =>
      document.removeEventListener("visibilitychange", aoVoltarParaPagina);
  }, [carregarAgenda]);

  function alterarData(novaData: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("todos");
    if (novaData === hoje) {
      params.delete("data");
    } else {
      params.set("data", novaData);
    }
    const query = params.toString();
    salvarUltimaVisaoAgenda(query);
    router.push(query ? `/funcionario/agenda?${query}` : "/funcionario/agenda");
  }

  function alterarVisao(todos: boolean) {
    const params = new URLSearchParams();
    if (todos) {
      params.set("todos", "1");
    } else {
      params.set("data", hoje);
    }
    const query = params.toString();
    salvarUltimaVisaoAgenda(query);
    router.replace(`/funcionario/agenda?${query}`);
  }

  const totalAgendamentos = horarios.length;
  const confirmados = horarios.filter((h) => h.status === "Confirmado").length;
  const cancelados = horarios.filter((h) => h.status === "Cancelado").length;

  function getStatusStyle(status: string) {
    switch (status) {
      case "Confirmado":
        return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
      case "Pendente":
        return "bg-amber-50 text-amber-600 border-amber-200/50";
      case "Cancelado":
        return "bg-rose-50 text-rose-600 border-rose-200/50";
      case "Realizado":
        return "bg-cyan-50 text-cyan-600 border-cyan-200/50";
      case "Ausente":
        return "bg-slate-50 text-slate-600 border-slate-200/50";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/50";
    }
  }

  return (
    <section className="space-y-8 animate-fade-in pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <section className="flex items-center gap-5">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 shadow-sm shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </span>
          <section>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Agenda da Unidade
            </h1>
            <p
              className={`text-sm text-slate-500 mt-0.5 font-medium ${verTodos ? "" : "capitalize"}`}
            >
              {dataExibicao}
              {!verTodos && !ehHoje && (
                <span className="text-cyan-600 normal-case ml-2 text-xs font-semibold">
                  (outro dia)
                </span>
              )}
            </p>
          </section>
        </section>

        <section className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto min-w-0">
          <section className="flex items-center gap-3 flex-wrap sm:flex-nowrap min-w-0">
            <section
              className="flex shrink-0 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1"
              role="tablist"
              aria-label="Modo de visualizacao"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!verTodos}
                onClick={() => alterarVisao(false)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  !verTodos
                    ? "bg-white text-cyan-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Por dia
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={verTodos}
                onClick={() => alterarVisao(true)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  verTodos
                    ? "bg-white text-cyan-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Todos
              </button>
            </section>

            {!verTodos && (
              <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm shrink-0">
                <CalendarDaysIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={dataFiltro}
                  onChange={(e) => alterarData(e.target.value)}
                  className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer"
                  aria-label="Data da agenda"
                />
              </label>
            )}
          </section>

          <button
            type="button"
            onClick={() => router.push("/funcionario/agenda/novo")}
            className="shrink-0 w-full sm:w-auto sm:ml-auto bg-cyan-600 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md shadow-cyan-600/20 hover:bg-cyan-700 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <PlusIcon className="w-5 h-5" />
            Novo Agendamento
          </button>
        </section>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.01)] border border-slate-100 p-6 flex items-center gap-5">
          <span className="p-3.5 bg-cyan-50 text-cyan-600 rounded-2xl">
            <CalendarDaysIcon className="w-7 h-7" />
          </span>
          <section>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {verTodos ? "Total Geral" : "Total do Dia"}
            </p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">
              {totalAgendamentos}
            </h2>
          </section>
        </article>

        <article className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.01)] border border-slate-100 p-6 flex items-center gap-5">
          <span className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircleIcon className="w-7 h-7" />
          </span>
          <section>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Confirmados
            </p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{confirmados}</h2>
          </section>
        </article>

        <article className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.01)] border border-slate-100 p-6 flex items-center gap-5">
          <span className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
            <XCircleIcon className="w-7 h-7" />
          </span>
          <section>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cancelados
            </p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{cancelados}</h2>
          </section>
        </article>
      </section>

      <section className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <header className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
          <UserIcon className="w-5 h-5 text-cyan-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {verTodos ? "Todos os Pacientes Agendados" : "Lista de Pacientes"}
          </h2>
        </header>

        {erro && (
          <p className="px-8 py-6 text-sm text-rose-600 font-medium">{erro}</p>
        )}

        {loading ? (
          <p className="px-8 py-12 text-center text-slate-500 font-medium">
            Carregando agenda...
          </p>
        ) : horarios.length === 0 ? (
          <p className="px-8 py-12 text-center text-slate-500 font-medium">
            {verTodos
              ? "Nenhum agendamento cadastrado ainda."
              : ehHoje
                ? "Nenhum agendamento para hoje. Crie um novo ou selecione outra data acima."
                : "Nenhum agendamento nesta data."}
          </p>
        ) : (
          <section className="overflow-hidden">
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest hidden md:table-header-group">
              <tr>
                {verTodos && <th className="px-4 lg:px-8 py-4">Data</th>}
                <th className="px-4 lg:px-8 py-4">Horário</th>
                <th className="px-4 lg:px-8 py-4">Paciente</th>
                <th className="px-4 lg:px-8 py-4">Procedimento / Tipo</th>
                <th className="px-4 lg:px-8 py-4">Status</th>
                <th className="px-4 lg:px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
        
            <tbody className="divide-y divide-slate-100 block md:table-row-group">
              {horarios.map((item) => (
                <tr
                  key={item.id}
                  className="block md:table-row p-4 md:p-0 hover:bg-slate-50/80 transition-colors duration-150 group"
                >
                  {verTodos && (
                    <td className="block md:table-cell px-4 lg:px-8 py-2 md:py-5">
                      <div className="md:hidden text-[11px] uppercase text-slate-400 font-bold mb-1">
                        Data
                      </div>
        
                      <span className="text-sm font-semibold text-slate-700 break-words">
                        {item.dataFormatada}
                      </span>
                    </td>
                  )}
        
                  <td className="block md:table-cell px-4 lg:px-8 py-2 md:py-5">
                    <div className="md:hidden text-[11px] uppercase text-slate-400 font-bold mb-1">
                      Horário
                    </div>
        
                    <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                      {item.hora}
                    </span>
                  </td>
        
                  <td className="block md:table-cell px-4 lg:px-8 py-2 md:py-5">
                    <div className="md:hidden text-[11px] uppercase text-slate-400 font-bold mb-1">
                      Paciente
                    </div>
        
                    <span className="font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors break-words">
                      {item.paciente}
                    </span>
                  </td>
        
                  <td className="block md:table-cell px-4 lg:px-8 py-2 md:py-5 text-slate-500 font-medium">
                    <div className="md:hidden text-[11px] uppercase text-slate-400 font-bold mb-1">
                      Procedimento
                    </div>
        
                    <span className="break-words">{item.tipo}</span>
                  </td>
        
                  <td className="block md:table-cell px-4 lg:px-8 py-2 md:py-5">
                    <div className="md:hidden text-[11px] uppercase text-slate-400 font-bold mb-1">
                      Status
                    </div>
        
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs rounded-full font-bold border ${getStatusStyle(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
        
                  <td className="block md:table-cell px-4 lg:px-8 py-3 md:py-5 text-left md:text-right">
                    <button
                      onClick={() =>
                        router.push(`/funcionario/agenda/detalhes?id=${item.id}`)
                      }
                      className="text-cyan-600 font-semibold hover:text-cyan-800 text-sm cursor-pointer hover:underline transition-all"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        )}
      </section>
    </section>
  );
}

export default function AgendaFuncionario() {
  return (
    <Suspense
      fallback={
        <p className="text-center py-20 text-slate-500 font-medium">
          Carregando agenda...
        </p>
      }
    >
      <AgendaConteudo />
    </Suspense>
  );
}
