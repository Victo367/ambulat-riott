"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Paciente = {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
};

function apenasDigitos(s: string) {
  return (s || "").replace(/\D/g, "");
}

function pacienteCombinaBusca(p: Paciente, busca: string) {
  const q = busca.trim().toLowerCase();
  if (!q) return true;
  const nome = (p.nome || "").toLowerCase();
  const email = (p.email || "").toLowerCase();
  if (nome.includes(q) || email.includes(q)) return true;
  const digitosTel = apenasDigitos(p.telefone || "");
  const digitosQ = apenasDigitos(busca);
  if (digitosQ.length > 0 && digitosTel.includes(digitosQ)) return true;
  return false;
}

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const pacientesFiltrados = useMemo(
    () => pacientes.filter((p) => pacienteCombinaBusca(p, busca)),
    [pacientes, busca]
  );

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
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Nome, telefone ou email..."
          aria-label="Buscar paciente por nome, telefone ou email"
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
            {pacientesFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {pacientes.length === 0
                    ? "Nenhum paciente cadastrado."
                    : "Nenhum paciente encontrado para esta busca."}
                </td>
              </tr>
            ) : (
              pacientesFiltrados.map((paciente) => (
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
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
