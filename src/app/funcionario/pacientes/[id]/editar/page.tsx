"use client";

import { useEffect, useState, use } from "react"; // Importado o 'use'
import { useRouter } from "next/navigation";

// Ajuste na tipagem para receber a Promise
export default function EditarPaciente({ params }: { params: Promise<{ id: string }> }) {
  // Desembrulhando o params
  const { id } = use(params);

  const [sucesso, setSucesso] = useState("");
  const router = useRouter();

  // Estados para os atributos do paciente
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [pronomes, setPronomes] = useState("");
  const [identidadeGenero, setIdentidadeGenero] = useState("");
  const [status, setStatus] = useState("");
  const [erro, setErro] = useState("");

  // Busca os dados do paciente ao carregar a página
  useEffect(() => {
    async function fetchPaciente() {
      try {
        const res = await fetch(`/api/users/${id}`);

        // Verificação de segurança para o erro 404/HTML que você teve antes
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setErro(errorData.error || `Erro ${res.status}: Não foi possível encontrar o paciente.`);
          return;
        }

        const data = await res.json();

        // Preenche os campos (garantindo que não venham nulos)
        setNome(data.nome || "");
        setDataNascimento(data.data_nascimento?.split("T")[0] || ""); // Formata a data para YYYY-MM-DD
        setTelefone(data.telefone || "");
        setEmail(data.email || "");
        setPronomes(data.pronomes || "");
        setIdentidadeGenero(data.identidade_genero || "");
        setStatus(data.status || "");
      } catch (err) {
        console.error("Erro ao buscar os dados do paciente:", err);
        setErro("Erro ao conectar com o servidor");
      }
    }

    fetchPaciente();
  }, [id]);

  // Função para enviar os dados atualizados para a API
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          data_nascimento: dataNascimento,
          telefone,
          email,
          pronomes,
          identidade_genero: identidadeGenero,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao atualizar os dados do paciente");
        return;
      }

      setSucesso("Paciente atualizado com sucesso!");


      setTimeout(() => {
        router.push(`/funcionario/pacientes/${id}`);
      }, 900);
    } catch (err) {
      console.error("Erro ao atualizar os dados do paciente:", err);
      setErro("Erro ao conectar com o servidor");
    }
  }

  if (erro) {
    return <p className="text-red-500">{erro}</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Editar Paciente</h1>

      {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos organizados em duas colunas */}
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

          <div>
            <label className="block text-gray-700 font-bold mb-2">Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg placeholder-gray-600 text-gray-800"
              placeholder="Digite o status (ex: ativo)"
              required
            />
          </div>
        </div>

        {/* Botões de Cancelar e Salvar */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push(`/funcionario/pacientes/${id}`)} // Redireciona para a página de visualização do paciente
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancelar
          </button>

           <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
