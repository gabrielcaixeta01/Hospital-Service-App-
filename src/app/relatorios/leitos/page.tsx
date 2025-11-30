"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../../utils/api";

/* ---------- Tipos mínimos alinhados ao backend ---------- */
type LeitoAPI = {
  id: number;            // BigInt no DB, number no JSON
  codigo: string;        // ex.: "A-201"
  status?: string | null; // "livre" | "ocupado" | "manutencao" (ou variações)
};

type InternacaoAPI = {
  id: number;
  leitoId: number;
  dataEntrada: string;
  dataAlta?: string | null;
  paciente?: { id: number; nome: string } | null;
};

type StatusLeito = "ocupado" | "livre" | "manutencao";

function normalizeStatus(s?: string | null): StatusLeito {
  const v = (s ?? "").toLowerCase();
  if (v.startsWith("ocup")) return "ocupado";
  if (v.startsWith("manut")) return "manutencao";
  return "livre";
}

/* ---------- Componente ---------- */
export default function RelatorioLeitos() {
  const [leitos, setLeitos] = useState<LeitoAPI[]>([]);
  const [internacoes, setInternacoes] = useState<InternacaoAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const [leitosRes, intsRes] = await Promise.allSettled([
          api("/leitos"),
          api("/internacoes"),
        ]);

        if (leitosRes.status === "fulfilled" && leitosRes.value.ok) {
          setLeitos(await leitosRes.value.json());
        } else {
          setLeitos([]);
        }

        if (intsRes.status === "fulfilled" && intsRes.value.ok) {
          setInternacoes(await intsRes.value.json());
        } else {
          setInternacoes([]);
        }
      } catch (e: unknown) {
        console.error(e);
        setErr("Falha ao carregar leitos.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Mapa de internação ativa por leitoId
  const ativaPorLeito = useMemo(() => {
    const map = new Map<number, InternacaoAPI>();
    for (const it of internacoes) {
      if (!it.dataAlta) {
        // última encontrada vence (se houver mais de uma ativa, o back deve prevenir)
        map.set(it.leitoId, it);
      }
    }
    return map;
  }, [internacoes]);

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-blue-700">Ocupação de Leitos</h1>
        <p className="text-gray-600 mt-1">Carregando…</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-40">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Ocupação de Leitos</h1>
          <p className="text-gray-600">Visão rápida da ocupação por setor/quarto.</p>
          {err && <p className="text-sm text-red-600 mt-1">{err}</p>}
        </div>
      </div>

      {leitos.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
          Nenhum leito cadastrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {leitos.map((l) => {
            const internacaoAtiva = ativaPorLeito.get(l.id);
            const status: StatusLeito = internacaoAtiva
              ? "ocupado"
              : normalizeStatus(l.status);
            // Se quiser segmentar por setor/quarto, adicione campos no schema (ex.: setor, quarto)
            const etiqueta =
              status === "ocupado"
                ? "Ocupado"
                : status === "livre"
                ? "Livre"
                : "Manutenção";

            return (
              <div key={l.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Leito</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {l.codigo}
                    </div>
                    {/* Coloque aqui 'setor/quarto' se existirem no seu schema */}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        status === "ocupado"
                          ? "bg-red-100 text-red-800"
                          : status === "livre"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {etiqueta}
                    </span>
                  </div>
                </div>

                {internacaoAtiva?.paciente?.nome && (
                  <div className="mt-4 text-sm text-gray-700">
                    Paciente: {internacaoAtiva.paciente.nome}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    className="px-3 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50"
                    onClick={() => {
                      // navegação futura: `/leitos/${l.id}`
                      // por enquanto somente placeholder
                      alert(`Leito ${l.codigo} (id ${l.id})`);
                    }}
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}