"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface PatientFormValues {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo?: string;
  telefone?: string;
  email?: string;
  observacoes?: string;
}

interface PatientFormProps {
  defaultValues?: Partial<PatientFormValues>;
  mode?: "create" | "edit";
}

export default function PatientForm({
  defaultValues = {},
  mode = "create",
}: PatientFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PatientFormValues>({
    nome: defaultValues.nome || "",
    cpf: defaultValues.cpf || "",
    dataNascimento: defaultValues.dataNascimento || "",
    sexo: defaultValues.sexo || "",
    telefone: defaultValues.telefone || "",
    email: defaultValues.email || "",
    observacoes: defaultValues.observacoes || "",
  });
  const [saving, setSaving] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000/api/v1";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = mode === "edit" ? "PATCH" : "POST";
      const url =
        mode === "edit"
          ? `${API_BASE}/pacientes/${(defaultValues as { id?: string })?.id}`
          : `${API_BASE}/pacientes`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Erro ao salvar paciente");
      }

      alert(
        mode === "edit"
          ? "Paciente atualizado com sucesso!"
          : "Paciente cadastrado com sucesso!"
      );
      router.push("/pacientes");
    } catch (err) {
      console.error("Erro ao salvar paciente:", err);
      alert("Falha ao salvar paciente.");
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
        {mode === "edit" ? "Editar Paciente" : "Novo Paciente"}
      </h2>
      <p className="text-gray-600 mb-6">
        {mode === "edit"
          ? "Atualize os dados do paciente no sistema."
          : "Cadastre um novo paciente no sistema."}
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
          label="CPF"
          name="cpf"
          value={form.cpf}
          onChange={handleChange}
          required
        />

        <Input
          label="Data de Nascimento"
          name="dataNascimento"
          type="date"
          value={form.dataNascimento}
          onChange={handleChange}
          required
        />
        <Select
          label="Sexo"
          name="sexo"
          value={form.sexo}
          onChange={handleChange}
          options={[
            { value: "", label: "Selecione" },
            { value: "M", label: "Masculino" },
            { value: "F", label: "Feminino" },
            { value: "O", label: "Outro" },
          ]}
        />

        <Input
          label="Telefone"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="mt-4">
        <Textarea
          label="Observações"
          name="observacoes"
          value={form.observacoes}
          onChange={handleChange}
        />
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <button
          type="button"
          onClick={() => router.push("/pacientes")}
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

/* ---------- Subcomponentes ---------- */

type InputProps = {
  label: string;
  name: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  type?: string;
};

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
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
    </div>
  );
}

type SelectOption = { value: string; label: string };

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
    </div>
  );
}