import { NextResponse } from "next/server";

/**
 * Integração futura com backend (proxy):
 *
 * export async function GET(_request: Request, { params }: { params: { id: string } }) {
 *   const res = await fetch(`${process.env.API_URL}/medicos/${params.id}`, { cache: 'no-store' });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 *
 * export async function PUT(request: Request, { params }: { params: { id: string } }) {
 *   const body = await request.json();
 *   const res = await fetch(`${process.env.API_URL}/medicos/${params.id}`, {
 *     method: 'PUT',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(body),
 *   });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 *
 * export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
 *   const res = await fetch(`${process.env.API_URL}/medicos/${params.id}`, { method: 'DELETE' });
 *   if (res.status === 204) return NextResponse.json({ success: true });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 */

const MEDICOS = [
  {
    id: 1,
    nome: "Dr. Carlos Pereira",
    crm: "123456",
    especialidade: "Clínica Geral",
    telefone: "(11) 98888-0001",
    email: "carlos@hospital.com",
  },
  {
    id: 2,
    nome: "Dra. Maria Santos",
    crm: "234567",
    especialidade: "Pediatria",
    telefone: "(11) 98888-0002",
    email: "maria@hospital.com",
  },
  {
    id: 3,
    nome: "Dr. Felipe Lima",
    crm: "345678",
    especialidade: "Ortopedia",
    telefone: "(11) 98888-0003",
    email: "felipe@hospital.com",
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const medico = MEDICOS.find((m) => m.id === id);

  if (!medico) {
    return NextResponse.json(
      { error: "Médico não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(medico);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();
  const index = MEDICOS.findIndex((m) => m.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Médico não encontrado" },
      { status: 404 }
    );
  }

  MEDICOS[index] = { ...MEDICOS[index], ...body };
  return NextResponse.json(MEDICOS[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const index = MEDICOS.findIndex((m) => m.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Médico não encontrado" },
      { status: 404 }
    );
  }

  MEDICOS.splice(index, 1);
  return NextResponse.json({ success: true });
}
