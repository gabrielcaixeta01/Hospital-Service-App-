"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Paciente {
  id: number;
  nome: string;
}

interface Medico {
  id: number;
  nome: string;
  especialidade: string;
}

interface InternacaoFormData {
  pacienteId: number;
  medicoId: number;
  dataInternacao: string;
  motivo: string;
  status: "ATIVO" | "ALTA";
}

interface InternacaoFormProps {
  initialData?: InternacaoFormData;
}

export function InternacaoForm({ initialData }: InternacaoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [formData, setFormData] = useState<InternacaoFormData>({
    pacienteId: 0,
    medicoId: 0,
    dataInternacao: new Date().toISOString().slice(0, 16),
    motivo: "",
    status: "ATIVO",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    fetchPacientes();
    fetchMedicos();
  }, [initialData]);

  const fetchPacientes = async () => {
    try {
      const response = await fetch("/api/pacientes");
      if (!response.ok) throw new Error("Falha ao carregar pacientes");
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      // fallback mock
      setPacientes([
        { id: 1, nome: "João da Silva" },
        { id: 2, nome: "Ana Oliveira" },
      ]);
    }
  };

  const fetchMedicos = async () => {
    try {
      const response = await fetch("/api/medicos");
      if (!response.ok) throw new Error("Falha ao carregar médicos");
      const data = await response.json();
      setMedicos(data);
    } catch (error) {
      console.error("Erro ao carregar médicos:", error);
      // fallback mock
      setMedicos([
        { id: 1, nome: "Dr. Carlos Pereira", especialidade: "Clínica" },
        { id: 2, nome: "Dra. Maria Santos", especialidade: "Pediatria" },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData
        ? `/api/internacoes/${initialData.pacienteId}`
        : "/api/internacoes";

      const response = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Falha ao salvar internação");
      router.push("/internacoes");
    } catch (error) {
      console.error("Erro ao salvar internação:", error);
      alert(
        "Ocorreu um erro ao salvar a internação. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paciente
            </label>
            <select
              name="pacienteId"
              value={formData.pacienteId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione um paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Médico Responsável
            </label>
            <select
              name="medicoId"
              value={formData.medicoId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione um médico</option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nome} - {medico.especialidade}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data de Internação
          </label>
          <input
            type="datetime-local"
            name="dataInternacao"
            value={formData.dataInternacao}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Motivo da Internação
          </label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
          />
        </div>

        {initialData && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="ATIVO">Internado</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push("/internacoes")}
          className="px-4 py-2 border rounded-md text-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
