"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";

type IdLike = string | number;

interface Especialidade {
  id: IdLike;
  nome: string;
}

interface MedicoAPI {
  id: IdLike;
  nome: string;
  crm?: string | null;
  email?: string | null;
  telefone?: string | null;
  especialidades?: Especialidade[]; // vindo do Prisma include
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [medico, setMedico] = useState<MedicoAPI | null>(null);
  const [allEspecialidades, setAllEspecialidades] = useState<Especialidade[]>(
    []
  );
  const [selectedEspecialidades, setSelectedEspecialidades] = useState<
    IdLike[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000/api/v1";

  // Carrega médico + catálogo de especialidades
  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const [medRes, espRes] = await Promise.all([
          fetch(`${API_BASE}/medicos/${id}`, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }),
          fetch(`${API_BASE}/especialidades`, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }),
        ]);

        if (!medRes.ok) throw new Error("Falha ao carregar médico");
        if (!espRes.ok) throw new Error("Falha ao carregar especialidades");

        const med: MedicoAPI = await medRes.json();
        const esp: Especialidade[] = await espRes.json();

        setMedico(med);
        setAllEspecialidades(esp);
        setSelectedEspecialidades((med.especialidades ?? []).map((e) => e.id));
      } catch (e: unknown) {
        console.error(e);
        setError((e as Error)?.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, API_BASE]);

  const hasData = useMemo(() => !!medico, [medico]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!medico) return;
    const { name, value } = e.target;
    setMedico({ ...medico, [name]: value });
  };

  const toggleEspecialidade = (eid: IdLike) => {
    setSelectedEspecialidades((prev) =>
      prev.includes(eid) ? prev.filter((v) => v !== eid) : [...prev, eid]
    );
  };

  const handleSave = async () => {
    if (!medico || !id) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/medicos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: medico.nome,
          crm: medico.crm ?? undefined,
          telefone: medico.telefone ?? undefined,
          email: medico.email ?? undefined,
          // substitui completamente as relações:
          replaceEspecialidadeIds: selectedEspecialidades.map((v) =>
            typeof v === "string" ? Number(v) : v
          ),
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Falha ao salvar médico");
      }
      const updated: MedicoAPI = await res.json();
      setMedico(updated);
      setSelectedEspecialidades((updated.especialidades ?? []).map((e) => e.id));
      setIsEditing(false);
      alert("Médico atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar", err);
      alert("Erro ao salvar médico");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Deseja realmente excluir este médico?")) return;
    try {
      const res = await fetch(`${API_BASE}/medicos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir");
      alert("Médico excluído com sucesso!");
      router.push("/medicos");
    } catch (err) {
      console.error("Erro ao excluir", err);
      alert("Erro ao excluir médico");
    }
  };

  if (loading) return <div className="p-6">Carregando…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!hasData) return <div className="p-6">Médico não encontrado</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">{medico!.nome}</h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? "Editando médico" : "Dados do médico"}
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
                  {saving ? "Salvando..." : "Salvar"}
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
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome">
                <input
                  name="nome"
                  value={medico!.nome}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </Field>

              <Field label="CRM">
                <input
                  name="crm"
                  value={medico!.crm ?? ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </Field>

              <Field label="Telefone">
                <input
                  name="telefone"
                  value={medico!.telefone ?? ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  value={medico!.email ?? ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </Field>

              <div className="sm:col-span-2">
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidades
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allEspecialidades.map((e) => {
                    const checked = selectedEspecialidades.includes(e.id);
                    return (
                      <label
                        key={String(e.id)}
                        className="flex items-center gap-2 text-sm border rounded px-3 py-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEspecialidade(e.id)}
                        />
                        {e.nome}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Display label="Nome" value={medico!.nome} />
              <Display label="CRM" value={medico!.crm || "—"} />
              <Display label="Telefone" value={medico!.telefone || "—"} />
              <Display label="Email" value={medico!.email || "—"} />
              <Display
                label="Especialidades"
                value={
                  (medico!.especialidades ?? []).length
                    ? (medico!.especialidades ?? [])
                        .map((e) => e.nome)
                        .join(", ")
                    : "—"
                }
                full
              />
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-between">
            <button
              onClick={() => router.push("/medicos")}
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

/* ----- helpers de UI ----- */
function Field({ label, children }: { label: ReactNode; children?: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function Display({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-medium text-gray-900">{value}</div>
    </div>
  );
}