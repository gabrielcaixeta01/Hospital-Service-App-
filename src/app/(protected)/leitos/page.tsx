"use client";

import { useEffect, useMemo, useState } from "react";

/* -------- Helpers -------- */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) || "";
const apiUrl = (path: string) =>
  `${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`;

type Leito = {
  id: number;        // BigInt no DB, number no JSON
  codigo: string;    // único (ex.: "A-201")
  status?: string | null; // "livre" | "ocupado" | "manutencao"
};

function normStatus(s?: string | null) {
  const v = (s ?? "").toLowerCase();
  if (v.startsWith("ocup")) return "ocupado";
  if (v.startsWith("manut")) return "manutencao";
  return "livre";
}

/* -------- Página Admin -------- */
export default function AdminPage() {
  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form
  const [codigo, setCodigo] = useState("");
  const [status, setStatus] = useState<"livre" | "ocupado" | "manutencao">(
    "livre",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(apiUrl("/leitos"), {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(await res.text());
        const data: Leito[] = await res.json();
        setLeitos(data);
      } catch (e: unknown) {
        console.error(e);
        setErr("Falha ao carregar leitos.");
        setLeitos([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const totalPorStatus = useMemo(() => {
    const acc = { livre: 0, ocupado: 0, manutencao: 0 };
    for (const l of leitos) {
      const st = normStatus(l.status);
      acc[st] += 1;
    }
    return acc;
  }, [leitos]);

  async function criarLeito(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim()) {
      alert("Informe o código do leito (ex.: A-201)");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(apiUrl("/leitos"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: codigo.trim(), status }),
      });
      if (!res.ok) throw new Error(await res.text());
      const novo = (await res.json()) as Leito;
      setLeitos((prev) => [novo, ...prev]);
      setCodigo("");
      setStatus("livre");
    } catch (e: unknown) {
      console.error(e);
      alert(
        (e as Error)?.message?.includes("unique")
          ? "Já existe um leito com esse código."
          : "Falha ao criar leito.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function atualizarStatus(leito: Leito, novoStatus: string) {
    try {
      // PATCH parcial só com status
      const res = await fetch(apiUrl(`/leitos/${leito.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      const upd = (await res.json()) as Leito;
      setLeitos((prev) => prev.map((x) => (x.id === leito.id ? upd : x)));
    } catch (e: unknown) {
      console.error(e);
      alert("Falha ao atualizar status do leito.");
    }
  }

  async function removerLeito(leito: Leito) {
    if (!confirm(`Remover o leito ${leito.codigo}?`)) return;
    try {
      const res = await fetch(apiUrl(`/leitos/${leito.id}`), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setLeitos((prev) => prev.filter((x) => x.id !== leito.id));
    } catch (e: unknown) {
      console.error(e);
      alert(
        (e as Error)?.message?.includes("violates")
          ? "Não é possível remover: leito vinculado a internação."
          : "Falha ao remover leito.",
      );
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Gerencie os leitos</h1>
        <p className="text-gray-600">
          Crie, veja, altere e delete os leitos do hospital.
        </p>
        {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
      </div>

      {/* KPIs simples dos leitos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-semibold text-gray-800 mt-1">
            {loading ? "…" : leitos.length}
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Livres</div>
          <div className="text-2xl font-semibold text-gray-800 mt-1">
            {loading ? "…" : totalPorStatus.livre}
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Ocupados</div>
          <div className="text-2xl font-semibold text-gray-800 mt-1">
            {loading ? "…" : totalPorStatus.ocupado}
          </div>
        </div>
      </div>

      {/* Card: Criar Leito */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Adicionar Leito
        </h2>
        <form onSubmit={criarLeito} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Código</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex.: A-201"
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "livre" | "ocupado" | "manutencao")
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="livre">Livre</option>
              <option value="ocupado">Ocupado</option>
              <option value="manutencao">Manutenção</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Salvando…" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Leitos */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Leitos Cadastrados
        </h2>

        {loading ? (
          <div className="p-4 text-center">Carregando…</div>
        ) : leitos.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhum leito cadastrado.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Código
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
                {leitos.map((l) => {
                  const s = normStatus(l.status);
                  return (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {l.codigo}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        <select
                          className="rounded-md border border-gray-300 p-1"
                          value={s}
                          onChange={(e) => atualizarStatus(l, e.target.value)}
                        >
                          <option value="livre">Livre</option>
                          <option value="ocupado">Ocupado</option>
                          <option value="manutencao">Manutenção</option>
                        </select>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => removerLeito(l)}
                          className="px-3 py-1 text-sm rounded border border-red-300 text-red-700 hover:bg-red-50"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
