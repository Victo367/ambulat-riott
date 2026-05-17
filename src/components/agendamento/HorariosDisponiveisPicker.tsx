"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

type HorariosDisponiveisPickerProps = {
  profissionalId: string;
  data: string;
  value: string;
  onChange: (hora: string) => void;
  excludeAgendamentoId?: string;
  labelClass?: string;
  aguardandoProfissional?: string;
};

export default function HorariosDisponiveisPicker({
  profissionalId,
  data,
  value,
  onChange,
  excludeAgendamentoId,
  labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2",
  aguardandoProfissional = "Selecione o profissional para ver os horários.",
}: HorariosDisponiveisPickerProps) {
  const [horarios, setHorarios] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!profissionalId || !data) {
      setHorarios([]);
      setErro("");
      return;
    }

    let ativo = true;

    async function carregar() {
      setLoading(true);
      setErro("");
      try {
        const params = new URLSearchParams({
          profissionalId,
          data,
        });
        if (excludeAgendamentoId) {
          params.set("excludeId", excludeAgendamentoId);
        }

        const res = await fetch(
          `/api/agendamentos/horarios-disponiveis?${params.toString()}`
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            typeof body.error === "string"
              ? body.error
              : "Erro ao buscar horários"
          );
        }

        const body = (await res.json()) as { disponiveis?: string[] };
        const lista = Array.isArray(body.disponiveis) ? body.disponiveis : [];

        if (!ativo) return;

        setHorarios(lista);
      } catch (e: unknown) {
        if (!ativo) return;
        const msg =
          e instanceof Error ? e.message : "Não foi possível carregar os horários.";
        setErro(msg);
        setHorarios([]);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [profissionalId, data, excludeAgendamentoId]);

  return (
    <div>
      <label className={labelClass}>
        <ClockIcon className="w-4 h-4 text-cyan-600" />
        Horários disponíveis *
      </label>

      {!profissionalId ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-500 font-medium">
          {aguardandoProfissional}
        </div>
      ) : !data ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-500 font-medium">
          Selecione uma data para ver os horários disponíveis.
        </div>
      ) : loading ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-500 font-medium animate-pulse">
          Carregando horários...
        </div>
      ) : erro ? (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm text-rose-700 font-medium">
          {erro}
        </div>
      ) : horarios.length === 0 ? (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center text-sm text-amber-800 font-medium">
          Não há horários livres nesta data para este profissional. Escolha outro
          dia ou outro profissional.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {horarios.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => onChange(h)}
              className={`py-3 rounded-xl text-sm font-bold transition-all border cursor-pointer
                ${
                  value === h
                    ? "bg-cyan-600 border-cyan-600 text-white shadow-md shadow-cyan-600/20"
                    : "bg-white border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-cyan-600"
                }`}
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
