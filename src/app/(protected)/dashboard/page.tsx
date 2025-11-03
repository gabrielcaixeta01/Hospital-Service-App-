"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ---------- Helpers ---------- */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) || ""; // se vazio, usa /api

const api = (path: string) =>
  fetch(`${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

/* ---------- Tipos (mínimos) ---------- */
type Paciente = { id: number };
type Consulta = { id: number; dataHora?: string | null; data?: string | null };
type Internacao = { id: number; dataAlta?: string | null };
type Exame = { id: number; resultado?: string | null };

/* ---------- Card reutilizável ---------- */
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
  <div className="rounded-2xl border bg-white shadow-sm p-5 flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <Link
        href={href}
        className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Abrir
      </Link>
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          {a.label}
        </Link>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const [pacientesCount, setPacientesCount] = useState<number | null>(null);
  const [consultasHojeCount, setConsultasHojeCount] = useState<number | null>(
    null
  );
  const [leitosOcupadosCount, setLeitosOcupadosCount] = useState<number | null>(
    null
  );
  const [examesPendentesCount, setExamesPendentesCount] = useState<number | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        // 0: pacientes, 1: consultas, 2: internacoes, 3: exames
        const results = await Promise.allSettled([
          api("/pacientes"),
          api("/consultas"),
          api("/internacoes"),
          api("/exames"),
        ]);

        // Pacientes
        if (results[0].status === "fulfilled" && results[0].value.ok) {
          const data: Paciente[] = await results[0].value.json();
          setPacientesCount(data.length);
        } else setPacientesCount(null);

        // Consultas hoje
        if (results[1].status === "fulfilled" && results[1].value.ok) {
          const cons: Consulta[] = await results[1].value.json();
          const today = new Date();
          const qtd = cons.filter((c) => {
            const stamp = (c.dataHora ?? c.data ?? null) as string | null;
            if (!stamp) return false;
            const d = new Date(stamp);
            return (
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate()
            );
          }).length;
          setConsultasHojeCount(qtd);
        } else setConsultasHojeCount(null);

        // Leitos ocupados (internações sem alta)
        if (results[2].status === "fulfilled" && results[2].value.ok) {
          const ints: Internacao[] = await results[2].value.json();
          setLeitosOcupadosCount(ints.filter((i) => !i.dataAlta).length);
        } else setLeitosOcupadosCount(null);

        // Exames pendentes (resultado null/indefinido/"")
        if (results[3].status === "fulfilled" && results[3].value.ok) {
          const exames: Exame[] = await results[3].value.json();
          const pend = exames.filter((e) => !e.resultado || e.resultado.trim() === "").length;
          setExamesPendentesCount(pend);
        } else setExamesPendentesCount(null);
      } catch (e: unknown) {
        console.error(e);
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
    <section className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo! Use os atalhos para navegar.</p>
          {err && (
            <p className="text-sm mt-1 text-red-600">
              {err} (alguns cartões podem mostrar “—”)
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/pacientes/novo"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            + Novo Paciente
          </Link>
          <Link
            href="/consultas/novo"
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            + Agendar Consulta
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPIs.map((k) => (
          <div key={k.label} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{k.label}</div>
            <div className="text-2xl font-semibold text-gray-800 mt-1">
              {loading ? "…" : k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Cards de seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Card
          title="Pacientes"
          desc="Cadastro, busca e histórico clínico (com upload de arquivos)."
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
          desc="Agendamento e gestão de status (agendada, realizada, cancelada)."
          href="/consultas"
          actions={[{ label: "Agendar", href: "/consultas/novo" }]}
        />
        <Card
          title="Internações"
          desc="Controle de admissões e alta; sincroniza ocupação de leitos."
          href="/internacoes"
          actions={[{ label: "Nova", href: "/internacoes/novo" }]}
        />
        {/* NOVO CARD: EXAMES */}
        <Card
          title="Exames"
          desc="Pedidos e resultados de exames; acompanhe pendências."
          href="/exames"
          actions={[{ label: "Novo", href: "/exames/novo" }]}
        />
        <Card
          title="Relatórios"
          desc="Agenda por médico, ocupação de leitos e atendimentos."
          href="/relatorios/agenda-medico"
          actions={[
            { label: "Agenda Médico", href: "/relatorios/agenda-medico" },
            { label: "Leitos", href: "/relatorios/leitos" },
          ]}
        />
        <Card
          title="Administração"
          desc="Especialidades, usuários do sistema e configurações."
          href="/admin"
          actions={[{ label: "Configurar", href: "/admin" }]}
        />
      </div>
    </section>
  );
}