"use client";

import { useState } from "react";
import { api } from "@/utils/api";

export default function PrescriptionForm({ consultaId, onSuccess }: { consultaId: number | string; onSuccess?: () => void; }) {
  const [texto, setTexto] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto) return alert("Insira o texto da prescrição");
    setSaving(true);
    try {
      const res = await api(`/consultas/${consultaId}/prescricoes`, {
        method: "POST",
        body: JSON.stringify({ texto }),
      });
      if (!res.ok) throw new Error(await res.text());
      setTexto("");
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      alert((err as Error)?.message || "Erro ao criar prescrição");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Texto da Prescrição</label>
        <textarea rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
      </div>
      <div className="mt-2 flex justify-end">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "Criando..." : "Adicionar Prescrição"}</button>
      </div>
    </form>
  );
}
