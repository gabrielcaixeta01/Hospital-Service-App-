"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type IdLike = string | number;

interface Paciente {
  id: IdLike;
  nome: string;
  dataNascimento?: string;
  sexo?: string;
  telefone?: string;
  email?: string;
  observacoes?: string;
  cpf?: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000/api/v1";

  // 🔹 Busca dados do paciente
  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const res = await fetch(`${API_BASE}/pacientes/${params.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("not found");
        const data = await res.json();

        setPaciente({
          id: data.id,
          nome: data.nome,
          cpf: data.cpf,
          dataNascimento: data.nascimento
            ? new Date(data.nascimento).toISOString().split("T")[0]
            : "",
          sexo: data.sexo,
          telefone: data.telefone,
          email: data.email,
          observacoes: data.observacoes,
        });
      } catch (err) {
        console.error("Erro ao carregar paciente", err);
        alert("Erro ao carregar paciente");
      } finally {
        setLoading(false);
      }
    };
    fetchPaciente();
  }, [params.id, API_BASE]);

  // 🔹 Atualiza o estado conforme inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!paciente) return;
    const { name, value } = e.target;
    setPaciente({ ...paciente, [name]: value });
  };

  // 🔹 Salvar alterações (PATCH)
  const handleSave = async () => {
    if (!paciente) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/pacientes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: paciente.nome,
          cpf: paciente.cpf,
          dataNascimento: paciente.dataNascimento,
          sexo: paciente.sexo,
          telefone: paciente.telefone,
          email: paciente.email,
          observacoes: paciente.observacoes,
        }),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      setIsEditing(false);
      alert("Paciente atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar", err);
      alert("Erro ao salvar paciente");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Excluir paciente
  const handleDelete = async () => {
    if (!confirm("Deseja realmente excluir este paciente?")) return;
    try {
      const res = await fetch(`${API_BASE}/pacientes/${params.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir");
      alert("Paciente excluído com sucesso!");
      router.push("/pacientes");
    } catch (err) {
      console.error("Erro ao excluir", err);
      alert("Erro ao excluir paciente");
    }
  };

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!paciente) return <div className="p-6">Paciente não encontrado</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              {paciente.nome}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? "Editando paciente" : "Dados do paciente"}
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
              <InputField
                label="Nome"
                name="nome"
                value={paciente.nome}
                onChange={handleChange}
              />
              <InputField
                label="CPF"
                name="cpf"
                value={paciente.cpf || ""}
                onChange={handleChange}
              />
              <InputField
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                value={paciente.dataNascimento || ""}
                onChange={handleChange}
              />
              <SelectField
                label="Sexo"
                name="sexo"
                value={paciente.sexo || ""}
                onChange={handleChange}
                options={[
                  { label: "Selecione", value: "" },
                  { label: "Masculino", value: "M" },
                  { label: "Feminino", value: "F" },
                  { label: "Outro", value: "O" },
                ]}
              />
              <InputField
                label="Telefone"
                name="telefone"
                value={paciente.telefone || ""}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={paciente.email || ""}
                onChange={handleChange}
              />
              <TextareaField
                label="Observações"
                name="observacoes"
                value={paciente.observacoes || ""}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Display label="Nome" value={paciente.nome} />
              <Display
                label="Data de Nascimento"
                value={
                  paciente.dataNascimento
                    ? new Date(paciente.dataNascimento).toLocaleDateString(
                        "pt-BR"
                      )
                    : "—"
                }
              />
              <Display
                label="Sexo"
                value={
                  paciente.sexo === "M"
                    ? "Masculino"
                    : paciente.sexo === "F"
                    ? "Feminino"
                    : paciente.sexo === "O"
                    ? "Outro"
                    : "—"
                }
              />
              <Display label="Telefone" value={paciente.telefone || "—"} />
              <Display label="Email" value={paciente.email || "—"} />
              <Display
                label="Observações"
                value={paciente.observacoes || "—"}
                full
              />
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-between">
            <button
              onClick={() => router.push("/pacientes")}
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

/* ---------- Subcomponentes reutilizáveis ---------- */

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function InputField({
  label,
  name,
  value,
  type = "text",
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
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

function TextareaField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <div className="sm:col-span-2">
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