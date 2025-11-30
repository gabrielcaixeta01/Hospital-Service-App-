"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Pessoa = { id: number; nome: string };
type ConsultaLite = {
  id: number;
  dataHora?: string | null;
  motivo?: string | null;
  paciente?: Pessoa | null;
  medico?: Pessoa | null;
};

type Exame = {
  id: number;
  tipo: string;
  resultado?: string | null;
  dataHora?: string | null;
  consulta?: ConsultaLite | null;
};

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) || "";

const api = (path: string) =>
  fetch(`${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

function fmtDateTimeBR(iso?: string | null) {
  return iso ? new Date(iso).toLocaleString("pt-BR") : "—";
}

export default function ExamesListPage() {
  const [data, setData] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await api("/exames");
        if (!res.ok) throw new Error(await res.text());
        const json: Exame[] = await res.json();
        setData(json);
      } catch (e: unknown) {
        console.error(e);
        setErr((e as Error)?.message || "Falha ao carregar exames");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Exames</h1>
            <p className="text-gray-600">
              Acompanhe os pedidos e resultados de exames.
            </p>
            {err && <p className="text-red-600 text-sm mt-1">{err}</p>}
          </div>
          <Link
            href="/exames/novo"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            + Novo Exame
          </Link>
        </div>

        <div className="bg-white rounded-lg border shadow overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center">Carregando…</div>
          ) : data.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum exame cadastrado
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((e) => {
                  const paciente = e.consulta?.paciente?.nome ?? "—";
                  const medico = e.consulta?.medico?.nome ?? "—";
                  const status = e.resultado ? "Com resultado" : "Pendente";
                  const statusClass = e.resultado
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800";
                  return (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{e.tipo}</td>
                      <td className="px-6 py-4 text-sm">{paciente}</td>
                      <td className="px-6 py-4 text-sm">{medico}</td>
                      <td className="px-6 py-4 text-sm">
                        {fmtDateTimeBR(e.dataHora)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/exames/${e.id}`}
                          className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
                        >
                          Ver
                        </Link>
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