"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearPageState, usePersistedState } from "@/hooks/usePersistedState";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  TerapiaHormonalFields,
  terapiaToApiPayload,
  type TerapiaHormonalValues,
} from "@/components/TerapiaHormonalFields";

export default function CriarPaciente() {
  // Estados de Dados Pessoais
  const [nome, setNome] = usePersistedState("nome", "");
  const [dataNascimento, setDataNascimento] = usePersistedState(
    "dataNascimento",
    ""
  );
  const [telefone, setTelefone] = usePersistedState("telefone", "");
  const [email, setEmail] = usePersistedState("email", "");
  const [senha, setSenha] = usePersistedState("senha", "");
  const [pronomes, setPronomes] = usePersistedState("pronomes", "");
  const [identidadeGenero, setIdentidadeGenero] = usePersistedState(
    "identidadeGenero",
    ""
  );
  const [endereco, setEndereco] = usePersistedState("endereco", "");
  const [cpf, setCpf] = usePersistedState("cpf", "");
  const [status, setStatus] = usePersistedState("status", "ativo");
  const [terapia, setTerapia] = usePersistedState<TerapiaHormonalValues>(
    "terapia",
    {
      terapia_hormonal: false,
      dosagem_hormonio: "",
      bloqueador_hormonal: "",
    }
  );

  // Estados de UI
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome || !dataNascimento || !telefone || !email || !senha || !pronomes || !identidadeGenero) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register/paciente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          tipo_usuario: "paciente",
          email,
          senha,
          pronomes,
          identidade_genero: identidadeGenero,
          data_nascimento: dataNascimento,
          telefone,
          status,
          ...terapiaToApiPayload(terapia),
          // Caso a sua API espere endereço e CPF futuramente, eles já estão no state:
          // endereco,
          // cpf
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao cadastrar paciente");
        setIsSubmitting(false);
        return;
      }

      setSucesso("Paciente cadastrado com sucesso!");
      clearPageState(pathname);

      setTimeout(() => {
        router.push("/funcionario/pacientes");
      }, 1000);

    } catch (err) {
      setErro("Erro ao conectar com o servidor");
      setIsSubmitting(false);
    }
  }

  // Estilos Padronizados
  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400";
  const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto mt-8">

      {/* HEADER DA PÁGINA */}
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
              Cadastro de Paciente
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Adicione um novo paciente ao sistema
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
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SESSÃO: INFORMAÇÕES PESSOAIS */}
          <div className="space-y-6">
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight ml-1">Dados Pessoais</h2>
            
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
                  placeholder="Ex: Carlos Silva"
                />
              </div>

              <div>
                <label className={labelClass}>Identidade de Gênero *</label>
                <input 
                  data-cy="identidade-genero" 
                  required
                  type="text" 
                  value={identidadeGenero} 
                  onChange={(e) => setIdentidadeGenero(e.target.value)} 
                  className={inputClass} 
                  placeholder="Ex: Homem Cisgênero"
                />
              </div>

              <div>
                <label className={labelClass}>Data de Nascimento *</label>
                <input 
                  data-cy="data-nascimento" 
                  required
                  type="date" 
                  value={dataNascimento} 
                  onChange={(e) => setDataNascimento(e.target.value)} 
                  className={inputClass} 
                />
              </div>

              <div>
                <label className={labelClass}>Pronomes *</label>
                <input 
                  data-cy="pronomes" 
                  required
                  type="text" 
                  value={pronomes} 
                  onChange={(e) => setPronomes(e.target.value)} 
                  className={inputClass} 
                  placeholder="Ex: Ele/Dele"
                />
              </div>

              <div>
                <label className={labelClass}>Telefone *</label>
                <input 
                  data-cy="telefone" 
                  required
                  type="text" 
                  value={telefone} 
                  onChange={(e) => setTelefone(e.target.value)} 
                  className={inputClass} 
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Endereço *</label>
                <input 
                  data-cy="endereco" 
                  required
                  type="text" 
                  value={endereco} 
                  onChange={(e) => setEndereco(e.target.value)} 
                  className={inputClass} 
                  placeholder="Ex: Rua das Flores, 123"
                />
              </div>

              <div>
                <label className={labelClass}>E-mail *</label>
                <input 
                  data-cy="email" 
                  required
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={inputClass} 
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className={labelClass}>Senha *</label>
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
          </div>

          <div className="pt-8 border-t border-slate-100">
            <TerapiaHormonalFields
              values={terapia}
              onChange={setTerapia}
              inputClass={inputClass}
              labelClass={labelClass}
              title="Terapia Hormonal"
            />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 mt-10 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push("/funcionario/pacientes")}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              data-cy="submit-paciente"
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Finalizando..." : "Finalizar Cadastro"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}