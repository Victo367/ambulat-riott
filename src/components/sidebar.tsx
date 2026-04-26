"use client";

import Link from "next/link";
import Image from "next/image";
import { TokenPayload } from "@/lib/auth-usu";
import { HomeIcon, UserIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

type SidebarProps = {
  user: TokenPayload | null;
};

export default function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="w-64 h-screen bg-cyan-600 text-white flex flex-col justify-between p-4 fixed left-0 top-0">
      <div>
        <h1 className="text-xl font-bold mb-8 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo Ambulatório TT"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span>Ambulatório TT</span>
        </h1>

        <nav className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <HomeIcon className="w-5 h-5" />
            Página Inicial
          </Link>

          {!user && (
            <Link href="/login" className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Login
            </Link>
          )}

          {user?.tipo === "paciente" && (
            <>
              <Link href="/historico-paciente">Histórico</Link>
              <Link href="/agenda-paciente">Agenda</Link>
              <Link href="/perfil-paciente">Perfil</Link>
            </>
          )}

          {user?.tipo === "funcionario" && (
            <>
              <Link href="/agenda-funcionario">Agenda</Link>
              <Link href="/funcionario/pacientes">Pacientes</Link>
            </>
          )}
        </nav>
      </div>

      <div className="text-sm">
        <div className="flex items-center gap-2">
          <DevicePhoneMobileIcon className="w-5 h-5" />
          <p>+55 83 8225-7290</p>
        </div>

        <p className="mt-2 text-xs opacity-80">
          © Copyright by TT gender
        </p>
      </div>
    </aside>
  );
}
