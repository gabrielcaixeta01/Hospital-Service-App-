import { NextResponse } from "next/server";

/**
 * Integração futura com backend (proxy):
 *
 * export async function GET(_request: Request, { params }: { params: { id: string } }) {
 *   const res = await fetch(`${process.env.API_URL}/internacoes/${params.id}`, { cache: 'no-store' });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 *
 * export async function PUT(request: Request, { params }: { params: { id: string } }) {
 *   const body = await request.json();
 *   const res = await fetch(`${process.env.API_URL}/internacoes/${params.id}`, {
 *     method: 'PUT',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(body),
 *   });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 *
 * export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
 *   const res = await fetch(`${process.env.API_URL}/internacoes/${params.id}`, { method: 'DELETE' });
 *   if (res.status === 204) return NextResponse.json({ success: true });
 *   const data = await res.json();
 *   return NextResponse.json(data, { status: res.status });
 * }
 */

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const internacao = INTERNACOES.find((i) => i.id === id);

  if (!internacao) {
    return NextResponse.json(
      { error: "Internação não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(internacao);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();
  const index = INTERNACOES.findIndex((i) => i.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Internação não encontrada" },
      { status: 404 }
    );
  }

  INTERNACOES[index] = { ...INTERNACOES[index], ...body };
  return NextResponse.json(INTERNACOES[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const index = INTERNACOES.findIndex((i) => i.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Internação não encontrada" },
      { status: 404 }
    );
  }

  INTERNACOES.splice(index, 1);
  return NextResponse.json({ success: true });
}
