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
    Boolean(p.dosagem_hormonio?.trim()) ||
    Boolean(p.bloqueador_hormonal?.trim())
  );
}

export function terapiaFromPaciente(
  p: Partial<TerapiaHormonalValues> | null | undefined
): TerapiaHormonalValues {
  return {
    terapia_hormonal: pacienteEmTerapia(p),
    dosagem_hormonio: p?.dosagem_hormonio || "",
    bloqueador_hormonal: p?.bloqueador_hormonal || "",
  };
}

export function terapiaToApiPayload(values: TerapiaHormonalValues) {
  const dosagem = (values.dosagem_hormonio || "").trim();
  const bloqueador = (values.bloqueador_hormonal || "").trim();
  const emTerapia = Boolean(dosagem || bloqueador);

  return {
    terapia_hormonal: emTerapia,
    dosagem_hormonio: dosagem,
    bloqueador_hormonal: bloqueador,
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
  function atualizarCampo(
    campo: "dosagem_hormonio" | "bloqueador_hormonal",
    valor: string
  ) {
    const atualizado = { ...values, [campo]: valor };
    const dosagem =
      campo === "dosagem_hormonio" ? valor : values.dosagem_hormonio;
    const bloqueador =
      campo === "bloqueador_hormonal" ? valor : values.bloqueador_hormonal;
    atualizado.terapia_hormonal = Boolean(
      dosagem.trim() || bloqueador.trim()
    );
    onChange(atualizado);
  }

  return (
    <div className="space-y-6">
      {title ? (
        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight ml-1">
          {title}
        </h2>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Dosagem do Hormônio</label>
          <input
            data-cy="dosagem-hormonio"
            value={values.dosagem_hormonio}
            disabled={disabled}
            onChange={(e) => atualizarCampo("dosagem_hormonio", e.target.value)}
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
              atualizarCampo("bloqueador_hormonal", e.target.value)
            }
            placeholder="Ex: 50mg Espironolactona / dia"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
