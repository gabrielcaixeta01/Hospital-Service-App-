"use client";

import React from "react";

interface Leito {
  id: string;
  quarto: string;
  setor: string;
  status: "ocupado" | "livre" | "manutencao";
  paciente?: string;
}

const MOCK_LEITOS: Leito[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i + 1}`,
  quarto: `${100 + i}-A`,
  setor: i % 3 === 0 ? "UTI" : "Clinica",
  status: i % 4 === 0 ? "manutencao" : i % 2 === 0 ? "ocupado" : "livre",
  paciente: i % 2 === 0 ? `Paciente ${i + 1}` : undefined,
}));

export default function RelatorioLeitos() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            Ocupação de Leitos
          </h1>
          <p className="text-gray-600">
            Visão rápida da ocupação por setor e quarto.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_LEITOS.map((l) => (
          <div key={l.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Quarto</div>
                <div className="text-lg font-semibold text-gray-800">
                  {l.quarto}
                </div>
                <div className="text-xs text-gray-500">{l.setor}</div>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    l.status === "ocupado"
                      ? "bg-red-100 text-red-800"
                      : l.status === "livre"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {l.status === "ocupado"
                    ? "Ocupado"
                    : l.status === "livre"
                    ? "Livre"
                    : "Manutenção"}
                </span>
              </div>
            </div>

            {l.paciente && (
              <div className="mt-4 text-sm text-gray-700">
                Paciente: {l.paciente}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button className="px-3 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50">
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
