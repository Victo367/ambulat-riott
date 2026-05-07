"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setErro("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error);
        return;
      }

      if (!res.ok) {
        setErro(data.error);
        return;
      }

      window.location.href = "/";

    } catch (err) {
      setErro("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">

        <Image
          src="/login.jpg"
          alt="Logo"
          width={300}
          height={300}
          className="mb-6"
        />

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">

          <input
            data-cy="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-lg text-zinc-900"
          />

          <input
            type="password"
            data-cy="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="p-3 border rounded-lg text-zinc-900"
          />

          <button
            type="submit"
            data-cy="submit"
            className="bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-700 cursor-pointer transition"
          >
            Login
          </button>

          {erro && (
            <p data-cy="error" className="text-red-500 text-sm">{erro}</p>
          )}

        </form>

      </div>
    </div>
  );
}
