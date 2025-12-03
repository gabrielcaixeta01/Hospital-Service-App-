"use client";

import { useEffect, useMemo, useState } from "react";
import { isoUtcToLocalInput, localInputToIsoUtc } from "@/lib/datetime";
import { useRouter } from "next/navigation";
import { getJson, postJson, api } from "@/utils/api";

type IdLike = number | string;

interface Option { id: IdLike; nome: string; }

export interface ConsultationFormValues {
  dataHora: string; 
  motivo?: string;
  notas?: string;
  medicoId?: IdLike;
  pacienteId?: IdLike;
  especialidadeId?: IdLike;
}

export default function ConsultationForm({
  mode = "create",
  defaultValues = {},
  onSuccess,
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<ConsultationFormValues> & { id?: IdLike };
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const [form, setForm] = useState<ConsultationFormValues>({
    dataHora: defaultValues.dataHora || "",
    motivo: defaultValues.motivo || "",
    notas: defaultValues.notas || "",
    medicoId: defaultValues.medicoId ?? undefined,
    pacienteId: defaultValues.pacienteId ?? undefined,
    especialidadeId: defaultValues.especialidadeId ?? undefined,
  });

  const [medicos, setMedicos] = useState<Option[]>([]);
  const [pacientes, setPacientes] = useState<Option[]>([]);
  const [especialidades, setEspecialidades] = useState<Option[]>([]); 
  const [filteredEspecialidades, setFilteredEspecialidades] = useState<Option[]>([]); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!form.medicoId) {
      setFilteredEspecialidades([]);
      setForm((prev) => ({ ...prev, especialidadeId: "" }));
      return;
    }

    const loadEspecialidadesDoMedico = async () => {
      try {
        const med: any = await getJson(`/medicos/${form.medicoId}`);
        const especs: any[] = med?.especialidade || med?.especialidades || [];
        setFilteredEspecialidades(especs);
        if (especs.length === 0) {
          setForm((prev) => ({ ...prev, especialidadeId: "" }));
        } else {
          if (!especs.some((e: any) => String(e.id) === String(form.especialidadeId))) {
            setForm((prev) => ({ ...prev, especialidadeId: "" }));
          }
        }
      } catch (e) {
        console.error(e);
        setFilteredEspecialidades([]);
      }
    };

    loadEspecialidadesDoMedico();
  }, [form.medicoId]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");
        const [m, p, e] = await Promise.all([
          getJson<Option[]>("/medicos"),
          getJson<Option[]>("/pacientes"),
          getJson<any>("/especialidades"),
        ]);
        setMedicos(m.map((x: Option) => ({ id: x.id, nome: x.nome })));
        setPacientes(p.map((x: Option) => ({ id: x.id, nome: x.nome })));
        const es: Option[] = (e || []).map((x: any) => ({ id: x.id, nome: x.nome }));
        setEspecialidades(es);
        setFilteredEspecialidades(es);
      } catch (e: unknown) {
        console.error(e);
        setErr(e instanceof Error ? e.message : String(e) || "Erro ao carregar listas");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (defaultValues.dataHora && defaultValues.dataHora.endsWith("Z")) {
      setForm((prev) => ({ ...prev, dataHora: isoUtcToLocalInput(defaultValues.dataHora!) }));
    }
  }, []);

  const hasCatalogs = useMemo(() => medicos.length > 0 && pacientes.length > 0 && especialidades.length > 0, [medicos, pacientes, especialidades]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const iso = localInputToIsoUtc(form.dataHora);
      if (!iso) throw new Error("Data/hora inválida");

      const payload = {
        dataHora: iso,
        motivo: form.motivo || undefined,
        notas: form.notas || undefined,
        medicoId: typeof form.medicoId === "string" ? Number(form.medicoId) : form.medicoId,
        pacienteId: typeof form.pacienteId === "string" ? Number(form.pacienteId) : form.pacienteId,
        especialidadeId: typeof form.especialidadeId === "string" ? Number(form.especialidadeId) : form.especialidadeId,
      };

      const method = mode === "edit" ? "PATCH" : "POST";
      const path = mode === "edit" && defaultValues.id ? `/consultas/${defaultValues.id}` : "/consultas";

      if (method === "POST") {
        await postJson(path, payload);
      } else {
        const res = await api(path, { method, body: JSON.stringify(payload) });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Falha ao salvar consulta");
        }
      }
      alert(mode === "edit" ? "Consulta atualizada!" : "Consulta criada!");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/consultas");
      }
    } catch (e: unknown) {
      console.error(e);
      alert(e instanceof Error ? e.message : String(e) || "Erro ao salvar consulta");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg border p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-800 mb-1">
        {mode === "edit" ? "Editar Consulta" : "Nova Consulta"}
      </h2>
      <p className="text-gray-600 mb-6">
        {mode === "edit" ? "Atualize os dados da consulta." : "Cadastre uma nova consulta."}
      </p>

      {loading ? (
        <div className="text-gray-600">Carregando listas…</div>
      ) : err ? (
        <div className="text-red-600">{err}</div>
      ) : !hasCatalogs ? (
        <div className="text-gray-600">Cadastre médicos e pacientes primeiro.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Paciente">
              <select
                name="pacienteId"
                value={form.pacienteId ?? ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              >
                <option value="">Selecione…</option>
                {pacientes.map((p) => (
                  <option key={String(p.id)} value={String(p.id)}>{p.nome}</option>
                ))}
              </select>
            </Field>

            <Field label="Médico">
              <select
                name="medicoId"
                value={form.medicoId ?? ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              >
                <option value="">Selecione…</option>
                {medicos.map((m) => (
                  <option key={String(m.id)} value={String(m.id)}>{m.nome}</option>
                ))}
              </select>
            </Field>

            <Field label="Data/Hora">
              <input
                type="datetime-local"
                name="dataHora"
                value={form.dataHora}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </Field>

            <Field label="Motivo">
              <input
                name="motivo"
                value={form.motivo || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                maxLength={255}
              />
            </Field>

            <Field label="Especialidade">
              <select
                name="especialidadeId"
                value={form.especialidadeId ?? ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border disabled:bg-gray-100 disabled:text-gray-500"
                required
                disabled={filteredEspecialidades.length === 0}
              >
                <option value="">Selecione…</option>
                {filteredEspecialidades.map((e) => (
                  <option key={String(e.id)} value={String(e.id)}>
                    {e.nome}
                  </option>
                ))}
              </select>

              {filteredEspecialidades.length === 0 && form.medicoId && (
                <p className="text-red-600 text-sm mt-1">
                  Esse médico não possui especialidades cadastradas.
                </p>
              )}
            </Field>

            <div className="sm:col-span-2">
              <Field label="Notas">
                <textarea
                  name="notas"
                  value={form.notas || ""}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" onClick={() => (window.history.length > 1 ? history.back() : router.push("/consultas"))}
              className="px-4 py-2 border rounded hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </>
      )}
    </form>
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