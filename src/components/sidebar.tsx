"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TokenPayload } from "@/lib/auth-usu";
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  UsersIcon,
  PhoneIcon,
  DocumentTextIcon // <-- Adicionado o ícone para a área de conteúdo
} from "@heroicons/react/24/outline";

type SidebarProps = {
  user: TokenPayload | null;
};

export default function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="w-68 h-screen bg-[#074e5e] text-slate-100 flex flex-col justify-between p-6 fixed left-0 top-0 border-r border-cyan-950/30 shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-50">
      <div>
        {/* Logo Brand Area - Fundo branco removido, igual ao original */}
        <div className="flex items-center gap-3 pb-8 mb-6 border-b border-cyan-800/40">
          <Image
            src="/logo.png"
            alt="Logo Ambulatório TT"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">
              Ambulatório TT
            </h1>
            <span className="text-[11px] text-cyan-200/70 uppercase tracking-widest font-semibold">
              Portal de Saúde
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-cyan-300/50 uppercase tracking-wider pl-3 block mb-2">
            Navegação
          </span>
          <nav className="flex flex-col gap-1.5">
            <NavItem href="/" icon={HomeIcon} label="Página Inicial" />

            {!user && (
              <NavItem href="/login" icon={UserIcon} label="Login" />
            )}

            {user?.tipo === "paciente" && (
              <>
                <NavItem href="/paciente/historico" icon={ClipboardDocumentListIcon} label="Histórico" />
                <NavItem href="/paciente/agenda" icon={CalendarIcon} label="Agenda" />
                <NavItem href="/paciente/perfil" icon={UserCircleIcon} label="Perfil" />
              </>
            )}

            {user?.tipo === "funcionario" && (
              <>
                <NavItem href="/funcionario/agenda" icon={CalendarIcon} label="Agenda" />
                <NavItem href="/funcionario/pacientes" icon={UsersIcon} label="Pacientes" />
                <NavItem href="/funcionario/funcionarios" icon={UsersIcon} label="Funcionários" />
                {/* NOVO ITEM PARA GERENCIAR OS CARDS DA HOME */}
                <NavItem href="/funcionario/conteudo" icon={DocumentTextIcon} label="Conteúdo do Site" />
                <NavItem href="/funcionario/perfil" icon={UserCircleIcon} label="Perfil" />
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Footer Info da Sidebar */}
      <div className="mt-auto">
        <div className="bg-cyan-950/40 border border-cyan-800/30 rounded-2xl p-4 transition-all hover:bg-cyan-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600/20 rounded-lg text-cyan-300">
              <PhoneIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-cyan-300/70 font-medium">Suporte / Contato</p>
              <p className="text-xs font-semibold text-white tracking-wide">+55 83 8225-7290</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-cyan-800/20 flex items-center justify-between text-[10px] text-cyan-300/40">
            <span>© TT Gender</span>
            <span className="font-mono">v2.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ href, icon: Icon, label }: any) {
  const pathname = usePathname();
  // Lógica inteligente: o próprio componente verifica se a URL atual bate com o link dele
  const active = pathname === href;

  return (
    <Link
      href={href}
      data-cy={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
      className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
        active 
          ? "bg-cyan-600/30 text-white font-semibold shadow-sm" 
          : "text-cyan-100/80 hover:text-white hover:bg-cyan-600/15"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-r-md" />
      )}
      <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${active ? "text-cyan-300" : "text-cyan-200/60 group-hover:text-cyan-200"}`} />
      {label}
    </Link>
  );
}