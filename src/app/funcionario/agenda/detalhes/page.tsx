"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  MapPinIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface AgendamentoDetalhe {
  id: string;
  paciente: string;
  horario: string;
  dataFormatada: string;
  tipo: string;
  status: string;
  statusValue: string;
  profissional: string;
  modalidade: string;
  observacoes: string;
  pacienteTerapia: {
    dosagem_hormonio: string;
    bloqueador_hormonal: string;
  };
  historico: { acao: string; data: string; usuarioNome: string }[];
}

function DetalhesConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [agendamento, setAgendamento] = useState<AgendamentoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    if (!id) {
      setErro("Agendamento não informado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`/api/agendamentos/${id}`);
      if (!res.ok) throw new Error("Agendamento não encontrado");
      const dados = await res.json();
      setAgendamento({
        id: dados.id,
        paciente: dados.paciente,
        horario: dados.hora,
        dataFormatada: dados.dataFormatada,
        tipo: dados.tipo,
        status: dados.status,
        statusValue: dados.statusValue,
        profissional: dados.profissional,
        modalidade: dados.modalidade,
        observacoes: dados.observacoes,
        pacienteTerapia: dados.pacienteTerapia,
        historico: dados.historico || [],
      });
    } catch {
      setErro("Não foi possível carregar os detalhes.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function atualizarStatus(novoStatus: string) {
    if (!id || atualizando) return;

    if (novoStatus === "cancelado") {
      const confirmar = window.confirm(
        "Deseja realmente cancelar este horário?"
      );
      if (!confirmar) return;
    }

    setAtualizando(true);
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao atualizar");
      }
      const dados = await res.json();
      setAgendamento({
        id: dados.id,
        paciente: dados.paciente,
        horario: dados.hora,
        dataFormatada: dados.dataFormatada,
        tipo: dados.tipo,
        status: dados.status,
        statusValue: dados.statusValue,
        profissional: dados.profissional,
        modalidade: dados.modalidade,
        observacoes: dados.observacoes,
        pacienteTerapia: dados.pacienteTerapia,
        historico: dados.historico || [],
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao atualizar status";
      alert(msg);
    } finally {
      setAtualizando(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelado":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Realizado":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Ausente":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <p className="text-center py-20 text-slate-500 font-medium">
        Carregando detalhes...
      </p>
    );
  }

  if (erro || !agendamento) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-rose-600 font-medium">{erro || "Agendamento não encontrado"}</p>
        <button
          onClick={() => router.push("/funcionario/agenda")}
          className="text-cyan-600 font-semibold hover:underline cursor-pointer"
        >
          Voltar para agenda
        </button>
      </div>
    );
  }

  const possuiTerapia =
    agendamento.pacienteTerapia &&
    (agendamento.pacienteTerapia.dosagem_hormonio ||
      agendamento.pacienteTerapia.bloqueador_hormonal);

  const cancelado = agendamento.statusValue === "cancelado";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
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
              ID do Registro: #{agendamento.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              router.push(`/funcionario/agenda/editar?id=${agendamento.id}`)
            }
            disabled={cancelado}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Editar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8">
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <UserIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {agendamento.paciente}
                  </h2>
                  <p className="text-slate-500 font-medium">{agendamento.tipo}</p>
                </div>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(agendamento.status)}`}
              >
                {agendamento.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <CalendarIcon className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Data
                  </p>
                  <p className="text-slate-700 font-semibold">
                    {agendamento.dataFormatada}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <ClockIcon className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Horário
                  </p>
                  <p className="text-slate-700 font-semibold">{agendamento.horario}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <BeakerIcon className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Profissional
                  </p>
                  <p className="text-slate-700 font-semibold">
                    {agendamento.profissional}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <MapPinIcon className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Modalidade
                  </p>
                  <p className="text-slate-700 font-semibold">
                    {agendamento.modalidade}
                  </p>
                </div>
              </div>
            </div>

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

          <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-cyan-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Observações do Atendimento
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {agendamento.observacoes || "Nenhuma observação registrada."}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-cyan-600 rounded-[32px] p-8 text-white shadow-lg shadow-cyan-600/20">
            <h3 className="text-lg font-bold mb-4">Ações de Status</h3>
            <p className="text-cyan-100 text-sm mb-6">
              Atualize o andamento do paciente diretamente por aqui.
            </p>
            <div className="space-y-3">
              <button
                disabled={atualizando || cancelado}
                onClick={() => atualizarStatus("realizado")}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {atualizando ? "Atualizando..." : "Check-in realizado"}
              </button>
              <button
                disabled={atualizando || cancelado}
                onClick={() => atualizarStatus("ausente")}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Marcar como Ausente
              </button>
              <button
                disabled={atualizando || cancelado}
                onClick={() => atualizarStatus("cancelado")}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar Horário
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-8">
            <h3 className="text-slate-900 font-bold mb-4">Histórico Rápido</h3>
            <div className="space-y-4">
              {agendamento.historico.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhum registro ainda.</p>
              ) : (
                agendamento.historico.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0"></div>
                    <p className="text-xs text-slate-500">
                      <b className="text-slate-700">
                        {item.usuarioNome || "Sistema"}
                      </b>{" "}
                      - {item.acao}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetalhesAgendamento() {
  return (
    <Suspense
      fallback={
        <p className="text-center py-20 text-slate-500 font-medium">
          Carregando...
        </p>
      }
    >
      <DetalhesConteudo />
    </Suspense>
  );
}

