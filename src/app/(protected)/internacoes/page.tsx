"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Internacao {
  id: number;
  paciente: {
    id: number;
    nome: string;
  };
  medico: {
    id: number;
    nome: string;
  };
  dataInternacao: string;
  motivo: string;
  status: "ATIVO" | "ALTA";
}

export default function InternacoesList() {
  const router = useRouter();
  const [internacoes, setInternacoes] = useState<Internacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternacoes();
  }, []);

  const fetchInternacoes = async () => {
    try {
      // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
      // const api = process.env.NEXT_PUBLIC_API_URL;
      // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // const res = await fetch(`${api}/internacoes`, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      //   cache: 'no-store',
      // });
      const response = await fetch("/api/internacoes");
      if (!response.ok) throw new Error("Falha ao carregar internações");
      const data = await response.json();
      setInternacoes(data);
    } catch (error) {
      console.error("Erro ao carregar internações:", error);
      // Fallback mock data
      setInternacoes([
        {
          id: 1,
          paciente: { id: 1, nome: "João da Silva" },
          medico: { id: 2, nome: "Dra. Maria Santos" },
          dataInternacao: "2025-10-15T09:00:00Z",
          motivo: "Pneumonia",
          status: "ATIVO",
        },
        {
          id: 2,
          paciente: { id: 2, nome: "Ana Oliveira" },
          medico: { id: 3, nome: "Dr. Felipe Lima" },
          dataInternacao: "2025-10-10T14:00:00Z",
          motivo: "Cirurgia",
          status: "ALTA",
        },
      ] as Internacao[]);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString("pt-BR");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Internações</h1>
        <button
          type="button"
          onClick={() => router.push("/internacoes/novo")}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Nova Internação
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Carregando...</div>
        ) : internacoes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhuma internação encontrada
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médico Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Internação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {internacoes.map((internacao) => (
                  <tr key={internacao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {internacao.paciente.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {internacao.medico.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatarData(internacao.dataInternacao)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          internacao.status === "ATIVO"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {internacao.status === "ATIVO" ? "Internado" : "Alta"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/internacoes/${internacao.id}`)
                          }
                          className="mr-2 border border-gray-300 text-sm px-2 py-1 rounded bg-white hover:bg-gray-50"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/internacoes/${internacao.id}/remover`)
                          }
                          className="border border-red-300 text-sm px-2 py-1 rounded bg-white hover:bg-red-50"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
