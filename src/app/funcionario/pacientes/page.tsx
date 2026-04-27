"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Paciente = {
  _id: string;
  nome: string;
  data_nascimento: string;
  telefone: string;
  email: string;
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
          setErro(data.error || "Erro ao buscar pacientes");
          return;
        }

        setPacientes(data);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchPacientes();
  }, []);

  return (
    <div>
<div className="flex justify-between items-center mb-4">
  <input type="text" placeholder="Nome, telefone..." className="p-3 border rounded-lg text-zinc-900">
  </input>
  <button
  onClick={() => router.push("/funcionario/pacientes/novo")}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    Novo Paciente
  </button>
</div>

{erro && <p className="text-red-500">{erro}</p>}

<table className="table-auto w-full border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-100">
      <th className="border border-gray-300 px-4 py-2 font-bold text-gray-800">Nome</th>
      <th className="border border-gray-300 px-4 py-2 font-bold text-gray-800">Email</th>
      <th className="border border-gray-300 px-4 py-2 font-bold text-gray-800">Telefone</th>
    </tr>
  </thead>
  <tbody>
    {pacientes.map((paciente) => (
      <tr key={paciente._id}>
        <td className="border border-gray-300 px-4 py-2 text-blue-500">{paciente.nome}</td>
        <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.email}</td>
        <td className="border border-gray-300 px-4 py-2 text-gray-900">{paciente.telefone}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
