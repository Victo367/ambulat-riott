"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CriarPaciente() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [pronomes, setPronomes] = useState("");
  const [identidadeGenero, setIdentidadeGenero] = useState("");
  const [status, setStatus] = useState("ativo");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Verifica se todos os campos estão preenchidos
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
      console.error("Erro ao cadastrar paciente:", err);
      setErro("Erro ao conectar com o servidor");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Cadastrar Novo Paciente</h1>

      {erro && <p className="text-red-500">{erro}</p>}
      {sucesso && <p className="text-green-500">{sucesso}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg placeholder-gray-600 text-gray-800"
              placeholder="Digite o nome do paciente"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Data de Nascimento</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg placeholder-gray-600 text-gray-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg placeholder-gray-600 text-gray-800"
              placeholder="Digite o telefone do paciente"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg placeholder-gray-600 text-gray-800"
              placeholder="Digite o email do paciente"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg placeholder-gray-600 text-gray-800"
              placeholder="Digite a senha"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Pronomes</label>
            <input
              type="text"
              value={pronomes}
              onChange={(e) => setPronomes(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg placeholder-gray-600 text-gray-800"
              placeholder="Digite os pronomes (ex: ela/dela)"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Identidade de Gênero</label>
          <input
            type="text"
            value={identidadeGenero}
            onChange={(e) => setIdentidadeGenero(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg placeholder-gray-600 text-gray-800"
            placeholder="Digite a identidade de gênero (ex: Mulher)"
            required
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push("/funcionario/pacientes")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
