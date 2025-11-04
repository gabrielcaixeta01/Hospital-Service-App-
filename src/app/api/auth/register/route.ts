import { NextResponse } from "next/server";

/**
 * Simple mock for /api/auth/register used during frontend development.
 * - Accepts POST { nome, email, password }
 * - Returns 201 { id, nome, email }
 *
 * In production, remove this file and point the frontend to your real backend
 * via NEXT_PUBLIC_API_URL (the client code prefers that when set).
 */

let nextId = 2;
const USERS: Array<{ id: number; nome: string; email: string }> = [
  { id: 1, nome: "Usuário Demo", email: "demo@example.com" },
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { nome, email, password } = body as {
    nome?: string;
    email?: string;
    password?: string;
  };

  if (!nome || !email || !password) {
    return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  // naive duplicate check
  const exists = USERS.find((u) => u.email === email);
  if (exists) {
    return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 });
  }

  const newUser = { id: nextId++, nome, email };
  USERS.push(newUser);

  return NextResponse.json(newUser, { status: 201 });
}
