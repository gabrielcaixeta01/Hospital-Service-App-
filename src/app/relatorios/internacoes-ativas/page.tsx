"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../../utils/api";

type InternacaoDetalhe = {
  internacaoId: number;
  pacienteId: number;
  pacienteNome?: string | null;
  leitoId?: number | null;
  leitoCodigo?: string | null;
  dataEntrada?: string | null;
  dataPrevistaAlta?: string | null;
  medicoId?: number | null;
  medicoNome?: string | null;
  setor?: string | null;
  observacoes?: string | null;
};

export default function InternacoesAtivasDetalhes() {
  const [rows, setRows] = useState<InternacaoDetalhe[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api("/relatorios/internacoes-ativas-detalhes");
        if (!res.ok) throw new Error(await res.text());
        setRows(await res.json());
      } catch (e: unknown) {
        console.error(e);
        setErr("Erro ao carregar relatório de internações ativas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Internações Ativas - Detalhes</h1>
          <p className="text-gray-600">Relatório detalhado das internações ativas.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Carregando…</div>
      ) : err ? (
        <div className="text-red-600">{err}</div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-500">Nenhuma internação ativa encontrada.</div>
      ) : (
        <div className="bg-white rounded-lg border overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leito</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prev. Alta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {rows.map((r) => (
                <tr key={r.internacaoId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">#{r.internacaoId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.pacienteNome ?? `#${r.pacienteId}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.leitoCodigo ?? `#${r.leitoId ?? '-'}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.dataEntrada ? new Date(r.dataEntrada).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.dataPrevistaAlta ? new Date(r.dataPrevistaAlta).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.medicoNome ?? `#${r.medicoId ?? '-'}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.setor ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
