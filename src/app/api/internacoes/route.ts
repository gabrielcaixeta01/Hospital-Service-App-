import { NextResponse } from "next/server";

const INTERNACOES = [
  {
    id: 1,
    paciente: { id: 1, nome: "João da Silva" },
    medico: { id: 2, nome: "Dra. Maria Santos" },
    dataInternacao: "2025-10-15T09:00:00Z",
    motivo: "Pneumonia",
    status: "ATIVO",
    pacienteId: 1,
    medicoId: 2,
  },
  {
    id: 2,
    paciente: { id: 2, nome: "Ana Oliveira" },
    medico: { id: 3, nome: "Dr. Felipe Lima" },
    dataInternacao: "2025-10-10T14:00:00Z",
    motivo: "Cirurgia ortopédica",
    status: "ALTA",
    pacienteId: 2,
    medicoId: 3,
  },
];

export async function GET() {
  return NextResponse.json(INTERNACOES);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newInternacao = {
    id: INTERNACOES.length + 1,
    paciente: { id: body.pacienteId, nome: "Paciente" },
    medico: { id: body.medicoId, nome: "Médico" },
    ...body,
  };
  INTERNACOES.push(newInternacao);
  return NextResponse.json(newInternacao, { status: 201 });
}
