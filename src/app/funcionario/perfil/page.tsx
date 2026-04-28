"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  UserCircleIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

export default function PerfilFuncionario() {
  const router = useRouter();

  // Dados estáticos só para demonstração
  const funcionario = {
    nome: "Alice Dias",
    email: "alicedias@gamil.com",
    cargo: "Desenvolvedor",
    status: "Ativo",
  };

  async function handleLogout() {
    const confirmar = window.confirm(
      "Deseja realmente sair?"
    );

    if (!confirmar) return;

    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Erro ao sair");
        return;
      }

      router.push("/login");
      router.refresh();

    } catch {
      alert("Erro ao conectar com servidor");
    }
  }

  const cardClass =
    "bg-white rounded-xl shadow border border-gray-200 p-8 max-w-4xl";

  const labelClass = "text-sm font-bold text-gray-500";
  const valueClass = "text-gray-800 text-sm mt-1";

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 text-blue-500" />
        </button>

        <h1 className="text-2xl font-bold text-blue-500">
          Meu Perfil
        </h1>

      </div>

      {/* CARD PERFIL */}
      <div className={cardClass}>

        {/* TOPO */}
        <div className="flex items-center gap-5 pb-8 border-b border-gray-200">

          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <UserCircleIcon className="w-14 h-14 text-blue-500" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {funcionario.nome}
            </h2>

            <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
              {funcionario.status}
            </span>
          </div>

        </div>

        {/* INFOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

          <div className="flex gap-3">
            <EnvelopeIcon className="w-5 h-5 text-blue-500 mt-1" />

            <div>
              <p className={labelClass}>E-mail</p>
              <p className={valueClass}>{funcionario.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <BriefcaseIcon className="w-5 h-5 text-blue-500 mt-1" />

            <div>
              <p className={labelClass}>Cargo</p>
              <p className={valueClass}>{funcionario.cargo}</p>
            </div>
          </div>

        </div>

        {/* BOTÕES */}
        <div className="flex justify-between mt-10 pt-8 border-t border-gray-200">

          <button
            onClick={() => router.push("/funcionario/agenda")}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Voltar
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <PowerIcon className="w-5 h-5" />
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}
