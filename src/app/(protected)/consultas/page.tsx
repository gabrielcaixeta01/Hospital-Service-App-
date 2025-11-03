"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Item {
  id: number | string;
  dataHora: string; // ISO UTC vindo do back
  motivo?: string | null;
  notas?: string | null;
  medico: { id: number | string; nome: string };
  paciente: { id: number | string; nome: string };
}

export default function Page() {
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000/api/v1";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/consultas`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (e: unknown) {
        console.error(e);
        setErr("Não foi possível carregar as consultas.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [API_BASE]);

  const hasData = useMemo(() => rows.length > 0, [rows]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Consultas</h1>
            <p className="text-gray-600 mt-1">Acompanhe as consultas marcadas.</p>
          </div>
          <Link
            href="/consultas/nova"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            + Nova Consulta
          </Link>
        </div>

        <div className="bg-white rounded-lg border shadow overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-600">Carregando…</div>
          ) : err ? (
            <div className="p-6 text-center text-red-600">{err}</div>
          ) : !hasData ? (
            <div className="p-6 text-center text-gray-600">
              Nenhuma consulta cadastrada.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Data/Hora</Th>
                  <Th>Paciente</Th>
                  <Th>Médico</Th>
                  <Th>Motivo</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((c) => (
                  <tr key={String(c.id)} className="hover:bg-gray-50">
                    <Td>{fmt(c.dataHora)}</Td>
                    <Td>{c.paciente?.nome ?? "—"}</Td>
                    <Td>{c.medico?.nome ?? "—"}</Td>
                    <Td>{c.motivo ?? "—"}</Td>
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>;
}