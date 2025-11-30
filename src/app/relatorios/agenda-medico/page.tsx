"use client";

import { useEffect, useMemo, useState } from "react";

/* ------------ Helpers ------------ */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) || ""; // se vazio, usa /api
const api = (path: string) =>
  fetch(`${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

/* ------------ Tipos mínimos (compatíveis com seu backend) ------------ */
type NomeRef = { id: number; nome: string };
type ConsultaAPI = {
  id: number;
  dataHora?: string | null; // seu back usa 'dataHora'
  data?: string | null;     // fallback, caso venha 'data'
  status?: string | null;
  medico?: NomeRef | null;
  paciente?: NomeRef | null;
};

/* Normaliza data/hora vindo do back para exibição */
function parseDateParts(isoLike?: string | null) {
  if (!isoLike) return { data: "—", hora: "—" };
  const d = new Date(isoLike);
  // Se estiver recebendo string 'YYYY-MM-DD HH:mm' sem timezone,
  // o Date pode interpretar local; se vier ISO (YYYY-MM-DDTHH:mm:ssZ), ok.
  const data = d.toLocaleDateString("pt-BR");
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { data, hora };
}

export default function AgendaMedicoPage() {
  const [consultas, setConsultas] = useState<ConsultaAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  // filtros
  const [medicoFilter, setMedicoFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        // Se seu back já inclui medico/paciente com include, basta /consultas
        const res = await api("/consultas");
        if (!res.ok) throw new Error(await res.text());
        const data: ConsultaAPI[] = await res.json();
        setConsultas(data);
      } catch (e: unknown) {
        console.error(e);
        setErr("Falha ao carregar agenda.");
        setConsultas([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const medicos = useMemo(() => {
    const set = new Set<string>();
    for (const c of consultas) {
      if (c.medico?.nome) set.add(c.medico.nome);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [consultas]);

  const filtered = useMemo(() => {
    return consultas.filter((c) => {
      if (medicoFilter && c.medico?.nome !== medicoFilter) return false;

      if (dateFilter) {
        // compara só a parte da data (YYYY-MM-DD)
        const stamp = (c.dataHora ?? c.data ?? "") as string;
        if (!stamp) return false;
        // extrai "YYYY-MM-DD" a partir do Date
        const d = new Date(stamp);
        const y = d.getFullYear();
        const m = `${d.getMonth() + 1}`.padStart(2, "0");
        const day = `${d.getDate()}`.padStart(2, "0");
        const asYMD = `${y}-${m}-${day}`;
        if (asYMD !== dateFilter) return false;
      }

      return true;
    });
  }, [consultas, medicoFilter, dateFilter]);

  const clearFilters = () => {
    setMedicoFilter("");
    setDateFilter("");
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Agenda por Médico</h1>
          <p className="text-gray-600">Filtre por médico ou data para visualizar a agenda.</p>
          {err && <p className="text-sm text-red-600 mt-1">{err}</p>}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Médico</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 p-2"
              value={medicoFilter}
              onChange={(e) => setMedicoFilter(e.target.value)}
              disabled={loading}
            >
              <option value="">Todos</option>
              {medicos.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Data</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 p-2"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-end">
            <button
              className="px-4 py-2 bg-gray-100 rounded border hover:bg-gray-50 disabled:opacity-50"
              onClick={clearFilters}
              disabled={loading || (!medicoFilter && !dateFilter)}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">Carregando…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Nenhuma consulta encontrada</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((c) => {
                const stamp = (c.dataHora ?? c.data ?? null) as string | null;
                const { data, hora } = parseDateParts(stamp);
                const status = c.status ?? "Agendada";
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hora}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.paciente?.nome ?? `#${c.paciente?.id ?? "—"}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.medico?.nome ?? `#${c.medico?.id ?? "—"}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          status === "Realizada"
                            ? "bg-green-100 text-green-800"
                            : status === "Agendada"
                            ? "bg-blue-100 text-blue-800"
                            : status === "Cancelada"
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}