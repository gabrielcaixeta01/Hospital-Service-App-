"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../utils/api";

type Consulta = { id: number; dataHora?: string | null; data?: string | null; medicoId?: number | null };
type Internacao = { id: number; dataAlta?: string | null };
type Leito = { id: number; status?: string | null };

export default function RelatoriosIndex() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const [consultasProx7, setConsultasProx7] = useState<number | null>(null);
  const [leitosOcupados, setLeitosOcupados] = useState<number | null>(null);
  const [leitosTotal, setLeitosTotal] = useState<number | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const [consRes, intsRes, leitosRes] = await Promise.allSettled([
          api("/consultas"),
          api("/internacoes"),
          api("/leitos"),
        ]);

        if (consRes.status === "fulfilled" && consRes.value.ok) {
          const cons: Consulta[] = await consRes.value.json();
          const now = new Date();
          const in7 = new Date();
          in7.setDate(in7.getDate() + 7);
          const qtd = cons.filter((c) => {
            const stamp = (c.dataHora ?? c.data ?? null) as string | null;
            if (!stamp) return false;
            const d = new Date(stamp);
            return d >= now && d <= in7;
          }).length;
          setConsultasProx7(qtd);
        } else {
          setConsultasProx7(null);
        }

        if (intsRes.status === "fulfilled" && intsRes.value.ok) {
          const ints: Internacao[] = await intsRes.value.json();
          setLeitosOcupados(ints.filter((i) => !i.dataAlta).length);
        } else {
          setLeitosOcupados(null);
        }

        if (leitosRes.status === "fulfilled" && leitosRes.value.ok) {
          const leitos: Leito[] = await leitosRes.value.json();
          setLeitosTotal(leitos.length);
        } else {
          setLeitosTotal(null);
        }
      } catch (e: unknown) {
        console.error(e);
        setErr("Falha ao carregar dados de relatórios.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const badge = useMemo(() => {
    const cls =
      "inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium";
    return { cls };
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Relatórios</h1>
          <p className="text-gray-600">Visualize e filtre relatórios do sistema.</p>
          {err && <p className="text-sm text-red-600 mt-1">{err}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Agenda por Médico */}
        <Link href="/relatorios/agenda-medico" className="block">
          <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">Agenda por Médico</h3>
            <p className="mt-2 text-sm text-gray-500">
              Agenda agregada por profissional em um período.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className={badge.cls}>Abrir</span>
              <span className="text-xs text-gray-500">
                {loading ? "carregando…" : `${consultasProx7 ?? "—"} consultas nos próximos 7 dias`}
              </span>
            </div>
          </div>
        </Link>

        {/* Ocupação de Leitos */}
        <Link href="/relatorios/leitos" className="block">
          <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">Ocupação de Leitos</h3>
            <p className="mt-2 text-sm text-gray-500">
              Status e ocupação por unidade/quarto.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className={badge.cls}>Abrir</span>
              <span className="text-xs text-gray-500">
                {loading
                  ? "carregando…"
                  : `${leitosOcupados ?? "—"} ocupados / ${leitosTotal ?? "—"} totais`}
              </span>
            </div>
          </div>
        </Link>

        {/* Internações Ativas - Detalhes */}
        <Link href="/relatorios/internacoes-ativas" className="block">
          <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">Internações Ativas</h3>
            <p className="mt-2 text-sm text-gray-500">Detalhes das internações ativas por leito, paciente e médico.</p>
            <div className="mt-4 flex items-center gap-2">
              <span className={badge.cls}>Abrir</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}