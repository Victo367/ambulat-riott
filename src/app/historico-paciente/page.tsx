"use client";

import { useState } from "react";
import { getUserFromToken, TokenPayload } from "@/lib/auth-usu";

type Historico = {
  titulo: string;
  medico: string;
  medicamentos: string[];
};

export default function HistoricoPaciente() {
  const [user] = useState<TokenPayload | null>(() => getUserFromToken());

  const historicos: Historico[] = [
    {
      titulo: "03/01/2026",
      medico: "Médico - Dr. Rafael",
      medicamentos: [
        "4mg - Primogyna - 1/dia",
        "100mg - Espironolactona - 1/dia",
      ],
    },
    {
      titulo: "22/09/2025 - 02/01/2026",
      medico: "Médico - Dr. Rafael",
      medicamentos: [
        "2mg - Primogyna - 1/dia",
        "100mg - Espironolactona - 1/dia",
      ],
    },
    {
      titulo: "03/01/2026",
      medico: "Médico - Dr. Rafael",
      medicamentos: [
        "4mg - Primogyna - 1/dia",
        "100mg - Espironolactona - 1/dia",
      ],
    },
    {
      titulo: "22/09/2025 - 02/01/2026",
      medico: "Médico - Dr. Rafael",
      medicamentos: [
        "2mg - Primogyna - 1/dia",
        "100mg - Espironolactona - 1/dia",
      ],
    },
  ];

  return (
    <div className=" min-h-screen flex">
      <div className="w-full max-w-6xl px-10 py-6">
        
        {/* Título */}
        <h1 className="text-2xl font-bold text-cyan-700 mb-6">
          Terapia Hormonal
        </h1>

        {/* Card principal */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-5 rounded-2xl shadow-md mb-8 w-full max-w-xl">
          <p><strong>Medicamento:</strong> Primogyna</p>
          <p><strong>Dosagem:</strong> 4mg - 1/dia</p>
          <p><strong>Responsável:</strong> Dr. Rafael</p>
        </div>

        {/* Subtítulo */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Histórico da terapia hormonal
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {historicos.map((item, index) => (
            <CardHistorico key={index} data={item} />
          ))}
        </div>

      </div>
    </div>
  );
}

function CardHistorico({ data }: { data: Historico }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
      <h3 className="font-bold text-gray-800 mb-2">
        {data.titulo}
      </h3>

      <p className="text-sm text-gray-700">
        {data.medico}
      </p>

      <div className="mt-2">
        {data.medicamentos.map((med, i) => (
          <p key={i} className="text-sm text-gray-600">
            {med}
          </p>
        ))}
      </div>
    </div>
  );
}