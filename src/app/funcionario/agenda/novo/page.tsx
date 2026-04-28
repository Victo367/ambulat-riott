"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function NovoAgendamento() {
  const router = useRouter();

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

  const labelClass =
    "block text-sm font-bold text-blue-500 mb-2";

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
          Agendamento de Consultas
        </h1>

      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-8 max-w-6xl">

        <form className="space-y-8">

          {/* LINHA 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* PACIENTE */}
            <div>
              <label className={labelClass}>
                Nome Paciente *
              </label>

              <div className="relative">
                <select className={`${inputClass} appearance-none`}>
                  <option value="">
                    Selecione o paciente
                  </option>

                  <option>
                    Marcos Eduardo
                  </option>

                  <option>
                    Ana Clara
                  </option>

                  <option>
                    João Pedro
                  </option>
                </select>

                <ChevronDownIcon className="w-5 h-5 text-blue-500 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* MÉDICO */}
            <div>
              <label className={labelClass}>
                Médico *
              </label>

              <div className="relative">
                <select className={`${inputClass} appearance-none`}>
                  <option value="">
                    Selecione o médico
                  </option>

                  <option>
                    Dr. João Henrique
                  </option>

                  <option>
                    Dra. Fernanda Lima
                  </option>
                </select>

                <ChevronDownIcon className="w-5 h-5 text-blue-500 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* LINHA 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* DATA */}
            <div>
              <label className={labelClass}>
                Data *
              </label>

              <input
                type="date"
                className={inputClass}
              />
            </div>

            {/* HORÁRIO */}
            <div>
              <label className={labelClass}>
                Horário *
              </label>

              <input
                type="time"
                className={inputClass}
              />
            </div>

            {/* STATUS */}
            <div>
              <label className={labelClass}>
                Status
              </label>

              <select className={inputClass}>
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

          {/* OBSERVAÇÕES */}
          <div>
            <label className={labelClass}>
              Observações
            </label>

            <textarea
              rows={5}
              placeholder="Digite observações do atendimento..."
              className={`${inputClass} resize-none`}
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

          {/* BOTÕES */}
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
              Finalizar
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
