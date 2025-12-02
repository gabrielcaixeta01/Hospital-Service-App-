"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJson, api, deleteJson } from "@/utils/api";
import PrescriptionForm from "@/components/forms/PrescriptionForm";
import PrescriptionList from "@/components/PrescriptionList";

type Id = number | string;
interface Option { id: Id; nome: string; }
interface Consulta {
  id: Id;
  dataHora: string;   
  motivo?: string | null;
  notas?: string | null;
  medicoId: Id;
  pacienteId: Id;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000/api/v1";

function isoToLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToIso(local: string) {
  return new Date(local).toISOString();
}

export default function Page() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [pacientes, setPacientes] = useState<Option[]>([]);
  const [medicos, setMedicos] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // começa em modo "ver"
  const [error, setError] = useState("");
  const [prescRefresh, setPrescRefresh] = useState(0);

  const hasData = useMemo(() => !!consulta, [consulta]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [c, p, m] = await Promise.all([
          getJson<Consulta>(`/consultas/${id}`),
          getJson<Option[]>("/pacientes"),
          getJson<Option[]>("/medicos"),
        ]);
        setConsulta(c);
        setPacientes((Array.isArray(p) ? p : []).map((x: unknown) => {
          const item = x as { id: Id; nome: string };
          return { id: item.id, nome: item.nome };
        }));
        setMedicos((Array.isArray(m) ? m : []).map((x: unknown) => {
          const item = x as { id: Id; nome: string };
          return { id: item.id, nome: item.nome };
        }));
      } catch (e: unknown) {
        setError((e as Error)?.message ?? "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!consulta) return;
    const { name, value } = e.target;
    setConsulta({ ...consulta, [name]: name.endsWith("Id") ? Number(value) : value });
  };

  const handleSave = async () => {
    if (!consulta || !id) return;
    setSaving(true);
    try {
      const res = await api(`/consultas/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          dataHora: consulta.dataHora, // já está em ISO
          motivo: consulta.motivo ?? undefined,
          notas: consulta.notas ?? undefined,
          medicoId: Number(consulta.medicoId),
          pacienteId: Number(consulta.pacienteId),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setConsulta(await res.json());
      setIsEditing(false);
      alert("Consulta atualizada!");
    } catch {
      alert("Erro ao salvar consulta");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Deseja realmente excluir esta consulta?")) return;
    await deleteJson(`/consultas/${id}`);
    alert("Consulta excluída!");
    router.push("/consultas");
  };

  if (loading) return <div className="p-6">Carregando…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!hasData) return <div className="p-6">Consulta não encontrada</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-4xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Consulta #{String(consulta!.id)}</h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? "Editando consulta" : "Detalhes da consulta"}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
                  Editar
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                  Excluir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          {!isEditing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Display label="Data/Hora" value={new Date(consulta!.dataHora).toLocaleString("pt-BR")} />
              <Display
                label="Paciente"
                value={pacientes.find((p) => String(p.id) === String(consulta!.pacienteId))?.nome ?? `#${consulta!.pacienteId}`}
              />
              <Display
                label="Médico"
                value={medicos.find((m) => String(m.id) === String(consulta!.medicoId))?.nome ?? `#${consulta!.medicoId}`}
              />
              <Display label="Motivo" value={consulta!.motivo ?? "—"} />
              <Display label="Notas" value={consulta!.notas ?? "—"} full />
            </div>

              <div className="mt-6 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900">Prescrições</h2>
                <PrescriptionList key={prescRefresh} consultaId={consulta!.id} onDeleted={() => setPrescRefresh((s) => s + 1)} />
                <PrescriptionForm key={prescRefresh} consultaId={consulta!.id} onSuccess={() => setPrescRefresh((s) => s + 1)} />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Data/Hora">
                <input
                  type="datetime-local"
                  value={isoToLocalInput(consulta!.dataHora)}
                  onChange={(e) =>
                    setConsulta((prev) => (prev ? { ...prev, dataHora: localInputToIso(e.target.value) } : prev))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </Field>

              <Field label="Paciente">
                <select
                  name="pacienteId"
                  value={String(consulta!.pacienteId)}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  {pacientes.map((p) => (
                    <option key={String(p.id)} value={String(p.id)}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Médico">
                <select
                  name="medicoId"
                  value={String(consulta!.medicoId)}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  {medicos.map((m) => (
                    <option key={String(m.id)} value={String(m.id)}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Motivo">
                <input
                  name="motivo"
                  value={consulta!.motivo ?? ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </Field>

              <Field label="Notas">
                <textarea
                  name="notas"
                  value={consulta!.notas ?? ""}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </Field>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-between">
            <button onClick={() => router.push("/consultas")} className="px-4 py-2 border rounded">
              Voltar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
function Display({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg">{value}</div>
    </div>
  );
}