"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CriarFuncionario() {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState("ativo");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!nome || !cargo || !dataAdmissao || !email || !senha) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await fetch("/api/register/funcionario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          tipo_usuario: "funcionario",
          email,
          senha,
          cargo,
          data_admissao: dataAdmissao,
          status
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao cadastrar funcionário");
        return;
      }

      setSucesso("Funcionário cadastrado com sucesso!");

      router.push("/funcionario/funcionarios");

    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    }
  }

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

  const labelClass =
    "block text-sm font-bold text-blue-500 mb-1";

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
          Cadastro de Funcionário
        </h1>
      </div>

      {erro && (
        <p className="text-red-500 mb-4">{erro}</p>
      )}

      {sucesso && (
        <p className="text-green-500 mb-4">{sucesso}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2">
            <label className={labelClass}>
              Nome completo *
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Cargo *
            </label>

            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Data de Admissão *
            </label>

            <input
              type="date"
              value={dataAdmissao}
              onChange={(e) => setDataAdmissao(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              E-mail *
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Senha *
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={inputClass}
            />
          </div>

        </div>

        <div className="flex justify-between mt-10">

          <button
            type="button"
            onClick={() =>
              router.push("/funcionario/funcionarios")
            }
            className="border border-red-400 text-red-500 px-6 py-2 rounded-lg hover:bg-red-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600"
          >
            Finalizar
          </button>

        </div>
      </form>
    </div>
  );
}
