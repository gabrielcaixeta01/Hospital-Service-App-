"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJson, api } from "@/utils/api";

/** ---- Tipos vindos da API ---- */
interface Paciente { id: number; nome: string }
interface Leito { id: number; codigo: string }
interface InternacaoAPI {
  id: number;
  pacienteId: number;
  leitoId: number;
  dataEntrada: string;        // ISO
  dataAlta?: string | null;   // ISO | null
  paciente: Paciente;
  leito: Leito;
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) ||
  "http://localhost:4000/api/v1";

/** Converte ISO -> valor aceito por <input type="datetime-local"> */
function toDatetimeLocal(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}
/** Inverso: datetime-local -> ISO (em timezone local do usuário) */
function fromDatetimeLocal(local: string) {
  if (!local) return null;
  const date = new Date(local);
  return date.toISOString();
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<InternacaoAPI | null>(null);
  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const status = useMemo(() => (data?.dataAlta ? "ALTA" : "ATIVO"), [data]);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const [iData, lData] = await Promise.all([
          getJson<InternacaoAPI>(`/internacoes/${id}`),
          getJson<Leito[]>("/leitos"),
        ]);
        setData(iData);
        setLeitos(lData);
      } catch (e: unknown) {
        console.error(e);
        setError((e as Error)?.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSave = async () => {
    if (!id || !data) return;
    setSaving(true);
    try {
      const res = await api(`/internacoes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          leitoId: data.leitoId,
          dataEntrada: data.dataEntrada,
          dataAlta: data.dataAlta ?? null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: InternacaoAPI = await res.json();
      setData(updated);
      setIsEditing(false);
      alert("Internação atualizada com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar internação");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Deseja realmente excluir esta internação?")) return;
    try {
      const res = await api(`/internacoes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      alert("Internação excluída!");
      router.push("/internacoes");
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir internação");
    }
  };

  if (loading) return <div className="p-6">Carregando…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">Internação não encontrada</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Internação #{data.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Paciente: <strong>{data.paciente?.nome}</strong> • Leito:{" "}
              <strong>{data.leito?.codigo}</strong> • Status:{" "}
              <strong>{status === "ATIVO" ? "Internado" : "Alta"}</strong>
            </p>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Salvando…" : "Salvar"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Display label="Paciente" value={data.paciente?.nome ?? "—"} />
              <Display label="Leito" value={data.leito?.codigo ?? "—"} />
              <Display
                label="Data de Entrada"
                value={new Date(data.dataEntrada).toLocaleString("pt-BR")}
              />
              <Display
                label="Data de Alta"
                value={
                  data.dataAlta
                    ? new Date(data.dataAlta).toLocaleString("pt-BR")
                    : "—"
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Paciente">
                <input
                  disabled
                  className="mt-1 w-full border rounded p-2 bg-gray-50"
                  value={data.paciente?.nome ?? ""}
                />
              </Field>

              <Field label="Leito">
                <select
                  className="mt-1 w-full border rounded p-2"
                  value={data.leitoId}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, leitoId: Number(e.target.value) } : prev
                    )
                  }
                >
                  {leitos.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.codigo}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Data de Entrada">
                <input
                  type="datetime-local"
                  className="mt-1 w-full border rounded p-2"
                  value={toDatetimeLocal(data.dataEntrada)}
                  onChange={(e) =>
                    setData((p) =>
                      p ? { ...p, dataEntrada: fromDatetimeLocal(e.target.value)! } : p
                    )
                  }
                />
              </Field>

              <Field label="Data de Alta (opcional)">
                <input
                  type="datetime-local"
                  className="mt-1 w-full border rounded p-2"
                  value={toDatetimeLocal(data.dataAlta ?? undefined)}
                  onChange={(e) =>
                    setData((p) =>
                      p
                        ? {
                            ...p,
                            dataAlta: e.target.value
                              ? fromDatetimeLocal(e.target.value)
                              : null,
                          }
                        : p
                    )
                  }
                />
              </Field>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function Display({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg">{value}</div>
    </div>
  );
}