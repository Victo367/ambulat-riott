"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ExclamationCircleIcon 
} from "@heroicons/react/24/outline";

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

      window.location.href = "/";

    } catch (err) {
      setErro("Erro ao conectar com o servidor. Tente novamente.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      
      {/* Removido o transition-all do container principal */}
      <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full max-w-md flex flex-col items-center">
        
        {/* Ilustração / Logo do Login totalmente estática */}
        <div className="relative w-full flex justify-center mb-6">
          <Image
            src="/login.jpg"
            alt="Ilustração de Login"
            width={220}
            height={220}
            className="object-contain"
            priority
          />
        </div>

        {/* Títulos */}
        <div className="text-center w-full mb-8 space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Acesso ao Sistema
          </h2>
          <p className="text-sm text-slate-500">
            Insira suas credenciais para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          
          {/* Input de Email */}
          <div className="relative group">
            <EnvelopeIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-cyan-600" />
            <input
              data-cy="email"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Input de Senha */}
          <div className="relative group">
            <LockClosedIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-cyan-600" />
            <input
              type="password"
              data-cy="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Container de Erro Refinado */}
          {erro && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm animate-fade-in">
              <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
              <p data-cy="error" className="font-medium">{erro}</p>
            </div>
          )}

          {/* Botão de Submit */}
          <button
            type="submit"
            data-cy="submit"
            className="mt-2 w-full bg-cyan-600 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-cyan-600/20 hover:bg-cyan-700 hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer flex justify-center items-center"
          >
            Entrar na Plataforma
          </button>
          
        </form>

      </div>
    </div>
  );
}