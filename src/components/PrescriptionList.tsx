"use client";

import { useEffect, useState } from "react";
import { getJson, api } from "@/utils/api";

type PrescricaoAPI = { id: number; texto: string; criadoEm?: string | null; autor?: { id: number; nome?: string } | null };

export default function PrescriptionList({ consultaId, onDeleted }: { consultaId: number | string; onDeleted?: () => void }) {
  const [lista, setLista] = useState<PrescricaoAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!consultaId) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getJson<PrescricaoAPI[]>(`/consultas/${consultaId}/prescricoes`);
        setLista(data);
      } catch (err) {
        console.error(err);
        setLista([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [consultaId]);

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir prescrição?")) return;
    try {
      await api(`/prescricoes/${id}`, { method: "DELETE" });
      setLista((prev) => prev.filter((p) => p.id !== id));
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir prescrição");
    }
  };

  if (loading) return <div className="text-gray-600">Carregando prescrições…</div>;
  if (lista.length === 0) return <div className="text-gray-500">Nenhuma prescrição registrada.</div>;

  return (
    <div className="mt-4 grid gap-2">
      {lista.map((p) => (
        <div key={p.id} className="border rounded p-3 bg-white flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-600">{p.criadoEm ? new Date(p.criadoEm).toLocaleString() : "-"}</div>
            <div className="mt-1 whitespace-pre-wrap">{p.texto}</div>
            {p.autor?.nome && <div className="text-xs text-gray-500 mt-2">Autor: {p.autor.nome}</div>}
          </div>
          <div className="flex flex-col gap-2 ml-2">
            <button className="px-3 py-1 rounded border" onClick={() => navigator.clipboard.writeText(p.texto)}>Copiar</button>
            <button className="px-3 py-1 rounded border bg-red-50 text-red-600" onClick={() => handleDelete(p.id)}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}
