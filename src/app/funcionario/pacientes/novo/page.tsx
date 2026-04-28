"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CriarPaciente() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [pronomes, setPronomes] = useState("");
  const [identidadeGenero, setIdentidadeGenero] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cpf, setCpf] = useState("");
  const [status, setStatus] = useState("ativo");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome || !dataNascimento || !telefone || !email || !senha || !pronomes || !identidadeGenero) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const res = await fetch("/api/register/paciente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          tipo_usuario: "paciente",
          email,
          senha,
          pronomes,
          identidade_genero: identidadeGenero,
          data_nascimento: dataNascimento,
          telefone,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao cadastrar paciente");
        return;
      }

      setSucesso("Paciente cadastrado com sucesso!");
      router.push("/funcionario/pacientes");
    } catch (err) {
      setErro("Erro ao conectar com o servidor");
    }
  }

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

  const labelClass = "block text-sm font-bold text-blue-500 mb-1";

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
          Cadastro de Paciente
        </h1>
      </div>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}
      {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2">
            <label className={labelClass}>Nome completo *</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Identidade de gênero *</label>
            <input type="text" value={identidadeGenero} onChange={(e) => setIdentidadeGenero(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Data de Nascimento *</label>
            <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Pronomes *</label>
            <input type="text" value={pronomes} onChange={(e) => setPronomes(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Endereço *</label>
            <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>CPF *</label>
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Telefone *</label>
            <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>E-mail *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Senha *</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={() => router.push("/funcionario/pacientes")}
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