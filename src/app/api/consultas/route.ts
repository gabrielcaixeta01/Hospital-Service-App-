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

export async function GET() {
  return NextResponse.json(CONSULTAS);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newConsulta = {
    id: CONSULTAS.length + 1,
    ...body,
    status: "Agendada",
  };
  CONSULTAS.push(newConsulta);
  return NextResponse.json(newConsulta, { status: 201 });
}
