"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  UsersIcon,
  ExclamationCircleIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

type Funcionario = {
  _id: string;
  nome: string;
  cargo: string;
  email: string;
};

function funcionarioCombinaBusca(f: Funcionario, busca: string) {
  const q = busca.trim().toLowerCase();
  if (!q) return true;
  const nome = (f.nome || "").toLowerCase();
  const cargo = (f.cargo || "").toLowerCase();
  const email = (f.email || "").toLowerCase();
  return nome.includes(q) || cargo.includes(q) || email.includes(q);
}

export default function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const funcionariosFiltrados = useMemo(
    () => funcionarios.filter((f) => funcionarioCombinaBusca(f, busca)),
    [funcionarios, busca]
  );

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const res = await fetch("/api/users/funcionarios");
        const data = await res.json();

        if (!res.ok) {
          setErro(data?.error || "Erro ao buscar funcionários");
          return;
        }

        setFuncionarios(data);
      } catch (err) {
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchFuncionarios();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 shadow-sm">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestão de Equipe
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Visualize e gerencie os profissionais da unidade
            </p>
          </div>
        </div>

        <button
          data-cy="novo-funcionario"
          onClick={() => router.push("/funcionario/funcionarios/novo")}
          className="bg-cyan-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md shadow-cyan-600/20 hover:bg-cyan-700 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Funcionário
        </button>
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
            placeholder="Buscar por nome, cargo ou email..."
            aria-label="Buscar funcionário"
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* ÁREA DA TABELA */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Nome do Profissional</th>
                <th className="px-8 py-5">Cargo / Função</th>
                <th className="px-8 py-5">E-mail de Contato</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {funcionariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <UserGroupIcon className="w-12 h-12 mb-3 text-slate-300" />
                      <p className="text-base font-semibold text-slate-600">
                        {funcionarios.length === 0
                          ? "Nenhum funcionário cadastrado ainda."
                          : "Nenhum funcionário encontrado."}
                      </p>
                      <p className="text-sm mt-1">
                        {funcionarios.length === 0
                          ? "Clique em 'Novo Funcionário' para começar."
                          : "Tente ajustar os termos da sua busca."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                funcionariosFiltrados.map((funcionario) => (
                  <tr
                    key={funcionario._id}
                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
                  >
                    {/* Nome (Clicável) */}
                    <td className="px-8 py-5 whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/funcionario/funcionarios/${funcionario._id}`)}
                        className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors text-left focus:outline-none focus:underline"
                      >
                        {funcionario.nome}
                      </button>
                    </td>

                    {/* Cargo */}
                    <td className="px-8 py-5 whitespace-nowrap text-slate-600 font-medium">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {funcionario.cargo || "Não definido"}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-8 py-5 whitespace-nowrap text-slate-500">
                      {funcionario.email || "-"}
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