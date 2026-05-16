"use client";

export type TerapiaHormonalValues = {
  terapia_hormonal: boolean;
  dosagem_hormonio: string;
  bloqueador_hormonal: string;
};

export function pacienteEmTerapia(
  p: Partial<TerapiaHormonalValues> | null | undefined
) {
  if (!p) return false;
  return (
    Boolean(p.terapia_hormonal) ||
    Boolean(p.dosagem_hormonio) ||
    Boolean(p.bloqueador_hormonal)
  );
}

export function terapiaFromPaciente(
  p: Partial<TerapiaHormonalValues> | null | undefined
): TerapiaHormonalValues {
  const ativo = pacienteEmTerapia(p);
  return {
    terapia_hormonal: ativo,
    dosagem_hormonio: p?.dosagem_hormonio || "",
    bloqueador_hormonal: p?.bloqueador_hormonal || "",
  };
}

export function terapiaToApiPayload(values: TerapiaHormonalValues) {
  return {
    terapia_hormonal: values.terapia_hormonal,
    dosagem_hormonio: values.terapia_hormonal ? values.dosagem_hormonio : "",
    bloqueador_hormonal: values.terapia_hormonal
      ? values.bloqueador_hormonal
      : "",
  };
}

type TerapiaHormonalFieldsProps = {
  values: TerapiaHormonalValues;
  onChange: (values: TerapiaHormonalValues) => void;
  inputClass: string;
  labelClass: string;
  title?: string;
  disabled?: boolean;
};

export function TerapiaHormonalFields({
  values,
  onChange,
  inputClass,
  labelClass,
  title = "Terapia Hormonal",
  disabled = false,
}: TerapiaHormonalFieldsProps) {
  return (
    <div className="space-y-6">
      {title ? (
        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight ml-1">
          {title}
        </h2>
      ) : null}

      <label className="flex items-center gap-3 cursor-pointer w-fit group">
        <input
          type="checkbox"
          data-cy="terapia-hormonal"
          checked={values.terapia_hormonal}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              ...values,
              terapia_hormonal: e.target.checked,
            })
          }
          className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600/20 cursor-pointer disabled:opacity-50"
        />
        <span className="text-sm font-semibold text-slate-700 group-hover:text-cyan-700 transition-colors">
          Paciente realiza terapia hormonal
        </span>
      </label>

      {values.terapia_hormonal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div>
            <label className={labelClass}>Dosagem do Hormônio</label>
            <input
              data-cy="dosagem-hormonio"
              value={values.dosagem_hormonio}
              disabled={disabled}
              onChange={(e) =>
                onChange({ ...values, dosagem_hormonio: e.target.value })
              }
              placeholder="Ex: 2mg Valerato de Estradiol / dia"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Bloqueador Hormonal</label>
            <input
              data-cy="bloqueador-hormonal"
              value={values.bloqueador_hormonal}
              disabled={disabled}
              onChange={(e) =>
                onChange({ ...values, bloqueador_hormonal: e.target.value })
              }
              placeholder="Ex: 50mg Espironolactona / dia"
              className={inputClass}
            />
          </div>
        </div>
      )}
    </div>
  );
}
