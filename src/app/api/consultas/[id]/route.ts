import { NextResponse } from "next/server";

/**
 * Integração futura com backend (proxy):
 *
 * Substitua os mocks abaixo por requisições diretas ao backend.
 *
 * export async function GET(_request: Request, { params }: { params: { id: string } }) {
 *   const res = await fetch(`${process.env.API_URL}/consultas/${params.id}`, { cache: 'no-store' });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 *
 * export async function PUT(request: Request, { params }: { params: { id: string } }) {
 *   const body = await request.json();
 *   const res = await fetch(`${process.env.API_URL}/consultas/${params.id}`, {
 *     method: 'PUT',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(body),
 *   });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 *
 * export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
 *   const res = await fetch(`${process.env.API_URL}/consultas/${params.id}`, { method: 'DELETE' });
 *   if (res.status === 204) return NextResponse.json({ success: true });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 */

const CONSULTAS = [
  {
    id: 1,
    paciente: "João da Silva",
    medico: "Dr. Carlos Pereira",
    data: "2025-10-21",
    horario: "09:00",
    status: "Agendada",
    motivo: "Consulta de rotina",
  },
  {
    id: 2,
    paciente: "Ana Oliveira",
    medico: "Dra. Maria Santos",
    data: "2025-10-21",
    horario: "10:30",
    status: "Realizada",
    motivo: "Acompanhamento pediátrico",
  },
  {
    id: 3,
    paciente: "Pedro Gomes",
    medico: "Dr. Carlos Pereira",
    data: "2025-10-21",
    horario: "11:00",
    status: "Cancelada",
    motivo: "Consulta de emergência",
  },
];

export async function GET(request: Request, context: unknown) {
  const id = parseInt(((context as { params?: { id?: string } })?.params?.id) || "");
  const consulta = CONSULTAS.find((c) => c.id === id);

  if (!consulta) {
    return NextResponse.json(
      { error: "Consulta não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(consulta);
}

export async function PUT(request: Request, context: unknown) {
  const id = parseInt(((context as { params?: { id?: string } })?.params?.id) || "");
  const body = await request.json();
  const index = CONSULTAS.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Consulta não encontrada" },
      { status: 404 }
    );
  }

  CONSULTAS[index] = { ...CONSULTAS[index], ...body };
  return NextResponse.json(CONSULTAS[index]);
}

export async function DELETE(request: Request, context: unknown) {
  const id = parseInt(((context as { params?: { id?: string } })?.params?.id) || "");
  const index = CONSULTAS.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Consulta não encontrada" },
      { status: 404 }
    );
  }

  CONSULTAS.splice(index, 1);
  return NextResponse.json({ success: true });
}
