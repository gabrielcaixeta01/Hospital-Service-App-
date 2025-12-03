"use client";

import { useEffect, useMemo, useState } from "react";
import { getJson, postJson, api, deleteJson } from "../../utils/api";

type Leito = {
  id: number;
  codigo: string;
  status: string;        
  pacienteNome: string | null;  
};

interface CellProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}

function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 min-w-[44px] items-center rounded-full transition-colors duration-200
        ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200
          ${checked ? "translate-x-6" : "translate-x-1"}`}
      ></span>
    </button>
  );
}

export default function AdminPage() {
  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [codigo, setCodigo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const data = await getJson<Leito[]>("/leitos");
        setLeitos(data);
      } catch (e) {
        console.error(e);
        setErr("Falha ao carregar leitos.");
        setLeitos([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const kpis = useMemo(() => {
    const acc = { total: leitos.length, livre: 0, ocupado: 0, manutencao: 0 };
    for (const l of leitos) {
      const st = l.status as "livre" | "ocupado" | "manutencao";
      acc[st] += 1;
    }
    return acc;
  }, [leitos]);

  async function criarLeito(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim()) {
      alert("Informe o código do leito.");
      return;
    }

    try {
      setSaving(true);

      const novo = await postJson<Leito>("/leitos", {
        codigo: codigo.trim(),
      });

      setLeitos((prev) => [novo, ...prev]);
      setCodigo("");
    } catch (e) {
      console.error(e);
      alert("Falha ao criar leito.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleManutencao(leito: Leito) {
    const entrandoEmManutencao = leito.status !== "manutencao";

    try {
      const res = await api(`/leitos/${leito.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: entrandoEmManutencao ? "manutencao" : "livre",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const atualizado = (await res.json()) as Leito;

      setLeitos((prev) =>
        prev.map((x) => (x.id === leito.id ? atualizado : x))
      );
    } catch (e) {
      console.error(e);
      alert("Falha ao atualizar manutenção.");
    }
  }

  async function removerLeito(leito: Leito) {
    if (!confirm(`Remover o leito ${leito.codigo}?`)) return;

    try {
      await deleteJson(`/leitos/${leito.id}`);
      setLeitos((prev) => prev.filter((l) => l.id !== leito.id));
    } catch (e) {
      console.error(e);
      alert("Falha ao remover leito.");
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Gerencie os Leitos
      </h1>

      {err && (
        <div className="p-4 mb-4 text-red-700 bg-red-50 rounded">{err}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <KpiCard label="Total" value={kpis.total} />
        <KpiCard label="Livres" value={kpis.livre} />
        <KpiCard label="Ocupados" value={kpis.ocupado} />
        <KpiCard label="Manutenção" value={kpis.manutencao} />
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow mb-10">
        <h2 className="text-lg font-semibold mb-4">Adicionar Leito</h2>

        <form onSubmit={criarLeito} className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600">Código</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              placeholder="Ex.: A-201"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-6"
          >
            {saving ? "Salvando…" : "Adicionar"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow">
        <h2 className="text-lg font-semibold mb-4">Leitos Cadastrados</h2>

        {loading ? (
          <div className="p-4 text-center">Carregando…</div>
        ) : leitos.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhum leito cadastrado.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Código</Th>
                <Th>Status</Th>
                <Th>Paciente Atual</Th>
                <Th>Manut.</Th>
                <Th align="right">Ações</Th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {leitos.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <Td>{l.codigo}</Td>

                  <Td>
                    {l.status === "ocupado" && (
                      <span className="text-red-600 font-semibold">Ocupado</span>
                    )}
                    {l.status === "livre" && (
                      <span className="text-green-600 font-semibold">
                        Livre
                      </span>
                    )}
                    {l.status === "manutencao" && (
                      <span className="text-yellow-600 font-semibold">
                        Manutenção
                      </span>
                    )}
                  </Td>

                  <Td>
                    <span className="block max-w-[180px] truncate">
                      {l.pacienteNome ?? "—"}
                    </span>
                  </Td>

                  <Td align="center">
                    <div className="w-20 flex justify-center">
                      <Switch
                        checked={l.status === "manutencao"}
                        disabled={l.status === "ocupado"}
                        onChange={() => toggleManutencao(l)}
                      />
                    </div>
                  </Td>

                  <Td align="right">
                    <button
                      onClick={() => removerLeito(l)}
                      className="px-3 py-1 text-sm rounded border border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Remover
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-800 mt-1">{value}</div>
    </div>
  );
}

function Th({ children, align = "left" }: CellProps) {
  return (
    <th
      className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase`}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }: CellProps) {
  return (
    <td
      className={`px-6 py-3 text-sm text-gray-900 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </td>
  );
}