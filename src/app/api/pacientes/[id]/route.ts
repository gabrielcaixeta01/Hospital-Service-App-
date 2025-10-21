import { NextResponse } from "next/server";

const PACIENTES = [
  {
    id: 1,
    nome: "João da Silva",
    dataNascimento: "1980-05-12",
    sexo: "M",
    telefone: "(11) 99999-0001",
    email: "joao@example.com",
    observacoes: "Paciente com histórico de hipertensão",
  },
  {
    id: 2,
    nome: "Ana Oliveira",
    dataNascimento: "1992-11-03",
    sexo: "F",
    telefone: "(11) 99999-0002",
    email: "ana@example.com",
    observacoes: "",
  },
  {
    id: 3,
    nome: "Pedro Gomes",
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
