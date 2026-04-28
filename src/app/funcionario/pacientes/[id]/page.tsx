"use client";

import { useEffect, useState, use } from "react"; // Importe o 'use'
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

// Ajuste na tipagem: params agora é uma Promise
export default function VisualizarPaciente({ params }: { params: Promise<{ id: string }> }) {
  // Desembrulha o params usando o hook use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchPaciente() {
      try {
        // Usa o 'id' extraído dos params resolvidos
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

  if (erro) {
    return <p className="text-red-500">{erro}</p>;
  }

  if (!paciente) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Nome do Paciente em Destaque */}
      <h1 className="text-3xl font-bold text-blue-500 mb-6">{paciente.nome}</h1>

      {/* Tabela com os Atributos do Paciente */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800">Email</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.email}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800">Pronomes</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.pronomes}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800">Identidade de Gênero</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.identidade_genero}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800">Data de Nascimento</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.data_nascimento}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-800">Telefone</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.telefone}</td>
          </tr>
        </tbody>
      </table>

      {/* Botões de Voltar e Editar */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.push("/funcionario/pacientes")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Voltar
        </button>

        <button
          onClick={() => router.push(`/funcionario/pacientes/${paciente._id}/editar`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
