import { NextResponse } from "next/server";

/**
 * Simple mock for /api/auth/login used during frontend development.
 * - Accepts POST { email, password }
 * - Returns 200 { token, user } on success
 * - Returns 401 for known failing email 'fail@example.com'
 *
 * In production, remove this file and point the frontend to your real backend
 * via NEXT_PUBLIC_API_URL (the client code prefers that when set).
 */

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  // Basic validation / mock behaviour
  if (!email || !password) {
    return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 });
  }

  if (email === "fail@example.com") {
    return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 });
  }

  // Return a fake token and user object. In a real API prefer HttpOnly cookie.
  const token = "fake-jwt-token-for-dev";
  const user = { id: 1, nome: "Usuário Demo", email };

  return NextResponse.json({ token, user });
}
