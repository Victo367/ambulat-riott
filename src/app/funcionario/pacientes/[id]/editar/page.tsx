"use client";

import { useEffect, useState, use } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearPageState } from "@/hooks/usePersistedState";
import {
  ArrowLeftIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function EditarPaciente({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const pathname = usePathname();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [pronomes, setPronomes] = useState("");
  const [identidadeGenero, setIdentidadeGenero] = useState("");
  const [status, setStatus] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    clearPageState(pathname);
  }, [pathname, id]);

  useEffect(() => {
    async function fetchPaciente() {
      try {
        const res = await fetch(`/api/users/${id}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setErro(errorData.error || "Erro ao buscar paciente");
          setIsFetching(false);
          return;
        }

        const data = await res.json();

        setNome(data.nome || "");
        setDataNascimento(data.data_nascimento?.split("T")[0] || "");
        setTelefone(data.telefone || "");
        setEmail(data.email || "");
        setPronomes(data.pronomes || "");
        setIdentidadeGenero(data.identidade_genero || "");
        setStatus(data.status || "");
      } catch {
        setErro("Erro ao conectar com o servidor");
      } finally {
        setIsFetching(false);
      }
    }

    fetchPaciente();
  }, [id]);

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
          data_nascimento: dataNascimento,
          telefone,
          email,
          pronomes,
          identidade_genero: identidadeGenero,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao atualizar o cadastro");
        setIsSubmitting(false);
        return;
      }

      setSucesso("Paciente atualizado com sucesso!");
      clearPageState(pathname);

      setTimeout(() => {
        router.push(`/funcionario/pacientes/${id}`);
      }, 1000);
    } catch {
      setErro("Erro ao conectar com o servidor");
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Atenção: Deseja realmente deletar este paciente? Esta ação não pode ser desfeita."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

      if (!res.ok) {
        alert("Erro ao deletar o paciente. Tente novamente.");
        return;
      }

      router.push("/funcionario/pacientes");
    } catch {
      alert("Erro de conexão ao tentar deletar.");
    }
  }

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400";
  const labelClass =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">
          Carregando dados do paciente...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto mt-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Editar Paciente
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Atualize as informações cadastrais
            </p>
          </div>
        </div>

        <button
          type="button"
          data-cy="deletar"
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-100"
        >
          <TrashIcon className="w-4 h-4" />
          Deletar Cadastro
        </button>
      </header>

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

      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight ml-1">
              Dados Pessoais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Nome completo *</label>
                <input
                  data-cy="nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Identidade de gênero *</label>
                <input
                  data-cy="identidade-genero"
                  required
                  value={identidadeGenero}
                  onChange={(e) => setIdentidadeGenero(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Data de Nascimento</label>
                <input
                  data-cy="data"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Pronomes</label>
                <input
                  data-cy="pronomes"
                  value={pronomes}
                  onChange={(e) => setPronomes(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Telefone</label>
                <input
                  data-cy="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>E-mail</label>
                <input
                  data-cy="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-1">
                <label className={labelClass}>Status</label>
                <input
                  data-cy="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 mt-10 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push(`/funcionario/pacientes/${id}`)}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              data-cy="submit-editar"
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
