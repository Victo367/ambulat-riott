"use client";

import { useCallback, useState, type ChangeEvent } from "react";

import { formatarTelefone, somenteDigitosTelefone } from "@/lib/telefone";

type Props = {
  id: string;
  defaultValue?: string | null;
  required?: boolean;
  className?: string;
};

export function TelefoneInput({ id, defaultValue, required, className }: Props) {
  const [value, setValue] = useState(() => formatarTelefone(defaultValue ?? ""));

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(formatarTelefone(somenteDigitosTelefone(e.target.value)));
  }, []);

  return (
    <input
      id={id}
      name="telefone"
      type="tel"
      required={required}
      inputMode="tel"
      autoComplete="tel"
      placeholder="(00) 00000-0000"
      value={value}
      onChange={onChange}
      maxLength={15}
      className={className}
    />
  );
}
