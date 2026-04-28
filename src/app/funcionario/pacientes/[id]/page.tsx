"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
};

export default function VisualizarPaciente({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
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
          return;
        }

        setPaciente(data);
      } catch (err) {
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchPaciente();
  }, [id]);

  if (erro) return <p className="text-red-500 p-6">{erro}</p>;
  if (!paciente) return <p className="p-6">Carregando...</p>;

  const labelClass = "text-sm font-bold text-gray-500";
  const valueClass = "text-gray-800 text-sm mt-1";

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex items-center gap-3 mb-8">


        <h1 className="text-2xl font-bold text-blue-500">
          Detalhes do Paciente
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-8 max-w-5xl">

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {paciente.nome}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <p className={labelClass}>Email</p>
            <p className={valueClass}>{paciente.email}</p>
          </div>

          <div>
            <p className={labelClass}>Telefone</p>
            <p className={valueClass}>{paciente.telefone}</p>
          </div>

          <div>
            <p className={labelClass}>Data de nascimento</p>
            <p className={valueClass}>
              {formatarData(paciente.data_nascimento)}
            </p>
          </div>

          <div>
            <p className={labelClass}>Pronomes</p>
            <p className={valueClass}>{paciente.pronomes}</p>
          </div>

          <div>
            <p className={labelClass}>Identidade de gênero</p>
            <p className={valueClass}>{paciente.identidade_genero}</p>
          </div>

          <div>
            <p className={labelClass}>Status</p>
            <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
              {paciente.status}
            </span>
          </div>

        </div>

        <div className="flex justify-between mt-10">

          <button
            onClick={() => router.push("/funcionario/pacientes")}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Voltar
          </button>

          <button
            onClick={() =>
              router.push(`/funcionario/pacientes/${paciente._id}/editar`)
            }
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Editar
          </button>

        </div>
      </div>
    </div>
  );
}