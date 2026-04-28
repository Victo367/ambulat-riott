"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

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

  // Função para formatar a data
  const formatarData = (dataISO: string) => {
    if (!dataISO) return "Não informada";

    const data = new Date(dataISO.replace(/-/g, '\/').replace(/T.+/, ''));

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
        console.error("Erro ao buscar os dados do paciente:", err);
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchPaciente();
  }, [id]);

  if (erro) return <p className="text-red-500 p-6">{erro}</p>;
  if (!paciente) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">{paciente.nome}</h1>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800 bg-gray-50 w-1/3">Email</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.email}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800 bg-gray-50">Pronomes</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.pronomes}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800 bg-gray-50">Identidade de Gênero</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.identidade_genero}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800 bg-gray-50">Data de Nascimento</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">
              {/* Aqui usamos a função de formatação */}
              {formatarData(paciente.data_nascimento)}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800 bg-gray-50">Telefone</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.telefone}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.push("/funcionario/pacientes")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Voltar
        </button>

        <button
          onClick={() => router.push(`/funcionario/pacientes/${paciente._id}/editar`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
