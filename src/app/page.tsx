import React from "react";
import Link from "next/link";

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
  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Topbar spacer se a Navbar for fixed */}
      <div className="h-16" />
      <section className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo! Use os atalhos para navegar.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/pacientes/novo" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              + Novo Paciente
            </Link>
            <Link href="/consultas/novo" className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
              + Agendar Consulta
            </Link>
          </div>
        </div>

        {/* KPIs (estáticos por enquanto; depois ligamos à API) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pacientes", value: "—" },
            { label: "Consultas hoje", value: "—" },
            { label: "Leitos ocupados", value: "—" },
            { label: "Exames pendentes", value: "—" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="text-sm text-gray-500">{k.label}</div>
              <div className="text-2xl font-semibold text-gray-800 mt-1">{k.value}</div>
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
          <Card
            title="Relatórios"
            desc="Relatórios de agenda por médico, ocupação de leitos e atendimentos."
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
    </main>
  );
}