"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type IdLike = string | number;

interface PacienteUI {
  id: IdLike;
  nome: string;
  cpf?: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
}

interface PacienteAPI {
  id: IdLike;
  nome: string;
  cpf?: string | null;
  nascimento?: string | null; // <- vem assim do back
  telefone?: string | null;
  email?: string | null;
  // ...outros campos do Prisma
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000/api/v1";

function fmtDateISOToBR(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso ?? undefined;
  return d.toLocaleDateString("pt-BR");
}

export default function Page() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<PacienteUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setLoading(true);
        setError("");

        // Se tiver auth, acrescente o header Authorization aqui.
        const res = await fetch(`${API_BASE}/pacientes`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `Falha ao carregar (HTTP ${res.status})`);
        }

        const data: PacienteAPI[] = await res.json();

        const mapped: PacienteUI[] = (data ?? []).map((p) => ({
          id: p.id,
          nome: p.nome,
          cpf: p.cpf ?? undefined,
          dataNascimento: fmtDateISOToBR(p.nascimento),
          telefone: p.telefone ?? undefined,
          email: p.email ?? undefined,
        }));

        setPacientes(mapped);
      } catch (e: unknown) {
        console.error("Erro ao carregar pacientes:", e);
        setError("Não foi possível carregar a lista de pacientes.");
        setPacientes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  const hasData = useMemo(() => pacientes.length > 0, [pacientes]);

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
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              + Novo Paciente
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
              Nenhum paciente cadastrado ainda.
            </div>
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
                  <tr key={String(p.id)} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.cpf || "—"}
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
                        className="px-2 py-1 border rounded hover:bg-gray-50"
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