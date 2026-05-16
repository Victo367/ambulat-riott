"use client";

import { useState, useEffect } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon 
} from "@heroicons/react/24/outline";

type MateriaProps = {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string; // O backend deve retornar a URL da imagem salva (ex: S3, Cloudinary)
  slug: string;
};

export default function GerenciarCards() {
  const [materias, setMaterias] = useState<MateriaProps[]>([]);
  const [imagemFile, setImagemFile] = useState<File | null>(null); // Guarda o arquivo físico
  const [previewImg, setPreviewImg] = useState(""); // Apenas para mostrar na tela antes de enviar
  
  const [novaMateria, setNovaMateria] = useState({
    title: "",
    description: "",
    content: "",
  });

  // 1. BUSCAR MATÉRIAS DO BACKEND AO ABRIR A TELA
  useEffect(() => {
    async function carregarConteudo() {
      try {
        const response = await fetch("/api/conteudo");
        if (response.ok) {
          const data = await response.json();
          setMaterias(data);
        }
      } catch (error) {
        console.error("Erro ao buscar as matérias:", error);
      }
    }
    carregarConteudo();
  }, []);

  // Lidar com a seleção da imagem no computador
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemFile(file); // Salva o arquivo para mandar pro back
      setPreviewImg(URL.createObjectURL(file)); // Gera preview temporário na tela
    }
  };

  // 2. ENVIAR NOVA MATÉRIA PARA O BACKEND
  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMateria.title || !novaMateria.description || !novaMateria.content) return;

    // Criamos um FormData para conseguir enviar o arquivo da imagem + textos
    const formData = new FormData();
    formData.append("title", novaMateria.title);
    formData.append("description", novaMateria.description);
    formData.append("content", novaMateria.content);
    if (imagemFile) {
      formData.append("image", imagemFile);
    }

    try {
      const response = await fetch("/api/conteudo", {
        method: "POST",
        // O navegador define o Content-Type automaticamente para multipart/form-data
        body: formData, 
      });

      if (response.ok) {
        const materiaCriada = await response.json();
        
        // Atualiza a lista na tela com o que voltou do backend
        setMaterias([materiaCriada, ...materias]);
        
        // Limpa o formulário
        setNovaMateria({ title: "", description: "", content: "" });
        setImagemFile(null);
        setPreviewImg("");
        alert("Matéria publicada com sucesso!");
      } else {
        alert("Erro ao publicar a matéria. Verifique o backend.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // 3. EXCLUIR MATÉRIA NO BACKEND
  const handleExcluir = async (id: string) => {
    const confirmou = confirm("Tem certeza que deseja apagar esta matéria?");
    if (!confirmou) return;

    try {
      const response = await fetch(`/api/conteudo/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMaterias(materias.filter((m) => m.id !== id));
      } else {
        alert("Falha ao excluir no servidor.");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto mt-8 px-4">
      <header className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
          <DocumentTextIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900">Gerenciar Artigos e Guias</h1>
          <p className="text-xs text-slate-500">Escreva conteúdos informativos para os pacientes do ambulatório.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULÁRIO */}
        <form onSubmit={handlePublicar} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-2">
            <PlusIcon className="w-4 h-4 text-cyan-600" /> Escrever Novo Artigo
          </h2>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Título da Matéria</label>
            <input
              type="text"
              value={novaMateria.title}
              onChange={(e) => setNovaMateria({ ...novaMateria, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-600 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Imagem de Capa</label>
              <input type="file" id="img-up" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <label htmlFor="img-up" className="flex items-center justify-center gap-2 border border-dashed border-cyan-200 bg-cyan-50/40 text-cyan-700 text-xs font-semibold py-3 rounded-xl cursor-pointer hover:bg-cyan-50 transition-colors">
                <ArrowUpTrayIcon className="w-4 h-4" /> {previewImg ? "Imagem Pronta ✔" : "Upload da Imagem"}
              </label>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Resumo (Para o Card)</label>
              <input
                type="text"
                value={novaMateria.description}
                onChange={(e) => setNovaMateria({ ...novaMateria, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-600 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Texto Completo</label>
            <textarea
              value={novaMateria.content}
              onChange={(e) => setNovaMateria({ ...novaMateria, content: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-600 transition-colors min-h-[180px]"
              required
            />
          </div>

          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <CheckCircleIcon className="w-5 h-5" /> Salvar no Banco de Dados
          </button>
        </form>

        {/* LISTA LATERIAL DE ITENS SALVOS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-4">
          <h2 className="text-base font-bold text-slate-800">Artigos no Ar ({materias.length})</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {materias.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div className="truncate pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{m.title}</p>
                </div>
                <button onClick={() => handleExcluir(m.id)} className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer shrink-0">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}