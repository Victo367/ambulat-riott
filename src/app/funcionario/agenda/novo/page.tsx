"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearPageState, usePersistedState } from "@/hooks/usePersistedState";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import HorariosDisponiveisPicker from "@/components/agendamento/HorariosDisponiveisPicker";
import FieldError from "@/components/form/FieldError";
import { useFormErrors } from "@/hooks/useFormErrors";
import { inputWithError } from "@/lib/form-errors";
import {
  maxDataAgendamentoIso,
  minDataAgendamentoIso,
  sanitizeObservacoes,
} from "@/lib/field-validation";
import { hojeIso } from "@/lib/agendamentos-utils";

interface PacienteOption {
  _id: string;
  nome: string;
}

interface FuncionarioOption {
  _id: string;
  nome: string;
  cargo?: string;
}

export default function NovoAgendamento() {
  const router = useRouter();
  const pathname = usePathname();

  const [pacientes, setPacientes] = useState<PacienteOption[]>([]);
  const [funcionarios, setFuncionarios] = useState<FuncionarioOption[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    clearErrors,
    clearField,
    setFieldErrors,
    getError,
    validateRequired,
    applyApiError,
  } = useFormErrors();

  const [pacienteId, setPacienteId] = usePersistedState("pacienteId", "");
  const [profissionalId, setProfissionalId] = usePersistedState(
    "profissionalId",
    ""
  );
  const [data, setData] = usePersistedState("data", hojeIso());
  const [hora, setHora] = usePersistedState("hora", "");
  const [status, setStatus] = usePersistedState("status", "confirmado");
  const [tipo, setTipo] = usePersistedState("tipo", "Consulta Inicial");
  const [observacoes, setObservacoes] = usePersistedState("observacoes", "");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearErrors();

    const clientErrors = validateRequired([
      { name: "pacienteId", value: pacienteId, message: "Selecione o paciente" },
      {
        name: "profissionalId",
        value: profissionalId,
        message: "Selecione o profissional",
      },
      { name: "data", value: data, message: "Informe a data da consulta" },
      { name: "hora", value: hora, message: "Selecione um horário disponível" },
    ]);
    if (clientErrors) {
      setFieldErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);
    try {
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
        await applyApiError(res, "Não foi possível criar o agendamento");
        return;
      }
      alert("Agendamento criado com sucesso!");
      clearPageState(pathname);
      router.push(`/funcionario/agenda?data=${data}`);
      router.refresh();
    } catch {
      setFieldErrors({
        _form:
          "Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.",
      });
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
          <FieldError message={getError("_form")} className="text-sm" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className={labelClass}>Paciente Atendido *</label>
              <div className="relative group">
                <UserIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <select
                  className={inputWithError(inputClass, getError("pacienteId"))}
                  required
                  value={pacienteId}
                  onChange={(e) => {
                    setPacienteId(e.target.value);
                    clearField("pacienteId");
                  }}
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
              <FieldError message={getError("pacienteId")} />
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Profissional Responsável *</label>
              <div className="relative group">
                <BeakerIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <select
                  className={inputWithError(inputClass, getError("profissionalId"))}
                  required
                  value={profissionalId}
                  onChange={(e) => {
                    setProfissionalId(e.target.value);
                    setHora("");
                    clearField("profissionalId");
                  }}
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
              <FieldError message={getError("profissionalId")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className={labelClass}>Data da Consulta *</label>
              <div className="relative group">
                <CalendarIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
                <input
                  type="date"
                  className={inputWithError(inputClass, getError("data"))}
                  required
                  value={data}
                  min={minDataAgendamentoIso()}
                  max={maxDataAgendamentoIso()}
                  onChange={(e) => {
                    setData(e.target.value);
                    setHora("");
                    clearField("data");
                  }}
                />
              </div>
              <FieldError message={getError("data")} />
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

            <div className="space-y-1 md:col-span-2">
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

          <div>
            <HorariosDisponiveisPicker
              profissionalId={profissionalId}
              data={data}
              value={hora}
              onChange={(h) => {
                setHora(h);
                clearField("hora");
              }}
              labelClass={`${labelClass} flex items-center gap-2`}
              aguardandoProfissional="Selecione o profissional para ver os horários."
            />
            <FieldError message={getError("hora")} />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Observações Adicionais</label>
            <div className="relative group">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-400 absolute left-4 top-5 group-focus-within:text-cyan-600 transition-colors" />
              <textarea
                rows={4}
                value={observacoes}
                onChange={(e) => setObservacoes(sanitizeObservacoes(e.target.value))}
                placeholder="Detalhes sobre o encaminhamento ou necessidades específicas..."
                className={`${inputClass} pl-11 resize-none pt-4`}
                maxLength={500}
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
              disabled={isSubmitting || loadingDados || !hora}
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
