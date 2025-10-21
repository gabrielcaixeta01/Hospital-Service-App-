"use client";

import { useState } from "react";

interface Consulta {
  id: number;
  paciente: string;
  medico: string;
  data: string;
  horario: string;
  status: string;
}

const MOCK: Consulta[] = [
  {
    id: 1,
    paciente: "João da Silva",
    medico: "Dr. Carlos",
    data: "2025-10-20",
    horario: "09:00",
    status: "Realizada",
  },
  {
    id: 2,
    paciente: "Ana Oliveira",
    medico: "Dra. Maria",
    data: "2025-10-21",
    horario: "10:30",
    status: "Agendada",
  },
  {
    id: 3,
    paciente: "Pedro Gomes",
    medico: "Dr. Carlos",
    data: "2025-10-21",
    horario: "11:00",
    status: "Cancelada",
  },
];

export default function AgendaMedicoPage() {
  const [medicoFilter, setMedicoFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const medicos = Array.from(new Set(MOCK.map((c) => c.medico)));

  const filtered = MOCK.filter((c) => {
    if (medicoFilter && c.medico !== medicoFilter) return false;
    if (dateFilter && c.data !== dateFilter) return false;
    return true;
  });

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            Agenda por Médico
          </h1>
          <p className="text-gray-600">
            Filtre por médico ou data para visualizar a agenda.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Médico</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 p-2"
              value={medicoFilter}
              onChange={(e) => setMedicoFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {medicos.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Data</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 p-2"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button className="px-4 py-2 bg-gray-100 rounded">Limpar</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.horario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.paciente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.medico}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.data}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      c.status === "Realizada"
                        ? "bg-green-100 text-green-800"
                        : c.status === "Agendada"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
