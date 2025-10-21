import { NextResponse } from "next/server";

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

export async function GET() {
  return NextResponse.json(MEDICOS);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newMedico = {
    id: MEDICOS.length + 1,
    ...body,
  };
  MEDICOS.push(newMedico);
  return NextResponse.json(newMedico, { status: 201 });
}
