"use client";

import Link from "next/link";
import Image from "next/image";
import { TokenPayload } from "@/lib/auth-usu";
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  UsersIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

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

          <NavItem href="/" icon={HomeIcon} label="Página Inicial" />

          {!user && (
            <NavItem href="/login" icon={UserIcon} label="Login" />
          )}

          {user?.tipo === "paciente" && (
            <>
              <NavItem href="/historico-paciente" icon={ClipboardDocumentListIcon} label="Histórico" />
              <NavItem href="/agenda-paciente" icon={CalendarIcon} label="Agenda" />
              <NavItem href="/perfil-paciente" icon={UserCircleIcon} label="Perfil" />
            </>
          )}

          {user?.tipo === "funcionario" && (
            <>
              <NavItem href="/agenda-funcionario" icon={CalendarIcon} label="Agenda" />
              <NavItem href="/funcionario/pacientes" icon={UsersIcon} label="Pacientes" />
            </>
          )}

        </nav>
      </div>

      <div className="text-sm">
        <div className="flex items-center gap-2">
          <PhoneIcon className="w-5 h-5" />
          <p>+55 83 8225-7290</p>
        </div>

        <p className="mt-2 text-xs opacity-80">
          © Copyright by TT gender
        </p>
      </div>
    </aside>
  );
}

function NavItem({ href, icon: Icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 hover:bg-cyan-700 px-3 py-2 rounded-lg transition"
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}