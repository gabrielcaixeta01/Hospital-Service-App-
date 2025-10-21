"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DoctorFormState {
  id?: number;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
}

interface DoctorFormProps {
  initialData?: Partial<DoctorFormState>;
}

export default function DoctorForm({ initialData }: DoctorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<DoctorFormState>({
    nome: "",
    crm: "",
    especialidade: "",
    telefone: "",
    email: "",
  });

  useEffect(() => {
    if (initialData) setForm((f) => ({ ...f, ...initialData }));
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Substituir por chamada real à API
      await new Promise((res) => setTimeout(res, 800));
      router.push("/medicos");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar médico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CRM</label>
          <input
            name="crm"
            value={form.crm}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Especialidade
          </label>
          <input
            name="especialidade"
            value={form.especialidade}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/medicos")}
          className="px-4 py-2 border rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
