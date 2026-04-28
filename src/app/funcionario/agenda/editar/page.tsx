"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function EditarAgendamento() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-10">

        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 text-blue-500" />
        </button>

        <h1 className="text-3xl font-bold text-blue-500">
          Editar Agendamento
        </h1>

      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-8 max-w-6xl">

        <form className="space-y-8">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Paciente */}
            <div>
              <label className="block text-sm font-bold text-blue-500 mb-2">
                Nome Paciente *
              </label>

              <div className="relative">
                <input
                  value="Marcos Eduardo"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-700"
                />

                <ChevronDownIcon className="w-5 h-5 text-blue-500 absolute right-4 top-3.5" />
              </div>
            </div>

            {/* Médico */}
            <div>
              <label className="block text-sm font-bold text-blue-500 mb-2">
                Médico *
              </label>

              <div className="relative">
                <input
                  value="Dr. João Henrique"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-700"
                />

                <ChevronDownIcon className="w-5 h-5 text-blue-500 absolute right-4 top-3.5" />
              </div>
            </div>

          </div>

          {/* LINHA 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Data */}
            <div>
              <label className="block text-sm font-bold text-blue-500 mb-2">
                Data *
              </label>

              <input
                type="date"
                defaultValue="2026-04-28"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
              />
            </div>

            {/* Horário */}
            <div>
              <label className="block text-sm font-bold text-blue-500 mb-2">
                Horário *
              </label>

              <input
                type="time"
                defaultValue="09:30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-blue-500 mb-2">
                Status
              </label>

              <select
                defaultValue="confirmado"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
              >
                <option value="confirmado">
                  Confirmado
                </option>
                <option value="pendente">
                  Pendente
                </option>
                <option value="cancelado">
                  Cancelado
                </option>
              </select>
            </div>

          </div>

          {/* OBSERVAÇÃO */}
          <div>
            <label className="block text-sm font-bold text-blue-500 mb-2">
              Observações
            </label>

            <textarea
              rows={5}
              defaultValue="Paciente solicitou retorno para avaliação."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 resize-none"
            />
          </div>

          {/* TERAPIA */}
          <div className="w-fit">
            <button
              type="button"
              className="border border-gray-300 px-5 py-3 rounded-lg text-blue-500 font-semibold bg-white hover:bg-gray-50 transition flex items-center gap-2"
            >
              Terapia Vinculada
              <ChevronDownIcon className="w-4 h-4 text-pink-400" />
            </button>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between pt-10">

            <button
              type="button"
              onClick={() => router.back()}
              className="border border-red-400 text-red-500 px-8 py-3 rounded-lg hover:bg-red-50 font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white px-10 py-3 rounded-lg hover:bg-green-600 font-semibold"
            >
              Salvar Alterações
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
