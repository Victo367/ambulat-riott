"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  BeakerIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface AgendamentoForm {
  pacienteNome: string;
  medicoNome: string;
  data: string;
  horario: string;
  status: string;
  observacoes: string;
  pacienteTerapia: {
    dosagem_hormonio: string;
    bloqueador_hormonal: string;
  };
}

function EditarConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [form, setForm] = useState<AgendamentoForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    if (!id) {
      setErro("Agendamento não informado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/agendamentos/${id}`);
      if (!res.ok) throw new Error("Não encontrado");
      const dados = await res.json();
      setForm({
        pacienteNome: dados.paciente,
        medicoNome: dados.profissional,
        data: dados.data,
        horario: dados.hora,
        status: dados.statusValue,
        observacoes: dados.observacoes || "",
        pacienteTerapia: dados.pacienteTerapia || {
          dosagem_hormonio: "",
          bloqueador_hormonal: "",
        },
      });
    } catch {
      setErro("Não foi possível carregar o agendamento.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-400 focus:bg-white focus:border-cyan-600 focus:ring-4 focus:ring-cyan-600/10 outline-none transition-all appearance-none";

  const readOnlyClass =
    "w-full pl-11 pr-4 py-3.5 bg-slate-100/70 border border-slate-200 rounded-2xl text-sm text-slate-500 cursor-not-allowed outline-none font-medium";

  const labelClass =
    "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !form) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: form.data,
          hora: form.horario,
          status: form.status,
          observacoes: form.observacoes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar");
      }
      alert("Agendamento atualizado com sucesso!");
      router.push(`/funcionario/agenda/detalhes?id=${id}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao salvar";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="text-center py-20 text-slate-500 font-medium">Carregando...</p>
    );
  }

  if (erro || !form) {
    return (
      <section className="text-center py-20 space-y-4">
        <p className="text-rose-600 font-medium">{erro}</p>
        <button
          onClick={() => router.push("/funcionario/agenda")}
          className="text-cyan-600 font-semibold hover:underline cursor-pointer"
        >
          Voltar para agenda
        </button>
      </section>
    );
  }

  const possuiTerapia =
    form.pacienteTerapia.dosagem_hormonio || form.pacienteTerapia.bloqueador_hormonal;

  return (
    <section className="space-y-8 animate-fade-in pb-12">
      <header className="flex items-center gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Editar Agendamento
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Atualize as informações da consulta selecionada
          </p>
        </div>
      </header>

      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10 max-w-5xl mx-auto">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1 opacity-80">
              <label className={labelClass}>Nome Paciente *</label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input value={form.pacienteNome} readOnly className={readOnlyClass} />
              </div>
            </div>
            <div className="space-y-1 opacity-80">
              <label className={labelClass}>Médico *</label>
              <div className="relative">
                <BeakerIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input value={form.medicoNome} readOnly className={readOnlyClass} />
              </div>
            </div>
          </div>

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
                  {form.pacienteTerapia.dosagem_hormonio && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="text-sm font-medium text-slate-700">
                        <span className="text-slate-500 mr-1">Dosagem:</span>
                        {form.pacienteTerapia.dosagem_hormonio}
                      </span>
                    </div>
                  )}
                  {form.pacienteTerapia.bloqueador_hormonal && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="text-sm font-medium text-slate-700">
                        <span className="text-slate-500 mr-1">Bloqueador:</span>
                        {form.pacienteTerapia.bloqueador_hormonal}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <label className={labelClass}>Data *</label>
              <div className="relative group">
                <CalendarIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Horário *</label>
              <div className="relative group">
                <ClockIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <input
                  type="time"
                  value={form.horario}
                  onChange={(e) => setForm({ ...form, horario: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={`${inputClass} pl-4`}
                >
                  <option value="confirmado">Confirmado</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="realizado">Realizado</option>
                  <option value="ausente">Ausente</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Observações</label>
            <div className="relative group">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-400 absolute left-4 top-5 group-focus-within:text-cyan-600 transition-colors" />
              <textarea
                rows={5}
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                className={`${inputClass} pl-11 resize-none pt-4`}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-cyan-600 text-white px-12 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckIcon className="w-5 h-5" />
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function EditarAgendamento() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-slate-500">Carregando...</p>}>
      <EditarConteudo />
    </Suspense>
  );
}
