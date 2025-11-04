import { NextResponse } from "next/server";

/**
 * Compatibility shim for clients calling /api/v1/auth/login.
 * Returns a fake token and user for development.
 */

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 });
  }

  if (email === "fail@example.com") {
    return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 });
  }

  const token = "fake-jwt-token-for-dev";
  const user = { id: 1, nome: "Usuário Demo", email };

  return NextResponse.json({ token, user });
}
