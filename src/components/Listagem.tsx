"use client";

import { useState } from "react";

function IconeOlhoAberto({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconeOlhoRiscado({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

type Props = {
  nomeSocial: string;
  nomeCivil: string;
};

/** Listagem: nome social em destaque; nome civil com alternância por ícone de olho. */
export function Listagem({ nomeSocial, nomeCivil }: Props) {
  const [mostrarCivil, setMostrarCivil] = useState(false);
  const civilDiferente = nomeCivil.trim() !== nomeSocial.trim();

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-semibold">{nomeSocial}</span>
      {civilDiferente ? (
        <div className="flex items-start gap-1.5 text-xs font-normal text-zinc-500 dark:text-zinc-400">
          <button
            type="button"
            onClick={() => setMostrarCivil((v) => !v)}
            className="mt-0.5 shrink-0 rounded p-0.5 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            aria-label={
              mostrarCivil ? "Ocultar nome civil" : "Mostrar nome civil"
            }
            aria-pressed={mostrarCivil}
            title={mostrarCivil ? "Ocultar nome civil" : "Mostrar nome civil"}
          >
            {mostrarCivil ? (
              <IconeOlhoRiscado className="h-4 w-4" />
            ) : (
              <IconeOlhoAberto className="h-4 w-4" />
            )}
          </button>
          <span className="min-w-0 break-words">
            <span className="text-zinc-500 dark:text-zinc-400">Nome civil: </span>
            {mostrarCivil ? (
              <span className="text-zinc-700 dark:text-zinc-300">{nomeCivil}</span>
            ) : (
              <span className="tracking-widest text-zinc-400 dark:text-zinc-500">
                {"•".repeat(Math.min(Math.max(nomeCivil.length, 6), 14))}
              </span>
            )}
          </span>
        </div>
      ) : null}
    </div>
  );
}
