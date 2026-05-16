"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearPageState, usePersistedState } from "@/hooks/usePersistedState";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import {
  TerapiaHormonalFields,
  terapiaFromPaciente,
  terapiaToApiPayload,
  type TerapiaHormonalValues,
} from "@/components/TerapiaHormonalFields";

interface PacienteOption {
  _id: string;
  nome: string;
  terapia_hormonal?: boolean;
  dosagem_hormonio?: string;
  bloqueador_hormonal?: string;
}

interface FuncionarioOption {
  _id: string;
  nome: string;
  cargo?: string;
}

function dataIsoLocal() {
  const hoje = new Date();
  const y = hoje.getFullYear();
  const m = String(hoje.getMonth() + 1).padStart(2, "0");
  const d = String(hoje.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function NovoAgendamento() {
  const router = useRouter();
  const pathname = usePathname();

  const [pacientes, setPacientes] = useState<PacienteOption[]>([]);
  const [funcionarios, setFuncionarios] = useState<FuncionarioOption[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pacienteId, setPacienteId] = usePersistedState("pacienteId", "");
  const [profissionalId, setProfissionalId] = usePersistedState(
    "profissionalId",
    ""
  );
  const [data, setData] = usePersistedState("data", dataIsoLocal());
  const [hora, setHora] = usePersistedState("hora", "");
  const [status, setStatus] = usePersistedState("status", "confirmado");
  const [tipo, setTipo] = usePersistedState("tipo", "Consulta Inicial");
  const [observacoes, setObservacoes] = usePersistedState("observacoes", "");
  const [terapia, setTerapia] = useState<TerapiaHormonalValues>({
    terapia_hormonal: false,
    dosagem_hormonio: "",
    bloqueador_hormonal: "",
  });

  const pacienteSelecionado = pacientes.find((p) => p._id === pacienteId);

  const thInputClass =
    "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400";
  const thLabelClass =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-400 focus:bg-white focus:border-cyan-600 focus:ring-4 focus:ring-cyan-600/10 outline-none transition-all appearance-none";

  const labelClass =
    "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1";

  useEffect(() => {
    async function carregarDados() {
      setLoadingDados(true);
      try {
        const [resPacientes, resFuncionarios] = await Promise.all([
          fetch("/api/users/pacientes"),
          fetch("/api/users/funcionarios"),
        ]);
        if (resPacientes.ok) setPacientes(await resPacientes.json());
        if (resFuncionarios.ok) setFuncionarios(await resFuncionarios.json());
      } catch {
        alert("Erro ao carregar pacientes e profissionais.");
      } finally {
        setLoadingDados(false);
      }
    }
    carregarDados();
  }, []);

  useEffect(() => {
    if (!pacienteSelecionado) {
      setTerapia({
        terapia_hormonal: false,
        dosagem_hormonio: "",
        bloqueador_hormonal: "",
      });
      return;
    }
    setTerapia(terapiaFromPaciente(pacienteSelecionado));
  }, [pacienteId, pacientes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pacienteId || !profissionalId || !data || !hora) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const resTerapia = await fetch(`/api/users/${pacienteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(terapiaToApiPayload(terapia)),
      });
      if (!resTerapia.ok) {
        const errTh = await resTerapia.json().catch(() => ({}));
        throw new Error(
          errTh.error || "Erro ao salvar dados de terapia hormonal"
        );
      }

      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteId,
          profissionalId,
          data,
          hora,
          status,
          tipo,
          observacoes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao agendar");
      }
      alert("Agendamento criado com sucesso!");
      clearPageState(pathname);
      router.push(`/funcionario/agenda?data=${data}`);
      router.refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao agendar";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

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
            Novo Agendamento
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Preencha os dados para reservar um horário na agenda
          </p>
        </div>
      </header>

      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10 max-w-5xl mx-auto">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className={labelClass}>Paciente Atendido *</label>
              <div className="relative group">
                <UserIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <select
                  className={inputClass}
                  required
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  disabled={loadingDados}
                >
                  <option value="">
                    {loadingDados ? "Carregando..." : "Selecione o paciente"}
                  </option>
                  {pacientes.map((paciente) => (
                    <option key={paciente._id} value={paciente._id}>
                      {paciente.nome}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Profissional Responsável *</label>
              <div className="relative group">
                <BeakerIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <select
                  className={inputClass}
                  required
                  value={profissionalId}
                  onChange={(e) => setProfissionalId(e.target.value)}
                  disabled={loadingDados}
                >
                  <option value="">
                    {loadingDados
                      ? "Carregando..."
                      : "Selecione o médico/especialista"}
                  </option>
                  {funcionarios.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.cargo ? `${f.nome} (${f.cargo})` : f.nome}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {pacienteId && (
            <div className="pt-2 border-t border-slate-100">
              <TerapiaHormonalFields
                values={terapia}
                onChange={setTerapia}
                inputClass={thInputClass}
                labelClass={thLabelClass}
                title="Terapia Hormonal do Paciente"
              />
              <p className="text-xs text-slate-500 ml-1 mt-2">
                Os dados de terapia são salvos no cadastro do paciente ao
                confirmar o agendamento.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <label className={labelClass}>Data da Consulta *</label>
              <div className="relative group">
                <CalendarIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <input
                  type="date"
                  className={inputClass}
                  required
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Horário *</label>
              <div className="relative group">
                <ClockIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <input
                  type="time"
                  className={inputClass}
                  required
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Tipo de Consulta</label>
              <div className="relative">
                <select
                  className={`${inputClass} pl-4`}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option>Consulta Inicial</option>
                  <option>Retorno</option>
                  <option>Avaliação</option>
                  <option>Consulta</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1 md:col-span-3">
              <label className={labelClass}>Status Inicial</label>
              <div className="relative">
                <select
                  className={`${inputClass} pl-4`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="confirmado">Confirmado</option>
                  <option value="pendente">Pendente</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Observações Adicionais</label>
            <div className="relative group">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-400 absolute left-4 top-5 group-focus-within:text-cyan-600 transition-colors" />
              <textarea
                rows={4}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Detalhes sobre o encaminhamento ou necessidades específicas..."
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
              Descartar Alterações
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingDados}
              className="w-full md:w-auto bg-cyan-600 text-white px-12 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 hover:shadow-cyan-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckIcon className="w-5 h-5" />
              {isSubmitting ? "Salvando..." : "Finalizar Agendamento"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
