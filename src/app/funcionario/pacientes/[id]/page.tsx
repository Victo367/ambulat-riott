"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilIcon,
  PencilSquareIcon,
  ExclamationCircleIcon,
  UserIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  TerapiaHormonalFields,
  pacienteEmTerapia,
  terapiaFromPaciente,
  terapiaToApiPayload,
  type TerapiaHormonalValues,
} from "@/components/TerapiaHormonalFields";

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
  terapia_hormonal?: boolean;
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

export default function VisualizarPaciente() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [editandoTerapia, setEditandoTerapia] = useState(false);
  const [terapiaForm, setTerapiaForm] = useState<TerapiaHormonalValues>({
    terapia_hormonal: false,
    dosagem_hormonio: "",
    bloqueador_hormonal: "",
  });
  const [salvandoTerapia, setSalvandoTerapia] = useState(false);
  const [msgTerapia, setMsgTerapia] = useState("");
  const router = useRouter();

  const inputClassForm =
    "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all placeholder:text-slate-400";
  const labelClassForm =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

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
    if (!id) {
      setErro("Identificador do paciente inválido.");
      setLoading(false);
      return;
    }

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
        setTerapiaForm(terapiaFromPaciente(data));
      } catch {
        setErro("Erro ao conectar com o servidor");
      } finally {
        setLoading(false);
      }
    }

    fetchPaciente();
  }, [id]);

  function iniciarEdicaoTerapia() {
    if (!paciente) return;
    setTerapiaForm(terapiaFromPaciente(paciente));
    setMsgTerapia("");
    setEditandoTerapia(true);
  }

  function cancelarEdicaoTerapia() {
    if (paciente) setTerapiaForm(terapiaFromPaciente(paciente));
    setMsgTerapia("");
    setEditandoTerapia(false);
  }

  async function salvarTerapia() {
    if (!paciente) return;
    setSalvandoTerapia(true);
    setMsgTerapia("");
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(terapiaToApiPayload(terapiaForm)),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsgTerapia(data.error || "Erro ao salvar terapia hormonal");
        return;
      }
      setPaciente(data);
      setTerapiaForm(terapiaFromPaciente(data));
      setEditandoTerapia(false);
      setMsgTerapia("Terapia hormonal atualizada com sucesso.");
    } catch {
      setMsgTerapia("Erro ao conectar com o servidor");
    } finally {
      setSalvandoTerapia(false);
    }
  }

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

  const labelDisplayClass =
    "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1";
  const valueClass = "text-slate-900 text-base font-medium";

  const possuiTerapiaHormonal = pacienteEmTerapia(paciente);
  const pacienteId = String(paciente._id);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto mt-8">

      {/* HEADER DA PÁGINA */}
      <header className="flex items-center justify-between gap-5 bg-white p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <div className="flex items-center gap-5">
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

        {/* Botão Editar no Header (Igual a Funcionário) */}
        <button
          onClick={() => router.push(`/funcionario/pacientes/${pacienteId}/editar`)}
          className="hidden md:flex bg-cyan-50 text-cyan-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan-100 transition-colors items-center gap-2 cursor-pointer"
        >
          <PencilSquareIcon className="w-5 h-5" />
          Editar Paciente
        </button>
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
              <p className={labelDisplayClass}>Email</p>
              <p className={valueClass}>{paciente.email || "Não informado"}</p>
            </div>

            <div>
              <p className={labelDisplayClass}>Telefone</p>
              <p className={valueClass}>{paciente.telefone || "Não informado"}</p>
            </div>

            <div>
              <p className={labelDisplayClass}>Data de Nascimento</p>
              <p className={valueClass}>
                {formatarData(paciente.data_nascimento)}
              </p>
            </div>

            <div>
              <p className={labelDisplayClass}>Pronomes</p>
              <p className={valueClass}>{paciente.pronomes || "Não informado"}</p>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <p className={labelDisplayClass}>Identidade de Gênero</p>
              <p className={valueClass}>{paciente.identidade_genero || "Não informada"}</p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight ml-1">
                Terapia Hormonal
              </h3>
              {!editandoTerapia && (
                <button
                  type="button"
                  data-cy="editar-terapia"
                  onClick={iniciarEdicaoTerapia}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-100 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  {possuiTerapiaHormonal ? "Editar terapia" : "Registrar terapia"}
                </button>
              )}
            </div>

            {msgTerapia && (
              <p
                className={`text-sm font-medium mb-4 ml-1 ${
                  msgTerapia.includes("sucesso")
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {msgTerapia}
              </p>
            )}

            {editandoTerapia ? (
              <div className="space-y-6">
                <TerapiaHormonalFields
                  values={terapiaForm}
                  onChange={setTerapiaForm}
                  inputClass={inputClassForm}
                  labelClass={labelClassForm}
                  title=""
                />
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={cancelarEdicaoTerapia}
                    disabled={salvandoTerapia}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    type="button"
                    data-cy="salvar-terapia"
                    onClick={salvarTerapia}
                    disabled={salvandoTerapia}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
                  >
                    <CheckIcon className="w-4 h-4" />
                    {salvandoTerapia ? "Salvando..." : "Salvar terapia"}
                  </button>
                </div>
              </div>
            ) : possuiTerapiaHormonal ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                {paciente.dosagem_hormonio && (
                  <div>
                    <p className={labelDisplayClass}>Dosagem do Hormônio</p>
                    <p className={valueClass}>{paciente.dosagem_hormonio}</p>
                  </div>
                )}
                {paciente.bloqueador_hormonal && (
                  <div>
                    <p className={labelDisplayClass}>Bloqueador Hormonal</p>
                    <p className={valueClass}>{paciente.bloqueador_hormonal}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 ml-1">
                Nenhuma terapia hormonal registrada para este paciente.
              </p>
            )}
          </div>

          {/* FOOTER DO CARD (Botões Mobile/Secundários) */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-slate-100">
            <button
              onClick={() => router.push("/funcionario/pacientes")}
              className="w-full md:w-auto px-6 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
            >
              Voltar para a lista
            </button>

            <button
              data-cy="editar-paciente"
              onClick={() => router.push(`/funcionario/pacientes/${pacienteId}/editar`)}
              className="w-full md:w-auto md:hidden bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Editar Paciente
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}