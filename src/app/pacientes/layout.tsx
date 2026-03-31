import type { ReactNode } from "react";
import { Sidenav } from "@/components/Sidenav";

/** Evita pré-render no build e acessa o MySQL só em tempo de requisição. */
export const dynamic = "force-dynamic";

export default function PacientesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start">
      <Sidenav />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
