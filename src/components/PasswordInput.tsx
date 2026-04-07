"use client";

import { useMemo, useState, type ChangeEvent } from "react";

type Props = {
  id: string;
  name: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
};

export function PasswordInput({
  id,
  name,
  required,
  minLength,
  autoComplete,
  placeholder,
  className,
}: Props) {
  const [mostrar, setMostrar] = useState(false);
  const [value, setValue] = useState("");

  const requisitos = useMemo(
    () => ({
      minimo8: value.length >= 8,
      maiuscula: /[A-Z]/.test(value),
      especial: /[^A-Za-z0-9]/.test(value),
    }),
    [value],
  );

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          id={id}
          name={name}
          type={mostrar ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={className}
          value={value}
          onChange={onChange}
        />
       
      </div>

      <div className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={requisitos.minimo8} readOnly />
          Minimo de 8 caracteres
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={requisitos.maiuscula} readOnly />
          Pelo menos 1 letra maiuscula
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={requisitos.especial} readOnly />
          Pelo menos 1 caractere especial
        </label>
      </div>
    </div>
  );
}
