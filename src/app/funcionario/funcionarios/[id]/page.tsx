"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type Funcionario = {
  _id: string;
  nome: string;
  tipo_usuario: string;
  email: string;
  cargo: string;
  data_admissao: string;
  status: string;
};

export default function VisualizarFuncionario({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [funcionario, setFuncionario] =
    useState<Funcionario | null>(null);

  const [erro, setErro] = useState("");

  const router = useRouter();

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "Não informada";

    const data = new Date(
      dataISO.replace(/-/g, "/").replace(/T.+/, "")
    );

    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    async function fetchFuncionario() {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setErro(
            data.error ||
              "Erro ao buscar os dados do funcionário"
          );
          return;
        }

        setFuncionario(data);

      } catch (err) {
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchFuncionario();
  }, [id]);

  if (erro)
    return (
      <p className="text-red-500 p-6">
        {erro}
      </p>
    );

  if (!funcionario)
    return <p className="p-6">Carregando...</p>;

  const labelClass =
    "text-sm font-bold text-gray-500";

  const valueClass =
    "text-gray-800 text-sm mt-1";

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 text-blue-500" />
        </button>

        <h1 className="text-2xl font-bold text-blue-500">
          Detalhes do Funcionário
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-8 max-w-5xl">

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {funcionario.nome}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <p className={labelClass}>Email</p>
            <p className={valueClass}>
              {funcionario.email}
            </p>
          </div>

          <div>
            <p className={labelClass}>Cargo</p>
            <p className={valueClass}>
              {funcionario.cargo}
            </p>
          </div>

          <div>
            <p className={labelClass}>
              Data de admissão
            </p>
            <p className={valueClass}>
              {formatarData(
                funcionario.data_admissao
              )}
            </p>
          </div>

          <div>
            <p className={labelClass}>Status</p>

            <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
              {funcionario.status}
            </span>
          </div>

        </div>

        <div className="flex justify-between mt-10">

          <button
            onClick={() =>
              router.push(
                "/funcionario/funcionarios"
              )
            }
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Voltar
          </button>

          <button
            onClick={() =>
              router.push(
                `/funcionario/funcionarios/${funcionario._id}/editar`
              )
            }
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Editar
          </button>

        </div>
      </div>
    </div>
  );
}
