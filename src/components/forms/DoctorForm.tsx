"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getJson, postJson } from "../../utils/api";

type IdLike = number | string;

export interface DoctorFormValues {
  nome: string;
  crm?: string;
  telefone?: string;
  email?: string;
  especialidadeIds?: IdLike[];
}

interface Especialidade {
  id: IdLike;
  nome: string;
}

interface DoctorFormProps {
  mode?: "create" | "edit";
  // Para o modo "edit", passe o id e os valores iniciais (incluindo especialidades atuais)
  defaultValues?: Partial<DoctorFormValues> & {
    id?: IdLike;
    especialidades?: Especialidade[];
  };
  onSuccess?: () => void; // callback opcional após sucesso
}

export default function DoctorForm({
  mode = "create",
  defaultValues = {},
  onSuccess,
}: DoctorFormProps) {
  const router = useRouter();

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000/api/v1";

  // estado do formulário
  const [form, setForm] = useState<DoctorFormValues>({
    nome: defaultValues.nome || "",
    crm: defaultValues.crm || "",
    telefone: defaultValues.telefone || "",
    email: defaultValues.email || "",
    especialidadeIds: (defaultValues.especialidades || []).map((e) => e.id),
  });

  // catálogo de especialidades
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loadingEsp, setLoadingEsp] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // carregar catálogo de especialidades
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingEsp(true);
        setError("");
        // headers (no authentication required)
        const headers: Record<string, string> = { "Content-Type": "application/json" };

        const data = await getJson<Especialidade[]>("/especialidades");
        setEspecialidades(data);
      } catch (err: unknown) {
        console.error(err);
        setError((err as Error)?.message || "Erro ao carregar especialidades");
      } finally {
        setLoadingEsp(false);
      }
    };
    load();
  }, [API_BASE, router]);

  const hasEspecialidades = useMemo(
    () => especialidades.length > 0,
    [especialidades]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEspecialidade = (eid: IdLike) => {
    setForm((prev) => {
      const list = prev.especialidadeIds ?? [];
      const exists = list.includes(eid);
      return {
        ...prev,
        especialidadeIds: exists ? list.filter((v) => v !== eid) : [...list, eid],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (mode === "create") {
        await postJson("/medicos", {
          nome: form.nome,
          crm: form.crm || undefined,
          telefone: form.telefone || undefined,
          email: form.email || undefined,
          especialidadeIds: (form.especialidadeIds ?? []).map((v) =>
            typeof v === "string" ? Number(v) : v
          ),
        });
        alert("Médico cadastrado com sucesso!");
      } else {
        if (!defaultValues.id) {
          throw new Error("ID do médico não informado para edição.");
        }
        const res = await api(`/medicos/${defaultValues.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            nome: form.nome,
            crm: form.crm || undefined,
            telefone: form.telefone || undefined,
            email: form.email || undefined,
            // substitui completamente as relações
            replaceEspecialidadeIds: (form.especialidadeIds ?? []).map((v) =>
              typeof v === "string" ? Number(v) : v
            ),
          }),
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Falha ao atualizar médico");
        }
        alert("Médico atualizado com sucesso!");
      }

      if (onSuccess) onSuccess();
      else router.push("/medicos");
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
          ? "Atualize os dados do médico no sistema."
          : "Cadastre um novo médico no sistema."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <Input
          label="CRM"
          name="crm"
          value={form.crm || ""}
          onChange={handleChange}
        />

        <Input
          label="Telefone"
          name="telefone"
          value={form.telefone || ""}
          onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email || ""}
          onChange={handleChange}
        />
      </div>

      <div className="mt-4">
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Especialidades
        </div>

        {loadingEsp ? (
          <div className="text-gray-600">Carregando especialidades…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !hasEspecialidades ? (
          <div className="text-gray-600">Nenhuma especialidade cadastrada.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {especialidades.map((e) => {
              const checked = (form.especialidadeIds ?? []).includes(e.id);
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
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}

/* ---------- UI helpers ---------- */

interface InputProps {
  label: string;
  name: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  type?: string;
}

function Input({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}: InputProps) {
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