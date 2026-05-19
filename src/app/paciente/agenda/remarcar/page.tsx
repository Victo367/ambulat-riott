"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  UserIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDataCurta } from "@/lib/agendamentos-utils";
import HorariosDisponiveisPicker from "@/components/agendamento/HorariosDisponiveisPicker";
import FieldError from "@/components/form/FieldError";
import { useFormErrors } from "@/hooks/useFormErrors";
import { inputWithError } from "@/lib/form-errors";

type AgendamentoDetalhe = {
  id: string;
  data: string;
  hora: string;
  profissional: string;
  profissionalId: string;
  especialidadeLabel: string;
  statusValue: string;
};

function RemarcarConsultaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agendamentoId = searchParams.get("id");

  const [consulta, setConsulta] = useState<AgendamentoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    clearErrors,
    clearField,
    setFieldErrors,
    getError,
    validateRequired,
    applyApiError,
  } = useFormErrors();

  const carregar = useCallback(async () => {
    if (!agendamentoId) {
      setErro("Agendamento não informado.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`/api/agendamentos/${agendamentoId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao carregar agendamento");
      }
      const dados: AgendamentoDetalhe = await res.json();

      if (!["confirmado", "pendente"].includes(dados.statusValue)) {
        throw new Error("Este agendamento não pode ser remarcado.");
      }

      setConsulta(dados);
      setNovaData(dados.data);
      setNovaHora(dados.hora);
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Erro ao carregar agendamento";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }, [agendamentoId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!consulta || !novaData || !novaHora) return;

    clearErrors();

    const clientErrors = validateRequired([
      { name: "novaData", value: novaData, message: "Informe a nova data" },
      { name: "novaHora", value: novaHora, message: "Selecione o novo horário" },
    ]);
    if (clientErrors) {
      setFieldErrors(clientErrors);
      return;
    }

    if (novaData === consulta.data && novaHora === consulta.hora) {
      setFieldErrors({
        novaData: "Escolha uma data diferente da atual",
        novaHora: "Escolha um horário diferente do atual",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/agendamentos/${consulta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: novaData, hora: novaHora }),
      });
      if (!res.ok) {
        await applyApiError(res, "Erro ao remarcar consulta", {
          data: "novaData",
          hora: "novaHora",
        });
        return;
      }
      router.push("/paciente/agenda");
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
    "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all appearance-none";
  const disabledClass =
    "w-full bg-slate-100 border border-slate-200 text-slate-400 text-sm rounded-2xl px-4 py-3.5 cursor-not-allowed opacity-70";

  if (loading) {
    return (
      <p className="text-center py-20 text-slate-500 font-medium max-w-3xl mx-auto">
        Carregando agendamento...
      </p>
    );
  }

  if (erro || !consulta) {
    return (
      <div className="text-center py-20 space-y-4 max-w-3xl mx-auto px-4">
        <p className="text-rose-600 font-medium">
          {erro || "Agendamento não encontrado."}
        </p>
        <button
          type="button"
          onClick={() => router.push("/paciente/agenda")}
          className="text-cyan-600 font-semibold hover:underline"
        >
          Voltar para agenda
        </button>
      </div>
    );
  }

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
            Remarcar Consulta
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Selecione um novo momento para o seu atendimento
          </p>
        </div>
      </header>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
        <InformationCircleIcon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800 leading-relaxed">
          Para alterar a <b>especialidade</b> ou o <b>profissional</b>, cancele
          este agendamento e crie um novo. Na remarcação, apenas data e hora
          podem ser ajustadas.
        </p>
      </div>

      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10">
        <form onSubmit={handleUpdate} className="space-y-8">
          <FieldError message={getError("_form")} className="text-sm" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className={labelClass}>Especialidade</label>
              <div className={disabledClass}>{consulta.especialidadeLabel}</div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                <UserIcon className="w-4 h-4" />
                Profissional
              </label>
              <div className={disabledClass}>{consulta.profissional}</div>
            </div>

            <div>
              <label className={labelClass}>
                <CalendarDaysIcon className="w-4 h-4 text-cyan-600" />
                Nova Data Desejada *
              </label>
              <input
                type="date"
                required
                value={novaData}
                onChange={(e) => {
                  setNovaData(e.target.value);
                  setNovaHora("");
                  clearField("novaData");
                }}
                min={new Date().toISOString().split("T")[0]}
                className={inputWithError(inputClass, getError("novaData"))}
              />
              <FieldError message={getError("novaData")} />
              <p className="text-[10px] text-slate-400 mt-2 ml-1">
                Data atual: {formatDataCurta(consulta.data)}
              </p>
            </div>

            <div className="md:col-span-2">
              <HorariosDisponiveisPicker
                profissionalId={consulta.profissionalId}
                data={novaData}
                value={novaHora}
                onChange={(h) => {
                  setNovaHora(h);
                  clearField("novaHora");
                }}
                excludeAgendamentoId={consulta.id}
                labelClass={labelClass}
              />
              <FieldError message={getError("novaHora")} />
              <p className="text-[10px] text-slate-400 mt-3 ml-1">
                Horário anterior: {consulta.hora}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 pt-8 border-t border-slate-100 mt-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Manter Horário Atual
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !novaHora}
              className="w-full md:w-auto bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Atualizando..." : "Confirmar Nova Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RemarcarConsulta() {
  return (
    <Suspense
      fallback={
        <p className="text-center py-20 text-slate-500 font-medium">
          Carregando...
        </p>
      }
    >
      <RemarcarConsultaContent />
    </Suspense>
  );
}
