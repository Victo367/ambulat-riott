"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function EditarPaciente({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const router = useRouter();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [pronomes, setPronomes] = useState("");
  const [identidadeGenero, setIdentidadeGenero] = useState("");
  const [status, setStatus] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function fetchPaciente() {
      try {
        const res = await fetch(`/api/users/${id}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setErro(errorData.error || "Erro ao buscar paciente");
          return;
        }

        const data = await res.json();

        setNome(data.nome || "");
        setDataNascimento(data.data_nascimento?.split("T")[0] || "");
        setTelefone(data.telefone || "");
        setEmail(data.email || "");
        setPronomes(data.pronomes || "");
        setIdentidadeGenero(data.identidade_genero || "");
        setStatus(data.status || "");
      } catch {
        setErro("Erro ao conectar com o servidor");
      }
    }
    
    fetchPaciente();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
        setErro(data.error || "Erro ao atualizar");
        return;
      }

      setSucesso("Paciente atualizado com sucesso!");

      setTimeout(() => {
        router.push(`/funcionario/pacientes/${id}`);
      }, 800);
    } catch {
      setErro("Erro ao conectar com o servidor");
    }
  }

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

  const labelClass = "block text-sm font-bold text-blue-500 mb-1";

  if (erro) return <p className="text-red-500 p-6">{erro}</p>;

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

          <h1 className="text-2xl font-bold text-blue-500">
            Editar Paciente
          </h1>
        </div>

        {/* DELETE */}
        <button
          onClick={async () => {
            const confirmDelete = window.confirm("Deseja deletar este paciente?");
            if (!confirmDelete) return;

            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

            if (!res.ok) {
              alert("Erro ao deletar");
              return;
            }

            router.push("/funcionario/pacientes");
          }}
          className="text-red-500 font-semibold hover:underline"
        >
          Deletar
        </button>
      </div>

      {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}

      {/* FORM CARD */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-8 max-w-5xl">

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="md:col-span-2">
              <label className={labelClass}>Nome completo *</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Identidade de gênero *</label>
              <input value={identidadeGenero} onChange={(e) => setIdentidadeGenero(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Data de Nascimento</label>
              <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Pronomes</label>
              <input value={pronomes} onChange={(e) => setPronomes(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Telefone</label>
              <input value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>E-mail</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Status</label>
              <input value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass} />
            </div>

          </div>

          {/* BOTÕES */}
          <div className="flex justify-between mt-8 pt-6 border-t">

            <button
              type="button"
              onClick={() => router.push(`/funcionario/pacientes/${id}`)}
              className="border border-red-400 text-red-500 px-6 py-2 rounded-lg hover:bg-red-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600 font-semibold"
            >
              Salvar Alterações
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
