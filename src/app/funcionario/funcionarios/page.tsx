"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Funcionario = {
  _id: string;
  nome: string;
  cargo: string;
  email: string;
};

export default function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const res = await fetch("/api/users/funcionarios");
        const data = await res.json();

        if (!res.ok) {
          setErro(data?.error || "Erro ao buscar funcionários");
          return;
        }

        setFuncionarios(data);
      } catch (err) {
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchFuncionarios();
  }, []);

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Nome, cargo ou email..."
          className="w-[350px] px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button
          onClick={() => router.push("/funcionario/funcionarios/novo")}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
        >
          Novo Funcionário
        </button>
      </div>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-6 py-3">Nome</th>
              <th className="text-left px-6 py-3">Cargo</th>
              <th className="text-left px-6 py-3">Email</th>
            </tr>
          </thead>

          <tbody>
            {funcionarios.map((funcionario) => (
              <tr
                key={funcionario._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3 text-blue-600 font-medium">
                  <button
                    onClick={() =>
                      router.push(`/funcionario/funcionarios/${funcionario._id}`)
                    }
                    className="hover:underline"
                  >
                    {funcionario.nome}
                  </button>
                </td>

                <td className="px-6 py-3 text-gray-700">
                  {funcionario.cargo || "-"}
                </td>

                <td className="px-6 py-3 text-gray-700">
                  {funcionario.email || "-"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
