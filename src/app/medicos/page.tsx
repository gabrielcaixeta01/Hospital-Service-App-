"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getJson } from "@/utils/api";

type IdLike = string | number;

interface Especialidade {
  id: IdLike;
  nome: string;
}

interface Medico {
  id: IdLike;
  nome: string;
  crm?: string | null;
  email?: string | null;
  telefone?: string | null;

  especialidades?: Especialidade[];
}

export default function Page() {
  const router = useRouter();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMedicos() {
      try {
        setLoading(true);
        setError("");

        const data = await getJson<Medico[]>("/medicos");
        setMedicos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar médicos:", err);
        setError("Não foi possível carregar os médicos.");
      } finally {
        setLoading(false);
      }
    }

    fetchMedicos();
  }, [router]);

  const hasData = useMemo(() => medicos.length > 0, [medicos]);

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Médicos</h1>
            <p className="text-gray-600 mt-1">Gerencie os médicos cadastrados.</p>
          </div>

          <button
            onClick={() => router.push("/medicos/novo")}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            + Novo Médico
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg border shadow overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-600">Carregando…</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : !hasData ? (
            <div className="p-6 text-center text-gray-600">
              Nenhum médico cadastrado ainda.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Especialidades
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {medicos.map((m) => {
                  const especNomes =
                    m.especialidades?.map((e) => e.nome).join(", ") || "—";

                  return (
                    <tr key={String(m.id)} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {m.nome}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {especNomes}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => router.push(`/medicos/${m.id}`)}
                          className="px-2 py-1 border rounded hover:bg-gray-50"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}