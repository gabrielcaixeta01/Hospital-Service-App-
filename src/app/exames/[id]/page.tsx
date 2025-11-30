"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  consultaId: number;
  consulta?: ConsultaLite | null;
};

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) || "";

const api = (path: string, init?: RequestInit) =>
  fetch(`${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });

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
function fromDatetimeLocal(local: string) {
  if (!local) return null;
  return new Date(local).toISOString();
}
function fmtShort(d?: string | null) {
  return d ? new Date(d).toLocaleString("pt-BR") : "—";
}

export default function ExameDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [exame, setExame] = useState<Exame | null>(null);
  const [consultas, setConsultas] = useState<ConsultaLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [err, setErr] = useState("");

  const status = useMemo(
    () => (exame?.resultado ? "Com resultado" : "Pendente"),
    [exame]
  );

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const [eRes, cRes] = await Promise.all([
          api(`/exames/${id}`),
          api("/consultas"),
        ]);
        if (!eRes.ok) throw new Error(await eRes.text());
        if (!cRes.ok) throw new Error(await cRes.text());
        setExame(await eRes.json());
        setConsultas(await cRes.json());
      } catch (e: unknown) {
        console.error(e);
        setErr((e as Error)?.message || "Falha ao carregar exame");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSave = async () => {
    if (!id || !exame) return;
    setSaving(true);
    try {
      const res = await api(`/exames/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          consultaId: Number(exame.consultaId),
          tipo: exame.tipo,
          dataHora: exame.dataHora ? exame.dataHora : null,
          resultado:
            exame.resultado !== undefined && exame.resultado !== ""
              ? exame.resultado
              : null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: Exame = await res.json();
      setExame(updated);
      setIsEditing(false);
      alert("Exame atualizado com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar exame");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Deseja realmente excluir este exame?")) return;
    try {
      const res = await api(`/exames/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      alert("Exame excluído!");
      router.push("/exames");
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir exame");
    }
  };

  if (loading) return <div className="p-6">Carregando…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!exame) return <div className="p-6">Exame não encontrado</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Exame #{exame.id}
            </h1>
            <p className="text-gray-600">
              Status:{" "}
              <strong>
                {status} {exame.resultado ? "" : "(aguardando resultado)"}
              </strong>
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
              <Display
                label="Paciente"
                value={exame.consulta?.paciente?.nome ?? "—"}
              />
              <Display
                label="Médico"
                value={exame.consulta?.medico?.nome ?? "—"}
              />
              <Display label="Tipo" value={exame.tipo} />
              <Display label="Data/Hora" value={fmtShort(exame.dataHora)} />
              <div className="sm:col-span-2">
                <div className="text-sm text-gray-500">Resultado</div>
                <div className="text-lg whitespace-pre-wrap">
                  {exame.resultado ?? "—"}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Consulta">
                <select
                  className="mt-1 w-full border rounded p-2"
                  value={exame.consultaId}
                  onChange={(e) =>
                    setExame((p) =>
                      p ? { ...p, consultaId: Number(e.target.value) } : p
                    )
                  }
                >
                  {consultas.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.id} • {c.paciente?.nome ?? "Paciente"} —{" "}
                      {c.medico?.nome ?? "Médico"} — {fmtShort(c.dataHora)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Tipo do exame">
                <input
                  className="mt-1 w-full border rounded p-2"
                  value={exame.tipo}
                  onChange={(e) =>
                    setExame((p) => (p ? { ...p, tipo: e.target.value } : p))
                  }
                />
              </Field>

              <Field label="Data/Hora (opcional)">
                <input
                  type="datetime-local"
                  className="mt-1 w-full border rounded p-2"
                  value={toDatetimeLocal(exame.dataHora)}
                  onChange={(e) =>
                    setExame((p) =>
                      p
                        ? {
                            ...p,
                            dataHora: e.target.value
                              ? fromDatetimeLocal(e.target.value)
                              : null,
                          }
                        : p
                    )
                  }
                />
              </Field>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Resultado (deixe vazio para pendente)
                </label>
                <textarea
                  className="mt-1 w-full border rounded p-2"
                  rows={5}
                  value={exame.resultado ?? ""}
                  onChange={(e) =>
                    setExame((p) =>
                      p ? { ...p, resultado: e.target.value } : p
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setExame((p) => (p ? { ...p, resultado: "" } : p))
                  }
                  className="mt-2 text-sm text-gray-600 underline"
                >
                  Limpar resultado (marcar como pendente)
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => router.push("/exames")}
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