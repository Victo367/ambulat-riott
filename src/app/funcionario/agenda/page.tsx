"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function AgendaFuncionario() {
  const router = useRouter();

  const horarios = [
    {
      hora: "08:00",
      paciente: "Marcos Eduardo",
      tipo: "Consulta Inicial",
      status: "Confirmado",
    },
    {
      hora: "09:30",
      paciente: "Ana Clara",
      tipo: "Retorno",
      status: "Confirmado",
    },
    {
      hora: "11:00",
      paciente: "João Pedro",
      tipo: "Avaliação",
      status: "Cancelado",
    },
    {
      hora: "14:00",
      paciente: "Fernanda Lima",
      tipo: "Consulta",
      status: "Confirmado",
    },
    {
      hora: "16:00",
      paciente: "Carlos Henrique",
      tipo: "Retorno",
      status: "Cancelado",
    },
  ];

  function statusClass(status: string) {
    if (status === "Confirmado") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Pendente") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 text-blue-500" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-blue-500">
              Agenda do Funcionário
            </h1>

            <p className="text-sm text-gray-500">
              Segunda-feira, 28 de Abril de 2026
            </p>
          </div>
        </div>

        <button
        type="button"
        onClick={() =>
          router.push(
            `/funcionario/agenda/novo`
          )
        }
          className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Novo Agendamento
        </button>

      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <p className="text-sm text-gray-500 font-medium">
            Total do Dia
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            5
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <p className="text-sm text-gray-500 font-medium">
            Confirmados
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            3
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <p className="text-sm text-gray-500 font-medium">
            Pendentes
          </p>

          <h2 className="text-3xl font-bold text-yellow-500 mt-2">
            1
          </h2>
        </div>

      </div>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            Agendamentos de Hoje
          </h2>
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-6 py-3">
                Horário
              </th>

              <th className="text-left px-6 py-3">
                Paciente
              </th>

              <th className="text-left px-6 py-3">
                Tipo
              </th>

              <th className="text-left px-6 py-3">
                Status
              </th>

              <th className="text-left px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {horarios.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-semibold text-gray-700">
                  {item.hora}
                </td>

                <td className="px-6 py-4 text-blue-600 font-medium">
                  {item.paciente}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {item.tipo}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${statusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline text-sm">
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
