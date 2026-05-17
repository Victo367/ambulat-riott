"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon,
  PencilSquareIcon,
  UserIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

type Funcionario = {
  _id: string;
  nome: string;
  tipo_usuario: string;
  email: string;
  cargo: string;
  data_admissao: string;
  status: string;
};

// Função auxiliar para pegar as iniciais do nome (igual a de paciente)
function getIniciais(nome: string) {
  if (!nome) return "F";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

export default function VisualizarFuncionario({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "Não informada";
    const data = new Date(dataISO.replace(/-/g, "/").replace(/T.+/, ""));
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    async function fetchFuncionario() {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setErro(data.error || "Erro ao buscar os dados do funcionário");
          return;
        }

        setFuncionario(data);
      } catch (err) {
        setErro("Erro ao conectar com o servidor");
      } finally {
        setLoading(false);
      }
    }

    fetchFuncionario();
  }, [id]);

  // ESTADO DE CARREGAMENTO
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Carregando perfil...</p>
      </div>
    );
  }

  // ESTADO DE ERRO
  if (erro || !funcionario) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-8 animate-fade-in">
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-2xl">
          <ExclamationCircleIcon className="w-8 h-8 shrink-0" />
          <div>
            <h2 className="font-bold text-lg mb-1">Ops! Ocorreu um problema.</h2>
            <p className="text-sm">{erro || "Funcionário não encontrado."}</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/funcionario/funcionarios")}
          className="mt-6 flex items-center gap-2 text-slate-500 hover:text-cyan-600 font-semibold transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Voltar para a lista
        </button>
      </div>
    );
  }

  const labelDisplayClass = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1";
  const valueClass = "text-slate-900 text-base font-medium";

  const funcionarioId = String(funcionario._id);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto mt-8">
      
      {/* HEADER DA PÁGINA */}
      <header className="flex items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push("/funcionario/funcionarios")}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Perfil do Profissional
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Informações detalhadas e status
            </p>
          </div>
        </div>
        
        <button
          onClick={() => router.push(`/funcionario/funcionarios/${funcionarioId}/editar`)}
          className="hidden md:flex bg-cyan-50 text-cyan-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan-100 transition-colors items-center gap-2 cursor-pointer"
        >
          <PencilSquareIcon className="w-5 h-5" />
          Editar Perfil
        </button>
      </header>

      {/* CARD PRINCIPAL */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        
        {/* Cabeçalho do Perfil */}
        <div className="bg-slate-50/50 border-b border-slate-100 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-3xl font-bold shadow-sm shrink-0">
            {getIniciais(funcionario.nome)}
          </div>
          <div className="text-center md:text-left pt-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {funcionario.nome}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                {funcionario.status || "Ativo"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                <UserIcon className="w-3.5 h-3.5" />
                Funcionário
              </span>
            </div>
          </div>
        </div>

        {/* Informações (Grid) */}
        <div className="p-8 md:p-10">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <p className={labelDisplayClass}>E-mail</p>
              <p className={valueClass}>{funcionario.email || "Não informado"}</p>
            </div>

            <div>
              <p className={labelDisplayClass}>Cargo</p>
              <p className={valueClass}>{funcionario.cargo || "Não definido"}</p>
            </div>

            <div>
              <p className={labelDisplayClass}>Data de Admissão</p>
              <p className={valueClass}>
                {formatarData(funcionario.data_admissao)}
              </p>
            </div>
          </div>

          {/* FOOTER DO CARD (Botões Mobile/Secundários) */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-slate-100">
            <button
              onClick={() => router.push("/funcionario/funcionarios")}
              className="w-full md:w-auto px-6 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
            >
              Voltar para a lista
            </button>

            <button
              onClick={() => router.push(`/funcionario/funcionarios/${funcionarioId}/editar`)}
              className="w-full md:w-auto md:hidden bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Editar Funcionário
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}