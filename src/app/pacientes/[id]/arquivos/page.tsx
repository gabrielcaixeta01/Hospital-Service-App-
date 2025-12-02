"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ArquivoClinico {
  id: number;
  nome_arquivo: string;
  mime_type: string;
  criado_em: string;
}

export default function ArquivosPacientePage() {
  const params = useParams();
  const router = useRouter();
  const pacienteId = params?.id as string;

  const [files, setFiles] = useState<ArquivoClinico[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API_BASE = "http://localhost:4000/api/v1";

  async function loadFiles() {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/arquivo-clinico/paciente/${pacienteId}`
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setFiles(data);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar arquivos clínicos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!file) {
      alert("Selecione um arquivo primeiro.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API_BASE}/arquivo-clinico/upload/${pacienteId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error(await res.text());

      alert("Arquivo enviado com sucesso!");
      setFile(null);
      await loadFiles();
    } catch (e) {
      console.error(e);
      alert("Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

    try {
      const res = await fetch(`${API_BASE}/arquivo-clinico/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      await loadFiles();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir arquivo.");
    }
  }

  useEffect(() => {
    if (pacienteId) {
      loadFiles();
    }
  }, [pacienteId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-800">
          Arquivos clínicos do paciente #{pacienteId}
        </h1>

        <button
          onClick={() => router.push(`/pacientes/${pacienteId}`)}
          className="px-3 py-2 border rounded hover:bg-gray-50"
        >
          Voltar
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Enviar novo arquivo</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {uploading ? "Enviando..." : "Enviar"}
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Arquivos enviados</h2>

        {loading ? (
          <div>Carregando...</div>
        ) : files.length === 0 ? (
          <div className="text-gray-600">Nenhum arquivo cadastrado.</div>
        ) : (
          <ul className="space-y-2">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between border rounded px-3 py-2"
              >
                <div>
                  <div className="font-medium">{f.nome_arquivo}</div>
                  <div className="text-xs text-gray-500">
                    {f.mime_type} •{" "}
                    {new Date(f.criado_em).toLocaleString("pt-BR")}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`${API_BASE}/arquivo-clinico/${f.id}/download`}
                    className="px-2 py-1 text-sm bg-green-600 text-white rounded"
                  >
                    Baixar
                  </a>

                  <button
                    onClick={() => handleDelete(f.id)}
                    className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
