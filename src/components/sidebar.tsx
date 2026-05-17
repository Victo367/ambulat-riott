"use client";

import { useEffect, useState, type ComponentType } from "react";
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
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type SidebarProps = {
  user: TokenPayload | null;
};

export default function Sidebar({ user }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Barra superior — celular */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#074e5e] border-b border-cyan-950/30 flex items-center justify-between px-4 shadow-md">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 -ml-1 rounded-lg text-cyan-100 hover:bg-cyan-600/20 transition-colors"
          aria-label="Abrir menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <Image src="/logo.png" alt="" width={28} height={28} className="rounded-md shrink-0" />
          <span className="text-sm font-bold text-white truncate">Ambulatório TT</span>
        </div>
        <div className="w-10" aria-hidden />
      </header>

      {/* Overlay */}
      {open && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px]"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Menu lateral */}
      <aside
        className={`w-68 max-w-[85vw] h-screen bg-[#074e5e] text-slate-100 flex flex-col justify-between p-6 fixed left-0 top-0 border-r border-cyan-950/30 shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-[60] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-cyan-800/40">
            <div className="flex items-center gap-3 min-w-0">
              <Image
                src="/logo.png"
                alt="Logo Ambulatório TT"
                width={36}
                height={36}
                className="rounded-lg shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-base font-bold tracking-tight text-white leading-tight truncate">
                  Ambulatório TT
                </h1>
                <span className="text-[11px] text-cyan-200/70 uppercase tracking-widest font-semibold">
                  Portal de Saúde
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="lg:hidden p-2 rounded-lg text-cyan-100 hover:bg-cyan-600/20 shrink-0"
              aria-label="Fechar menu"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            <span className="text-[10px] font-bold text-cyan-300/50 uppercase tracking-wider pl-3 block mb-2">
              Navegação
            </span>
            <nav className="flex flex-col gap-1.5">
              <NavItem href="/" icon={HomeIcon} label="Página Inicial" onNavigate={() => setOpen(false)} />

              {!user && (
                <NavItem href="/login" icon={UserIcon} label="Login" onNavigate={() => setOpen(false)} />
              )}

              {user?.tipo === "paciente" && (
                <>
                  <NavItem
                    href="/paciente/historico"
                    icon={ClipboardDocumentListIcon}
                    label="Histórico"
                    onNavigate={() => setOpen(false)}
                  />
                  <NavItem
                    href="/paciente/agenda"
                    icon={CalendarIcon}
                    label="Agenda"
                    onNavigate={() => setOpen(false)}
                  />
                  <NavItem
                    href="/paciente/perfil"
                    icon={UserCircleIcon}
                    label="Perfil"
                    onNavigate={() => setOpen(false)}
                  />
                </>
              )}

              {user?.tipo === "funcionario" && (
                <>
                  <NavItem
                    href="/funcionario/agenda"
                    icon={CalendarIcon}
                    label="Agenda"
                    onNavigate={() => setOpen(false)}
                  />
                  <NavItem
                    href="/funcionario/pacientes"
                    icon={UsersIcon}
                    label="Pacientes"
                    onNavigate={() => setOpen(false)}
                  />
                  <NavItem
                    href="/funcionario/funcionarios"
                    icon={UsersIcon}
                    label="Funcionários"
                    onNavigate={() => setOpen(false)}
                  />
                  <NavItem
                    href="/funcionario/conteudo"
                    icon={DocumentTextIcon}
                    label="Conteúdo do Site"
                    onNavigate={() => setOpen(false)}
                  />
                  <NavItem
                    href="/funcionario/perfil"
                    icon={UserCircleIcon}
                    label="Perfil"
                    onNavigate={() => setOpen(false)}
                  />
                </>
              )}
            </nav>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="bg-cyan-950/40 border border-cyan-800/30 rounded-2xl p-4 transition-all hover:bg-cyan-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-600/20 rounded-lg text-cyan-300 shrink-0">
                <PhoneIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-cyan-300/70 font-medium">Suporte / Contato</p>
                <p className="text-xs font-semibold text-white tracking-wide break-words">
                  +55 83 8225-7290
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-cyan-800/20 flex items-center justify-between text-[10px] text-cyan-300/40">
              <span>© TT Gender</span>
              <span className="font-mono">v2.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

type NavItemProps = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onNavigate?: () => void;
};

function NavItem({ href, icon: Icon, label, onNavigate }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
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
      <Icon
        className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
          active ? "text-cyan-300" : "text-cyan-200/60 group-hover:text-cyan-200"
        }`}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}
