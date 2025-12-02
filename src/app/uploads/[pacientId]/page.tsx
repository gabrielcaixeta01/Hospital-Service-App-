"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, postForm, getJson } from "@/utils/api";

type FileAPI = {
  id: number;
  nome: string;
  url?: string | null;
  tamanho?: number | null;
  criadoEm?: string | null;
};

export default function Page() {
  const router = useRouter();
  const { pacientId } = useParams() as { pacientId: string };
  const [files, setFiles] = useState<FileAPI[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!pacientId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await api(`/pacientes/${pacientId}/arquivos-clinicos`);
        if (res.ok) setFiles(await res.json());
        else setFiles([]);
      } catch (err) {
        console.error(err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [pacientId]);

  const handleUpload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pacientId || !file) return alert("Selecione um arquivo");
    setSaving(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("descricao", descricao || "");
      form.append("pacienteId", String(pacientId));

      const created = await postForm(`/pacientes/${pacientId}/arquivos-clinicos`, form);
      setFiles((prev) => [created as FileAPI, ...prev]);
      setFile(null);
      setDescricao("");
      alert("Arquivo enviado com sucesso");
    } catch (err: unknown) {
      console.error(err);
      alert((err as Error)?.message || "Erro ao enviar arquivo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este arquivo?")) return;
    try {
      await api(`/arquivos-clinicos/${id}`, { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Falha ao excluir arquivo");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Arquivos do Paciente #{pacientId}</h1>
            <p className="text-gray-600 mt-1">Upload de arquivos clínicos vinculados ao paciente</p>
          </div>
          <div>
            <button onClick={() => router.push(`/pacientes/${pacientId}`)} className="px-4 py-2 border rounded">Voltar</button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-6">
          <form onSubmit={handleUpload} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Arquivo</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <input value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Enviando...' : 'Enviar'}</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Arquivos existentes</h2>
          {loading ? (
            <div className="text-gray-600 mt-2">Carregando…</div>
          ) : files.length === 0 ? (
            <div className="text-gray-500 mt-2">Nenhum arquivo encontrado.</div>
          ) : (
            <div className="mt-4 grid gap-2">
              {files.map((f) => (
                <div key={f.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{f.nome}</div>
                    <div className="text-sm text-gray-500">{f.tamanho ? `${f.tamanho} bytes` : "-"}</div>
                  </div>
                  <div className="flex gap-2">
                    {f.url ? (
                      <a target="_blank" rel="noreferrer" href={f.url} className="px-3 py-1 border rounded">Abrir</a>
                    ) : (
                      <a href={`/api/proxy/pacientes/${pacientId}/arquivos/${f.id}/download`} className="px-3 py-1 border rounded">Download</a>
                    )}
                    <button onClick={() => handleDelete(Number(f.id))} className="px-3 py-1 border rounded bg-red-50 text-red-600">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

