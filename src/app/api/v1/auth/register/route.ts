import { NextResponse } from "next/server";

/**
 * Compatibility shim for clients calling /api/v1/auth/register.
 * This forwards to a local mock implementation so the frontend works while
 * the real backend is not available at that path.
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

  const exists = USERS.find((u) => u.email === email);
  if (exists) {
    return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 });
  }

  const newUser = { id: nextId++, nome, email };
  USERS.push(newUser);

  return NextResponse.json(newUser, { status: 201 });
}
