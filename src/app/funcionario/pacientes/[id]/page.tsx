"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  ExclamationCircleIcon,
  UserIcon
} from "@heroicons/react/24/outline";

type Paciente = {
  _id: string;
  nome: string;
  tipo_usuario: string;
  email: string;
  pronomes: string;
  identidade_genero: string;
  data_nascimento: string;
  telefone: string;
  status: string;
  dosagem_hormonio?: string;
  bloqueador_hormonal?: string;
};

// Função auxiliar para pegar as iniciais do nome
function getIniciais(nome: string) {
  if (!nome) return "P";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

export default function VisualizarPaciente({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
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
    async function fetchPaciente() {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setErro(data.error || "Erro ao buscar os dados do paciente");
          setLoading(false);
          return;
        }

        setPaciente(data);
      } catch (err) {
        setErro("Erro ao conectar com o servidor");
      } finally {
        setLoading(false);
      }
    }

    fetchPaciente();
  }, [id]);

  // ESTADO DE ERRO INICIAL
  if (erro) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-8 animate-fade-in">
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-2xl">
          <ExclamationCircleIcon className="w-8 h-8 shrink-0" />
          <div>
            <h2 className="font-bold text-lg mb-1">Ops! Ocorreu um problema.</h2>
            <p className="text-sm">{erro}</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/funcionario/pacientes")}
          className="mt-6 flex items-center gap-2 text-slate-500 hover:text-cyan-600 font-semibold transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Voltar para a lista
        </button>
      </div>
    );
  }

  // ESTADO DE CARREGAMENTO INICIAL
  if (loading || !paciente) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Carregando prontuário...</p>
      </div>
    );
  }

  // Estilos padronizados
  const labelClass = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1";
  const valueClass = "text-slate-900 text-base font-medium";

  // Verificação se existe alguma informação de Terapia Hormonal
  const possuiTerapiaHormonal = paciente.dosagem_hormonio || paciente.bloqueador_hormonal;

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto mt-8">

      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/funcionario/pacientes")}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-cyan-600 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Ficha do Paciente
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Detalhes e informações cadastrais
            </p>
          </div>
        </div>
      </header>

      {/* CARD DE DETALHES */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        
        {/* Cabeçalho do Perfil */}
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
                {paciente.status || "Ativo"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                <UserIcon className="w-3.5 h-3.5" />
                Paciente
              </span>
            </div>
          </div>
        </div>

        {/* Informações (Grid) */}
        <div className="p-8 md:p-10">
          
          {/* SESSÃO: DADOS PESSOAIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <p className={labelClass}>Email</p>
              <p className={valueClass}>{paciente.email || "Não informado"}</p>
            </div>

            <div>
              <p className={labelClass}>Telefone</p>
              <p className={valueClass}>{paciente.telefone || "Não informado"}</p>
            </div>

            <div>
              <p className={labelClass}>Data de Nascimento</p>
              <p className={valueClass}>
                {formatarData(paciente.data_nascimento)}
              </p>
            </div>

            <div>
              <p className={labelClass}>Pronomes</p>
              <p className={valueClass}>{paciente.pronomes || "Não informado"}</p>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <p className={labelClass}>Identidade de Gênero</p>
              <p className={valueClass}>{paciente.identidade_genero || "Não informada"}</p>
            </div>
          </div>

          {/* SESSÃO CONDICIONAL: TERAPIA HORMONAL */}
          {possuiTerapiaHormonal && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight mb-6 ml-1">
                Terapia Hormonal Atual
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                
                {paciente.dosagem_hormonio && (
                  <div>
                    <p className={labelClass}>Dosagem do Hormônio</p>
                    <p className={valueClass}>{paciente.dosagem_hormonio}</p>
                  </div>
                )}

                {paciente.bloqueador_hormonal && (
                  <div>
                    <p className={labelClass}>Bloqueador Hormonal</p>
                    <p className={valueClass}>{paciente.bloqueador_hormonal}</p>
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 mt-12 pt-8 border-t border-slate-100">
            <button
              onClick={() => router.push("/funcionario/pacientes")}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Voltar à Lista
            </button>

            <button
              data-cy="editar-paciente"
              onClick={() => router.push(`/funcionario/pacientes/${paciente._id}/editar`)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all cursor-pointer"
            >
              <PencilIcon className="w-4 h-4" />
              Editar Paciente
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}