"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ---------- Helpers ---------- */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) || "";

const api = (path: string) =>
  fetch(`${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

/* ---------- Tipos ---------- */
type Paciente = { id: number };
type Consulta = { id: number; dataHora?: string | null; data?: string | null };
type Internacao = { id: number; dataAlta?: string | null };
type Exame = { id: number; resultado?: string | null };

// --- Gráfico de Barras Minimalista + Informativo ---
const BarChart = ({
  values,
  labels,
  height = 120,
}: {
  values: number[];
  labels: string[];
  height?: number;
}) => {
  const max = Math.max(...values);

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${values.length * 40} ${height}`}
        className="overflow-visible"
      >
        {/* Barras */}
        {values.map((v, i) => {
          const barHeight = (v / max) * (height - 30);
          return (
            <g key={i} transform={`translate(${i * 40}, 0)`}>
              {/* Barra */}
              <rect
                y={height - barHeight}
                width="28"
                height={barHeight}
                rx="4"
                fill="#2563eb"
                className="transition-all duration-300 hover:opacity-75"
              />

              {/* Valor acima da barra */}
              <text
                x="14"
                y={height - barHeight - 6}
                textAnchor="middle"
                fontSize="10"
                fill="#374151"
              >
                {v}
              </text>

              {/* Label abaixo */}
              <text
                x="14"
                y={height - 4}
                textAnchor="middle"
                fontSize="10"
                fill="#FFFFFF"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ---------- Card ---------- */
const Card = ({
  title,
  desc,
  href,
  actions = [],
}: {
  title: string;
  desc: string;
  href: string;
  actions?: { label: string; href: string }[];
}) => (
  <div className="rounded-lg border bg-white shadow-sm p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-[2px]">
    <div>
      <h3 className="text-lg font-normal text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>

    <div className="mt-4 flex items-center gap-2">
      <Link
        href={href}
        className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Abrir
      </Link>

      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {a.label}
        </Link>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [pacientesCount, setPacientesCount] = useState<number | null>(null);
  const [consultasHojeCount, setConsultasHojeCount] = useState<number | null>(null);
  const [leitosOcupadosCount, setLeitosOcupadosCount] = useState<number | null>(null);
  const [examesPendentesCount, setExamesPendentesCount] = useState<number | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const results = await Promise.allSettled([
          api("/pacientes"),
          api("/consultas"),
          api("/internacoes"),
          api("/exames"),
        ]);

        if (results[0].status === "fulfilled" && results[0].value.ok) {
          const data: Paciente[] = await results[0].value.json();
          setPacientesCount(data.length);
        }

        if (results[1].status === "fulfilled" && results[1].value.ok) {
          const cons: Consulta[] = await results[1].value.json();
          const today = new Date();
          setConsultasHojeCount(
            cons.filter((c) => {
              const stamp = c.dataHora ?? c.data;
              if (!stamp) return false;
              const d = new Date(stamp);
              return (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
              );
            }).length
          );
        }

        if (results[2].status === "fulfilled" && results[2].value.ok) {
          const ints: Internacao[] = await results[2].value.json();
          setLeitosOcupadosCount(ints.filter((i) => !i.dataAlta).length);
        }

        if (results[3].status === "fulfilled" && results[3].value.ok) {
          const exames: Exame[] = await results[3].value.json();
          setExamesPendentesCount(
            exames.filter((e) => !e.resultado || e.resultado.trim() === "").length
          );
        }
      } catch {
        setErr("Falha ao carregar indicadores.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const KPIs = useMemo(
    () => [
      { label: "Pacientes", value: pacientesCount ?? "—" },
      { label: "Consultas hoje", value: consultasHojeCount ?? "—" },
      { label: "Leitos ocupados", value: leitosOcupadosCount ?? "—" },
      { label: "Exames pendentes", value: examesPendentesCount ?? "—" },
    ],
    [pacientesCount, consultasHojeCount, leitosOcupadosCount, examesPendentesCount]
  );

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-blue-700">Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Bem-vindo! Aqui está um resumo das operações do hospital.
          </p>

          {err && <p className="text-sm mt-1 text-red-600">{err}</p>}
        </div>

        <div className="flex gap-2">
          <Link
            href="/pacientes/novo"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            + Novo Paciente
          </Link>
          <Link
            href="/consultas/nova"
            className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition"
          >
            + Agendar Consulta
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {KPIs.map((k) => (
          <div key={k.label} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{k.label}</div>
            <div className="text-xl font-normal text-gray-800 mt-1">
              {loading ? "…" : k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Cards de seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
        <Card
          title="Pacientes"
          desc="Cadastro, busca e histórico clínico."
          href="/pacientes"
          actions={[{ label: "Novo", href: "/pacientes/novo" }]}
        />
        <Card
          title="Médicos"
          desc="Cadastro de profissionais e especialidades."
          href="/medicos"
          actions={[{ label: "Novo", href: "/medicos/novo" }]}
        />
        <Card
          title="Consultas"
          desc="Agenda completa das consultas."
          href="/consultas"
          actions={[{ label: "Agendar", href: "/consultas/novo" }]}
        />
        <Card
          title="Internações"
          desc="Gerenciamento de leitos e altas."
          href="/internacoes"
          actions={[{ label: "Nova", href: "/internacoes/novo" }]}
        />
        <Card
          title="Exames"
          desc="Acompanhe pedidos e resultados."
          href="/exames"
          actions={[{ label: "Novo", href: "/exames/novo" }]}
        />
        <Card
          title="Relatórios"
          desc="Dashboards de ocupação e produtividade."
          href="/relatorios"
        />
      </div>

      {/* MINI GRÁFICO */}
      <div className="rounded-lg border bg-white shadow-sm p-6">
        <h2 className="text-lg font-normal text-gray-800 mb-3">Atendimentos (últimos dias)</h2>
        <BarChart
          values={[5, 6, 4, 7, 10, 8, 12, 9]}
          labels={["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom", "Hoje"]}
        />
      </div>
    </section>
  );
}