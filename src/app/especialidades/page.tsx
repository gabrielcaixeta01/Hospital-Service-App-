"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getJson, deleteJson } from "../../utils/api";

type IdLike = number | string;

interface Especialidade {
  id: IdLike;
  nome: string;
}

export default function Page() {
  const router = useRouter();
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000/api/v1";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJson<Especialidade[]>("/especialidades");
        setEspecialidades(Array.isArray(data) ? data : []);
      } catch (e: unknown) {
        console.error("Erro ao carregar especialidades:", e);
        setError("Não foi possível carregar especialidades.");
        setEspecialidades([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [API_BASE, router]);

  const hasData = useMemo(() => especialidades.length > 0, [especialidades]);

  const handleDelete = async (id: IdLike) => {
    if (!confirm("Deseja realmente remover essa especialidade?")) return;

    try {
      await deleteJson(`/especialidades/${id}`);

      setEspecialidades((prev) =>
        prev.filter((p) => String(p.id) !== String(id))
      );

      alert("Especialidade removida com sucesso.");
    } catch (err: unknown) {
      console.error(err);
      alert((err as Error)?.message || "Falha ao remover especialidade.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-4xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Especialidades</h1>
            <p className="text-gray-600 mt-1">Gerencie as especialidades.</p>
          </div>

          <div>
            <button
              onClick={() => router.push("/especialidades/nova")}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              + Nova Especialidade
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-600">Carregando…</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : !hasData ? (
            <div className="p-6 text-center text-gray-600">
              Nenhuma especialidade cadastrada ainda.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {especialidades.map((e) => (
                  <tr key={String(e.id)} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {e.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="px-2 py-1 border rounded hover:bg-gray-50"
                      >
                        Remover
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