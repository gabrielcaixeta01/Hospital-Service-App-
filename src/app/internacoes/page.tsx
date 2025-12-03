"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getJson } from "../../utils/api";

interface InternacaoAPI {
  id: number;
  dataEntrada: string;           
  dataAlta?: string | null;     
  paciente: { id: number; nome: string };
  leito: { id: number; codigo: string };
}

type Status = "ATIVO" | "ALTA";

interface InternacaoVM {
  id: number;
  pacienteNome: string;
  leitoCodigo: string;
  dataInternacao: string; // ISO
  status: Status;
}


export default function InternacoesList() {
  const router = useRouter();
  const [rows, setRows] = useState<InternacaoVM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternacoes = async () => {
      try {
        const data = await getJson<InternacaoAPI[]>("/internacoes");

        const mapped: InternacaoVM[] = data.map((i) => ({
          id: i.id,
          pacienteNome: i.paciente?.nome ?? "—",
          leitoCodigo: i.leito?.codigo ?? "—",
          dataInternacao: i.dataEntrada,
          status: i.dataAlta ? "ALTA" : "ATIVO",
        }));

        setRows(mapped);
      } catch (err) {
        console.error("Erro ao carregar internações:", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInternacoes();
  }, []);

  const hasData = useMemo(() => rows.length > 0, [rows]);

  const formatarData = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="container mx-auto p-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Histórico de Internações</h1>
        <button
          type="button"
          onClick={() => router.push("/internacoes/novo")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nova Internação
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Carregando...</div>
        ) : !hasData ? (
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
                    Leito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Internação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {r.pacienteNome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {r.leitoCodigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarData(r.dataInternacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          r.status === "ATIVO"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {r.status === "ATIVO" ? "Internado" : "Alta"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => router.push(`/internacoes/${r.id}`)}
                        className="border border-gray-300 text-sm px-3 py-1 rounded bg-white hover:bg-gray-50"
                      >
                        Ver
                      </button>
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
