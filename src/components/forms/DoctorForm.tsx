"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getJson, postJson, api } from "../../utils/api";

type IdLike = number | string;

export interface DoctorFormValues {
  nome: string;
  crm?: string;
  telefone?: string;
  email?: string;
  especialidadesIds?: number[];
}

interface Especialidade {
  id: IdLike;
  nome: string;
}

interface DoctorFormProps {
  mode?: "create" | "edit";
  defaultValues?: {
    id?: IdLike;
    nome?: string;
    crm?: string | null;
    telefone?: string | null;
    email?: string | null;

    especialidades?: Especialidade[];
  };
  onSuccess?: () => void;
}

export default function DoctorForm({
  mode = "create",
  defaultValues = {},
  onSuccess,
}: DoctorFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<DoctorFormValues>({
    nome: defaultValues.nome || "",
    crm: defaultValues.crm || "",
    telefone: defaultValues.telefone || "",
    email: defaultValues.email || "",
    especialidadesIds: (defaultValues.especialidades || []).map((e) =>
      Number(e.id)
    ),
  });

  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loadingEsp, setLoadingEsp] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingEsp(true);
        const data = await getJson<Especialidade[]>("/especialidades");
        setEspecialidades(data);
      } catch (err: unknown) {
        console.error(err);
        setError("Erro ao carregar especialidades");
      } finally {
        setLoadingEsp(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setForm({
      nome: defaultValues.nome || "",
      crm: defaultValues.crm || "",
      telefone: defaultValues.telefone || "",
      email: defaultValues.email || "",
      especialidadesIds: (defaultValues.especialidades || []).map((e) =>
        Number(e.id)
      ),
    });
  }, [defaultValues]);

  const hasEspecialidades = useMemo(
    () => especialidades.length > 0,
    [especialidades]
  );

  const toggleEspecialidade = (id: IdLike) => {
    setForm((prev) => {
      const num = Number(id);
      const list = prev.especialidadesIds || [];
      const exists = list.includes(num);

      return {
        ...prev,
        especialidadesIds: exists
          ? list.filter((v) => v !== num)
          : [...list, num],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        nome: form.nome,
        crm: form.crm || undefined,
        telefone: form.telefone || undefined,
        email: form.email || undefined,
        especialidadesIds: (form.especialidadesIds || []).map(Number),
      };

      if (mode === "create") {
        await postJson("/medicos", payload);
        alert("Médico criado com sucesso!");
      } else {
        if (!defaultValues.id)
          throw new Error("ID do médico não informado para edição.");

        const res = await api(`/medicos/${defaultValues.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Erro ao atualizar médico");
        }

        alert("Médico atualizado com sucesso!");
      }

      onSuccess ? onSuccess() : router.replace("/medicos"); router.refresh?.();
    } catch (err: unknown) {
      console.error(err);
      alert((err as Error)?.message || "Erro ao salvar médico");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-blue-800 mb-1">
        {mode === "edit" ? "Editar Médico" : "Novo Médico"}
      </h2>
      <p className="text-gray-600 mb-6">
        {mode === "edit"
          ? "Atualize os dados do médico."
          : "Cadastre um novo médico."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nome" name="nome" value={form.nome} onChange={(e: { target: { value: any; }; }) => setForm({ ...form, nome: e.target.value })} required />

        <Input label="CRM" name="crm" value={form.crm || ""} onChange={(e: { target: { value: any; }; }) => setForm({ ...form, crm: e.target.value })} />

        <Input label="Telefone" name="telefone" value={form.telefone || ""} onChange={(e: { target: { value: any; }; }) => setForm({ ...form, telefone: e.target.value })} />

        <Input label="Email" name="email" type="email" value={form.email || ""} onChange={(e: { target: { value: any; }; }) => setForm({ ...form, email: e.target.value })} />
      </div>

      <div className="mt-4">
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Especialidades
        </div>

        {loadingEsp ? (
          <div>Carregando especialidades…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !hasEspecialidades ? (
          <div className="text-gray-600">Nenhuma especialidade cadastrada.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {especialidades.map((e) => {
              const checked =
                form.especialidadesIds?.includes(Number(e.id)) || false;

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
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <button
          type="button"
          onClick={() => router.push("/medicos")}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}

function Input({ label, name, value, onChange, required, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
    </div>
  );
}