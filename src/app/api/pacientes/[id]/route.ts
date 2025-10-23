import { NextResponse } from "next/server";

/**
 * Integração futura com backend (proxy):
 *
 * export async function GET(_request: Request, { params }: { params: { id: string } }) {
 *   const res = await fetch(`${process.env.API_URL}/pacientes/${params.id}`, { cache: 'no-store' });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 *
 * export async function PUT(request: Request, { params }: { params: { id: string } }) {
 *   const body = await request.json();
 *   const res = await fetch(`${process.env.API_URL}/pacientes/${params.id}`, {
 *     method: 'PUT',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(body),
 *   });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 *
 * export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
 *   const res = await fetch(`${process.env.API_URL}/pacientes/${params.id}`, { method: 'DELETE' });
 *   if (res.status === 204) return NextResponse.json({ success: true });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 */

const PACIENTES = [
  {
    id: 1,
    nome: "João da Silva",
    cpf: "123.456.789-00",
    dataNascimento: "1980-05-12",
    sexo: "M",
    telefone: "(11) 99999-0001",
    email: "joao@example.com",
    observacoes: "Paciente com histórico de hipertensão",
  },
  {
    id: 2,
    nome: "Ana Oliveira",
    cpf: "987.654.321-00",
    dataNascimento: "1992-11-03",
    sexo: "F",
    telefone: "(11) 99999-0002",
    email: "ana@example.com",
    observacoes: "",
  },
  {
    id: 3,
    nome: "Pedro Gomes",
    cpf: "222.333.444-55",
    dataNascimento: "1975-07-21",
    sexo: "M",
    telefone: "(11) 99999-0003",
    email: "pedro@example.com",
    observacoes: "Alérgico a penicilina",
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const paciente = PACIENTES.find((p) => p.id === id);

  if (!paciente) {
    return NextResponse.json(
      { error: "Paciente não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(paciente);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();
  const index = PACIENTES.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Paciente não encontrado" },
      { status: 404 }
    );
  }

  PACIENTES[index] = { ...PACIENTES[index], ...body };
  return NextResponse.json(PACIENTES[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const index = PACIENTES.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Paciente não encontrado" },
      { status: 404 }
    );
  }

  PACIENTES.splice(index, 1);
  return NextResponse.json({ success: true });
}
