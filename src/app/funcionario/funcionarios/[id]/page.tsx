"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
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
      <div className="max-w-3xl mx-auto mt-10">
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-[24px] shadow-sm">
          <ExclamationCircleIcon className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Não foi possível carregar os dados</h3>
            <p className="text-sm font-medium opacity-80">{erro || "Funcionário não encontrado."}</p>
          </div>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-6 text-slate-500 hover:text-slate-800 font-bold text-sm flex items-center gap-2 px-4 py-2"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <header className="flex items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
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
        
        {/* Botão Editar no Header (Opcional, mas prático) */}
        <button
          onClick={() => router.push(`/funcionario/funcionarios/${funcionario._id}/editar`)}
          className="hidden md:flex bg-cyan-50 text-cyan-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan-100 transition-colors items-center gap-2 cursor-pointer"
        >
          <PencilSquareIcon className="w-5 h-5" />
          Editar Perfil
        </button>
      </header>

      {/* CARD PRINCIPAL */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 md:p-10">
        
        {/* CABEÇALHO DO PERFIL (Avatar e Nome) */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 pb-8 border-b border-slate-100">
          <div className="w-20 h-20 rounded-[20px] bg-gradient-to-tr from-cyan-100 to-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center shadow-inner shrink-0">
            <UserIcon className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {funcionario.nome}
            </h2>
            <div className="flex items-center gap-3 mt-3">
              {/* Badge de Status */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {funcionario.status || "Ativo"}
              </span>
            </div>
          </div>
        </div>

        {/* GRID DE INFORMAÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* E-mail */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] p-5 flex items-start gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-slate-400">
              <EnvelopeIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">E-mail de Contato</p>
              <p className="text-sm font-semibold text-slate-900 break-all">{funcionario.email}</p>
            </div>
          </div>

          {/* Cargo */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] p-5 flex items-start gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-slate-400">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cargo / Função</p>
              <p className="text-sm font-semibold text-slate-900">{funcionario.cargo || "Não definido"}</p>
            </div>
          </div>

          {/* Data Admissão */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] p-5 flex items-start gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-slate-400">
              <CalendarDaysIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Data de Admissão</p>
              <p className="text-sm font-semibold text-slate-900">{formatarData(funcionario.data_admissao)}</p>
            </div>
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
            onClick={() => router.push(`/funcionario/funcionarios/${funcionario._id}/editar`)}
            className="w-full md:w-auto md:hidden bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Editar Informações
          </button>
        </div>

      </div>
    </div>
  );
}