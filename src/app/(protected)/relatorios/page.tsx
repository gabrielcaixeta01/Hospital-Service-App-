"use client";

import Link from "next/link";

export default function RelatoriosIndex() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Relatórios</h1>
          <p className="text-gray-600">
            Visualize e filtre relatórios do sistema.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link href="/relatorios/agenda-medico" className="block">
          <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">
              Agenda por Médico
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Agenda agregada por profissional em um período.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                Abrir
              </span>
            </div>
          </div>
        </Link>

        <Link href="/relatorios/leitos" className="block">
          <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">
              Ocupação de Leitos
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Status e ocupação por unidade/quarto.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                Abrir
              </span>
            </div>
          </div>
        </Link>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            Outros relatórios
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Relatórios adicionais estarão disponíveis em breve.
          </p>
        </div>
      </div>
    </section>
  );
}
