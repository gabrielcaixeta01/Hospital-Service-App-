"use client";

import Link from "next/link";

const MOCK = [
  {
    id: 1,
    paciente: "João da Silva",
    medico: "Dr. Carlos",
    data: "2025-10-21",
    horario: "09:00",
    status: "Agendada",
  },
  {
    id: 2,
    paciente: "Ana Oliveira",
    medico: "Dra. Maria",
    data: "2025-10-21",
    horario: "10:30",
    status: "Realizada",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Consultas</h1>
            <p className="text-gray-600 mt-1">Agende e gerencie consultas.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/consultas/novo"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              + Agendar Consulta
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Consultas hoje", value: MOCK.length },
            { label: "Agendadas", value: 1 },
            { label: "Realizadas", value: 1 },
            { label: "Canceladas", value: 0 },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="text-sm text-gray-500">{k.label}</div>
              <div className="text-2xl font-semibold text-gray-800 mt-1">
                {k.value}
              </div>
            </div>
          ))}
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK.map((c) => (
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
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/consultas/${c.id}`}
                        className="px-2 py-1 text-sm border rounded"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
