import { NextResponse } from "next/server";

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const consulta = CONSULTAS.find((c) => c.id === id);

  if (!consulta) {
    return NextResponse.json(
      { error: "Consulta não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(consulta);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
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
