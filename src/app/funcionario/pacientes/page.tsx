"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePersistedState } from "@/hooks/usePersistedState";
import Link from "next/link";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon,
  ExclamationCircleIcon,
  IdentificationIcon
} from "@heroicons/react/24/outline";

type Paciente = {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
};

function apenasDigitos(s: string) {
  return (s || "").replace(/\D/g, "");
}

function pacienteCombinaBusca(p: Paciente, busca: string) {
  const q = busca.trim().toLowerCase();
  if (!q) return true;
  const nome = (p.nome || "").toLowerCase();
  const email = (p.email || "").toLowerCase();
  if (nome.includes(q) || email.includes(q)) return true;
  const digitosTel = apenasDigitos(p.telefone || "");
  const digitosQ = apenasDigitos(busca);
  if (digitosQ.length > 0 && digitosTel.includes(digitosQ)) return true;
  return false;
}

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = usePersistedState("busca", "");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const pacientesFiltrados = useMemo(
    () => pacientes.filter((p) => pacienteCombinaBusca(p, busca)),
    [pacientes, busca]
  );

  useEffect(() => {
    async function fetchPacientes() {
      try {
        const res = await fetch("/api/users/pacientes");
        const data = await res.json();

        if (!res.ok) {
          setErro(data?.error || "Erro ao buscar pacientes");
          return;
        }

        setPacientes(data);
      } catch (err) {
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchPacientes();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 shadow-sm">
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestão de Pacientes
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Visualize, busque e gerencie os cadastros
            </p>
          </div>
        </div>

        <Link
          href="/funcionario/pacientes/novo"
          data-cy="novo-paciente"
          className="bg-cyan-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md shadow-cyan-600/20 hover:bg-cyan-700 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Paciente
        </Link>
      </header>

      {/* CONTROLES (Busca e Erro) */}
      <div className="flex flex-col gap-4">
        
        {/* Erro Banner */}
        {erro && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm animate-fade-in">
            <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
            <p className="font-semibold">{erro}</p>
          </div>
        )}

        {/* Input de Busca */}
        <div className="relative group max-w-md w-full">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-600 transition-colors" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            aria-label="Buscar paciente"
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* ÁREA DA TABELA */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        
        <div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest hidden md:table-header-group">
              <tr>
                <th className="px-4 lg:px-8 py-4">Nome do Paciente</th>
                <th className="px-4 lg:px-8 py-4">E-mail de Contato</th>
                <th className="px-4 lg:px-8 py-4">Telefone</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 block md:table-row-group">
              {pacientesFiltrados.length === 0 ? (
                <tr className="block md:table-row">
                  <td colSpan={3} className="block md:table-cell px-4 lg:px-8 py-12 md:py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <IdentificationIcon className="w-12 h-12 mb-3 text-slate-300" />
                      <p className="text-base font-semibold text-slate-600">
                        {pacientes.length === 0
                          ? "Nenhum paciente cadastrado ainda."
                          : "Nenhum paciente encontrado para esta busca."}
                      </p>
                      <p className="text-sm mt-1">
                        {pacientes.length === 0
                          ? "Clique em 'Novo Paciente' para começar."
                          : "Tente ajustar os termos pesquisados."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((paciente) => (
                  <tr
                    key={paciente._id}
                    className="block md:table-row p-4 md:p-0 hover:bg-slate-50/80 transition-colors duration-150 group"
                  >
                    <td className="block md:table-cell px-4 lg:px-8 py-2 md:py-5">
                      <div className="md:hidden text-[11px] uppercase text-slate-400 font-bold mb-1">
                        Nome
                      </div>
                      <button
                        onClick={() => router.push(`/funcionario/pacientes/${paciente._id}`)}
                        className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors text-left focus:outline-none focus:underline break-words"
                      >
                        {paciente.nome}
                      </button>
                    </td>

                    <td className="block md:table-cell px-4 lg:px-8 py-2 md:py-5 text-slate-500 font-medium">
                      <div className="md:hidden text-[11px] uppercase text-slate-400 font-bold mb-1">
                        E-mail
                      </div>
                      <span className="break-all">{paciente.email || "-"}</span>
                    </td>

                    <td className="block md:table-cell px-4 lg:px-8 py-2 md:py-5 text-slate-500">
                      <div className="md:hidden text-[11px] uppercase text-slate-400 font-bold mb-1">
                        Telefone
                      </div>
                      {paciente.telefone || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}