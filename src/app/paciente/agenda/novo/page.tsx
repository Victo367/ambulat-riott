"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearPageState, usePersistedState } from "@/hooks/usePersistedState";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
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

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loadingProfissionais, setLoadingProfissionais] = useState(false);
  const [erroProfissionais, setErroProfissionais] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    clearErrors,
    clearField,
    setFieldErrors,
    getError,
    validateRequired,
    applyApiError,
  } = useFormErrors();

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

  function handleEspecialidadeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEspecialidade(e.target.value);
    setMedico("");
    setHora("");
    clearField("especialidade");
    clearField("medico");
    clearField("hora");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearErrors();

    const clientErrors = validateRequired([
      { name: "especialidade", value: especialidade, message: "Selecione a especialidade" },
      { name: "medico", value: medico, message: "Selecione o profissional" },
      { name: "data", value: data, message: "Informe a data desejada" },
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
        await applyApiError(res, "Não foi possível agendar a consulta", {
          profissionalId: "medico",
        });
        return;
      }

      alert("Consulta agendada com sucesso!");
      clearPageState(pathname);
      router.push("/paciente/agenda");
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

  const labelClass =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2";
  const inputClass =
    "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400 appearance-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-3xl mx-auto mt-8 px-4 sm:px-0">
      <header className="flex flex-col sm:flex-row sm:items-center gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <button
          type="button"
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

      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <FieldError message={getError("_form")} className="text-sm" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Especialidade ou Tipo de Atendimento *
              </label>
              <select
                value={especialidade}
                onChange={handleEspecialidadeChange}
                className={inputWithError(inputClass, getError("especialidade"))}
                required
              >
                <option value="" disabled>
                  Selecione o motivo da consulta
                </option>
                <option value="clinico">Clínico Geral</option>
                <option value="psicologia">Acompanhamento Psicológico</option>
                <option value="hormonal">Endocrinologista</option>
                <option value="nutricao">Nutricionista</option>
              </select>
              <FieldError message={getError("especialidade")} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                <UserIcon className="w-4 h-4 text-cyan-600" />
                Profissional de Preferência *
              </label>
              <select
                value={medico}
                onChange={(e) => {
                  setMedico(e.target.value);
                  setHora("");
                  clearField("medico");
                }}
                className={inputWithError(inputClass, getError("medico"))}
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
              <FieldError message={getError("medico")} />
            </div>

            <div>
              <label className={labelClass}>
                <CalendarDaysIcon className="w-4 h-4 text-cyan-600" />
                Data Desejada *
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => {
                  setData(e.target.value);
                  setHora("");
                  clearField("data");
                }}
                className={inputWithError(inputClass, getError("data"))}
                required
                min={minDataAgendamentoIso()}
                max={maxDataAgendamentoIso()}
              />
              <FieldError message={getError("data")} />
            </div>

            <div className="md:col-span-2">
              <HorariosDisponiveisPicker
                profissionalId={medico}
                data={data}
                value={hora}
                onChange={(h) => {
                  setHora(h);
                  clearField("hora");
                }}
                labelClass={labelClass}
                aguardandoProfissional="Selecione o profissional para ver os horários."
              />
              <FieldError message={getError("hora")} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-cyan-600" />
                Motivo ou Observações (Opcional)
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(sanitizeObservacoes(e.target.value))}
                className={`${inputClass} resize-none h-32`}
                maxLength={500}
                placeholder="Descreva brevemente o que está sentindo ou o motivo da sua visita..."
              />
            </div>
          </div>

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
