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
  especialidade?: string;
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [form, setForm] = useState({
    pacienteId: "",
    medicoId: "",
    data: new Date().toISOString().slice(0, 10),
    hora: "09:00",
    motivo: "",
  });

  useEffect(() => {
    // Simular fetch
    const mockPacientes: Paciente[] = [
      { id: 1, nome: "João da Silva" },
      { id: 2, nome: "Ana Oliveira" },
    ];
    const mockMedicos: Medico[] = [
      { id: 1, nome: "Dr. Carlos", especialidade: "Clínica" },
      { id: 2, nome: "Dra. Maria", especialidade: "Pediatria" },
    ];
    setPacientes(mockPacientes);
    setMedicos(mockMedicos);
  }, []);

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
    setLoading(true);
    try {
      // TODO: enviar para API real
      await new Promise((res) => setTimeout(res, 800));
      router.push("/consultas");
    } catch (err) {
      console.error(err);
      alert("Erro ao agendar consulta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-4xl px-6 py-10 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Nova Consulta</h1>
          <p className="text-gray-600 mt-2">Agende uma nova consulta.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Paciente
              </label>
              <select
                name="pacienteId"
                value={form.pacienteId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 p-2"
              >
                <option value="">Selecione um paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Médico
              </label>
              <select
                name="medicoId"
                value={form.medicoId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 p-2"
              >
                <option value="">Selecione um médico</option>
                {medicos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} - {m.especialidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora
              </label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 p-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Motivo
              </label>
              <textarea
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 p-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/consultas")}
              className="px-4 py-2 border rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Agendando..." : "Agendar"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
