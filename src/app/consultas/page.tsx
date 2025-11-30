"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJson } from "../../utils/api";

type Id = number | string;
interface Consulta {
  id: Id;
  dataHora: string;   
  motivo?: string | null;
  medico?: { id: Id; nome: string } | null;
  paciente?: { id: Id; nome: string } | null;
  medicoId?: Id;
  pacienteId?: Id;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000/api/v1";

export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getJson<Consulta[]>("/consultas");
        setItems(data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Consultas</h1>
            <p className="text-gray-600 mt-1">Gerencie as consultas cadastradas.</p>
          </div>
          <button
            onClick={() => router.push("/consultas/nova")}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            + Nova Consulta
          </button>
        </div>

        <div className="bg-white rounded-lg border shadow overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center">Carregando…</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((c) => (
                  <tr key={String(c.id)} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {new Date(c.dataHora).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {c.paciente?.nome ?? `#${c.pacienteId ?? "—"}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {c.medico?.nome ?? `#${c.medicoId ?? "—"}`}
                    </td>
                    <td className="px-6 py-4 text-sm">{c.motivo ?? "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => router.push(`/consultas/${c.id}`)}
                        className="px-2 py-1 border rounded"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}