"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Paciente {
  id: number;
  nome: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
  cpf?: string;
}

export default function Page() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
        // const api = process.env.NEXT_PUBLIC_API_URL;
        // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // const res = await fetch(`${api}/pacientes`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
        //   },
        //   cache: 'no-store',
        // });
        const res = await fetch("/api/pacientes");
        if (!res.ok) throw new Error("Falha");
        const data = await res.json();
        setPacientes(data);
      } catch (err) {
        console.error("Erro ao carregar pacientes:", err);
        setPacientes([
          {
            id: 1,
            nome: "João da Silva",
            cpf: "123.456.789-00",
            dataNascimento: "1980-05-12",
            telefone: "(11) 99999-0001",
            email: "joao@example.com",
          },
          {
            id: 2,
            nome: "Ana Oliveira",
            cpf: "987.654.321-00",
            dataNascimento: "1992-11-03",
            telefone: "(11) 99999-0002",
            email: "ana@example.com",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPacientes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Pacientes</h1>
            <p className="text-gray-600 mt-1">
              Gerencie os pacientes cadastrados.
            </p>
          </div>

          <div>
            <button
              onClick={() => router.push("/pacientes/novo")}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              + Novo Paciente
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
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Nasc.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pacientes.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p["cpf"] || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.dataNascimento || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.telefone || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => router.push(`/pacientes/${p.id}`)}
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
