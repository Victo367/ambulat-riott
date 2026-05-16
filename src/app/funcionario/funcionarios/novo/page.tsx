"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearPageState, usePersistedState } from "@/hooks/usePersistedState";
import { 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from "@heroicons/react/24/outline";

export default function CriarFuncionario() {
  const [nome, setNome] = usePersistedState("nome", "");
  const [cargo, setCargo] = usePersistedState("cargo", "");
  const [dataAdmissao, setDataAdmissao] = usePersistedState("dataAdmissao", "");
  const [email, setEmail] = usePersistedState("email", "");
  const [senha, setSenha] = usePersistedState("senha", "");
  const [status] = usePersistedState("status", "ativo");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!nome || !cargo || !dataAdmissao || !email || !senha) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register/funcionario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          tipo_usuario: "funcionario",
          email,
          senha,
          cargo,
          data_admissao: dataAdmissao,
          status
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao cadastrar funcionário");
        setIsSubmitting(false);
        return;
      }

      setSucesso("Profissional cadastrado com sucesso!");
      clearPageState(pathname);

      setTimeout(() => {
        router.push("/funcionario/funcionarios");
      }, 1000);

    } catch (error) {
      setErro("Erro ao conectar com o servidor");
      setIsSubmitting(false);
    }
  }

  // Estilos Padronizados
  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400";
  const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto mt-8">

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
              Cadastro de Funcionário
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Adicione um novo profissional ao sistema
            </p>
          </div>
        </div>
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
                data-cy="nome"
                required
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={inputClass}
                placeholder="Ex: Ana Silva"
              />
            </div>

            <div>
              <label className={labelClass}>Cargo *</label>
              <input
                data-cy="cargo"
                required
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className={inputClass}
                placeholder="Ex: Desenvolvedor Front-end"
              />
            </div>

            <div>
              <label className={labelClass}>Data de Admissão *</label>
              <input
                data-cy="data-admissao"
                required
                type="date"
                value={dataAdmissao}
                onChange={(e) => setDataAdmissao(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>E-mail Corporativo *</label>
              <input
                data-cy="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="ana.silva@empresa.com"
              />
            </div>

            <div>
              <label className={labelClass}>Senha Temporária *</label>
              <input
                data-cy="senha"
                required
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={inputClass}
                placeholder="Mínimo de 6 caracteres"
              />
            </div>

          </div>

          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 mt-10 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push("/funcionario/funcionarios")}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              data-cy="criar-funcionario"
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}