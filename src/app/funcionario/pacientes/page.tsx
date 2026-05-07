"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Paciente = {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
};

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchPacientes() {
      try {
        const res = await fetch("/api/users/pacientes");
        const data = await res.json();

        if (!res.ok) {
          setErro(data?.error || "Erro ao buscar pacientes");
          return;
        }

        setPacientes(data);
      } catch (err) {
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchPacientes();
  }, []);

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Nome, telefone ou email..."
          className="w-[350px] px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <Link
          href="/funcionario/pacientes/novo"
          data-cy="novo-paciente"
          className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
        >
          Novo Paciente
        </Link>
      </div>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-6 py-3">Nome</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Telefone</th>
            </tr>
          </thead>

          <tbody>
            {pacientes.map((paciente) => (
              <tr
                key={paciente._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3 text-blue-600 font-medium">
                  <button
                    onClick={() =>
                      router.push(`/funcionario/pacientes/${paciente._id}`)
                    }
                    className="hover:underline"
                  >
                    {paciente.nome}
                  </button>
                </td>

                <td className="px-6 py-3 text-gray-700">
                  {paciente.email || "-"}
                </td>

                <td className="px-6 py-3 text-gray-700">
                  {paciente.telefone || "-"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
