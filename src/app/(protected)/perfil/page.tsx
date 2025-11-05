"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
  ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/+$/, "")
  : "";
const api = (path: string) =>
  fetch(`${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    credentials: "include",
  });

type User = { id?: number; nome?: string; email?: string } | null;

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");

      // Try to get user from localStorage first (works with our dev shim)
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          setUser(JSON.parse(raw));
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn("failed to read local user", e);
      }

      // Otherwise, try to call backend /auth/me
      try {
        const res = await api("/auth/me");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          const text = await res.text().catch(() => "");
          setErr(text || "Falha ao carregar dados do usuário");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.user ?? data);
      } catch (e) {
        console.error(e);
        setErr("Erro ao buscar dados do usuário");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}
    // Ideally call backend logout to clear cookie; for now redirect to login
    router.push("/login");
  };

  return (
    <section className="max-w-3xl mx-auto px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
          <p className="text-sm text-gray-500">Visualize suas informações de conta</p>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        {loading ? (
          <div>Carregando…</div>
        ) : err ? (
          <div className="text-sm text-red-600">{err}</div>
        ) : user ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs text-gray-500">Nome</div>
              <div className="text-lg font-medium text-gray-800">{user.nome ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="text-lg font-medium text-gray-800">{user.email ?? "—"}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-gray-500">ID</div>
              <div className="text-sm text-gray-700">{user.id ?? "—"}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">Nenhuma informação de usuário disponível.</div>
        )}
      </div>
    </section>
  );
}
