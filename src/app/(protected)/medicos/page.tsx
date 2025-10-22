"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Medico {
  id: number;
  nome: string;
  especialidade?: string;
}

export default function Page() {
  const router = useRouter();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
        // const api = process.env.NEXT_PUBLIC_API_URL;
        // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // const res = await fetch(`${api}/medicos`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
        //   },
        //   cache: 'no-store',
        // });
        const res = await fetch("/api/medicos");
        if (!res.ok) throw new Error("Falha");
        const data = await res.json();
        setMedicos(data);
      } catch (err) {
        console.error("Erro ao carregar médicos", err);
        setMedicos([
          { id: 1, nome: "Dr. Carlos Pereira", especialidade: "Clínica" },
          { id: 2, nome: "Dra. Maria Santos", especialidade: "Pediatria" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Médicos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie os médicos cadastrados.
            </p>
          </div>

          <div>
            <button
              onClick={() => router.push("/medicos/novo")}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              + Novo Médico
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center">Carregando...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicos.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {m.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {m.especialidade || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => router.push(`/medicos/${m.id}`)}
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
