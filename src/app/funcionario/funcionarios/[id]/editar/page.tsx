"use client";

import { useEffect, useState, use } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearPageState,
  hasPersistedPageState,
  usePersistedState,
} from "@/hooks/usePersistedState";
import { 
  ArrowLeftIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from "@heroicons/react/24/outline";

export default function EditarFuncionario({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const pathname = usePathname();

  const [nome, setNome] = usePersistedState("nome", "");
  const [cargo, setCargo] = usePersistedState("cargo", "");
  const [dataAdmissao, setDataAdmissao] = usePersistedState("dataAdmissao", "");
  const [email, setEmail] = usePersistedState("email", "");
  const [status, setStatus] = usePersistedState("status", "");

  // Estados da UI
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function fetchFuncionario() {
      try {
        const res = await fetch(`/api/users/${id}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setErro(errorData.error || "Erro ao buscar dados do funcionário");
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!hasPersistedPageState(pathname)) {
          setNome(data.nome || "");
          setCargo(data.cargo || "");
          setDataAdmissao(data.data_admissao?.split("T")[0] || "");
          setEmail(data.email || "");
          setStatus(data.status || "");
        }
      } catch {
        setErro("Erro ao conectar com o servidor");
      } finally {
        setLoading(false);
      }
    }

    fetchFuncionario();
  }, [id, pathname]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          cargo,
          data_admissao: dataAdmissao,
          email,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao atualizar");
        setIsSubmitting(false);
        return;
      }

      setSucesso("Informações atualizadas com sucesso!");
      clearPageState(pathname);

      setTimeout(() => {
        router.push(`/funcionario/funcionarios/${id}`);
      }, 1000);
    } catch {
      setErro("Erro ao conectar com o servidor");
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Atenção: Deseja realmente deletar este funcionário? Esta ação não pode ser desfeita.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Erro ao deletar o funcionário.");
        return;
      }
      router.push("/funcionario/funcionarios");
    } catch {
      alert("Erro ao conectar com o servidor para deletar.");
    }
  }

  // Estilos Padronizados
  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400";
  const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

  // ESTADO DE CARREGAMENTO INICIAL
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Editar Profissional
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Atualize as informações cadastrais
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <TrashIcon className="w-5 h-5" />
          Remover
        </button>
      </header>

      {/* ALERTAS DE FEEDBACK */}
      {erro && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm animate-fade-in">
          <ExclamationCircleIcon className="w-6 h-6 shrink-0" />
          <p className="font-semibold">{erro}</p>
        </div>
      )}

      {sucesso && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl text-sm animate-fade-in">
          <CheckCircleIcon className="w-6 h-6 shrink-0" />
          <p className="font-semibold">{sucesso}</p>
        </div>
      )}

      {/* FORMULÁRIO */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className={labelClass}>Nome completo *</label>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={inputClass}
                placeholder="Ex: Ana Silva"
              />
            </div>

            <div>
              <label className={labelClass}>Cargo *</label>
              <input
                required
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className={inputClass}
                placeholder="Ex: Desenvolvedora Front-end"
              />
            </div>

            <div>
              <label className={labelClass}>Data de Admissão</label>
              <input
                type="date"
                value={dataAdmissao}
                onChange={(e) => setDataAdmissao(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>E-mail Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="ana.silva@empresa.com"
              />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
                placeholder="Ex: Ativo, Férias, Inativo..."
              />
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 mt-10 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}