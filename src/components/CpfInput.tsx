"use client";

import { useCallback, useState, type ChangeEvent } from "react";

import { formatarCpf, somenteDigitosCpf } from "@/lib/cpf";

type Props = {
  id: string;
  /** Valor inicial (normalmente só dígitos vindos do banco). */
  defaultValue?: string | null;
  required?: boolean;
  className?: string;
};

export function CpfInput({ id, defaultValue, required, className }: Props) {
  const [value, setValue] = useState(() => formatarCpf(defaultValue ?? ""));

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(formatarCpf(somenteDigitosCpf(e.target.value)));
  }, []);

  return (
    <input
      id={id}
      name="cpf"
      type="text"
      required={required}
      inputMode="numeric"
      autoComplete="off"
      placeholder="000.000.000-00"
      value={value}
      onChange={onChange}
      maxLength={14}
      className={className}
    />
  );
}
