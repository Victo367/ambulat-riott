"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  PowerIcon,
  UserIcon,
  UserCircleIcon // <-- Ícone importado para manter o padrão da Sidebar
} from "@heroicons/react/24/outline";

// Função auxiliar para pegar as iniciais do nome
function getIniciais(nome: string) {
  if (!nome) return "P";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

export default function PerfilPaciente() {
  const router = useRouter();

  // Dados estáticos só para demonstração
  const paciente = {
    nome: "Julia Mendes",
    email: "julia12@gmail.com",
    telefone: "83923549878",
    status: "Ativo",
  };

  async function handleLogout() {
    const confirmar = window.confirm(
      "Deseja realmente sair da sua conta?"
    );

    if (!confirmar) return;

    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Erro ao sair. Tente novamente.");
        return;
      }

      router.push("/login");
      router.refresh();

    } catch {
      alert("Erro ao conectar com servidor");
    }
  }

  // Estilos padronizados
  const labelClass = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1";
  const valueClass = "text-slate-900 text-base font-medium";

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto mt-8 px-4 sm:px-0">

      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* NOVO ÍCONE PADRONIZADO DA SIDEBAR */}
          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 shadow-sm shrink-0">
            <UserCircleIcon className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Meu Perfil
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Visualize suas informações de acesso
            </p>
          </div>
        </div>
      </header>

      {/* CARD DE PERFIL */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        
        {/* TOPO DO PERFIL */}
        <div className="bg-slate-50/50 border-b border-slate-100 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          
          <div className="w-24 h-24 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-3xl font-bold shadow-sm shrink-0">
            {getIniciais(paciente.nome)}
          </div>
          
          <div className="text-center md:text-left pt-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {paciente.nome}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                {paciente.status}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                <UserIcon className="w-3.5 h-3.5" />
                Paciente
              </span>
            </div>
          </div>

        </div>

        {/* INFORMAÇÕES PESSOAIS */}
        <div className="p-8 md:p-10">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
            
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-cyan-600 shrink-0">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
              <div>
                <p className={labelClass}>E-mail de Acesso</p>
                <p className={valueClass}>{paciente.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-cyan-600 shrink-0">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <div>
                <p className={labelClass}>Telefone</p>
                <p className={valueClass}>{paciente.telefone}</p>
              </div>
            </div>

          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 mt-12 pt-8 border-t border-slate-100">
            
            <button
              data-cy="logout"
              onClick={handleLogout}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-rose-500 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all cursor-pointer"
            >
              <PowerIcon className="w-4 h-4" />
              Sair da Conta
            </button>

          </div>
          
        </div>
      </div>
    </div>
  );
}