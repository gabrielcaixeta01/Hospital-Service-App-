"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// no image/avatar support anymore (backend removed photo field)

const API_BASE = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
  ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/+$/, "")
  : "";
// helper `api` removed — we build the specific profile URL below to target /api/v1 when needed

type User = Record<string, unknown> | null;

function formatDateField(user: Record<string, unknown> | null, keys: string[]) {
  if (!user) return undefined;
  for (const k of keys) {
    const v = user[k];
    if (!v) continue;
    const s = String(v);
    const datePart = s.split("T")[0];
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  }
  return undefined;
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // avatar/photo removed — keep profile simple

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");

      // try localStorage (dev shim) — set as initial state but still fetch server profile
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          try { setUser(JSON.parse(raw)); } catch { setUser(null); }
          // don't return: still fetch profile to populate missing fields (nome/criadoEm)
        }
      } catch (e) {
        console.warn("failed to read local user", e);
      }

      // fallback to backend profile endpoint (prefer /api/v1/auth/profile)
      try {
        // Build a URL that targets /api/v1/auth/profile when running internal mocks,
        // or `${API_BASE}/auth/profile` when NEXT_PUBLIC_API_URL is set (may already contain /api/v1).
        const profileUrl = API_BASE
          ? `${API_BASE.replace(/\/+$/, "")}/auth/profile`
          : "/api/v1/auth/profile";

  // include Authorization header when a token exists in localStorage (some backends use Bearer tokens)
  const tok = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (tok) headers.Authorization = `Bearer ${tok}`;

  const res = await fetch(profileUrl, { credentials: "include", headers });
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

  const data = await res.json().catch(() => ({}));
        // backend may return { user: { ... } } or the user object directly
        const userObj = data.user ?? data;
        // Normalize fields: prefer 'nome' and 'criadoEm' (Portuguese) but accept common alternatives
        const normalized: Record<string, unknown> = {
          ...(userObj ?? {}),
        };

        // fallback: if nome missing, try to create from email
        const extractNameFromEmail = (email?: unknown) => {
          if (!email) return undefined;
          const s = String(email);
          const part = s.split("@")[0] ?? "";
          const cleaned = part.replace(/[._\-]/g, " ").trim();
          return cleaned ? cleaned.replace(/\b\w/g, (c) => String(c).toUpperCase()) : undefined;
        };

        if (!normalized.nome && normalized.email) {
          normalized.nome = extractNameFromEmail(normalized.email);
        }
        // map createdAt -> criadoEm if present
        if (!normalized.criadoEm && (normalized.createdAt || normalized.created_at)) {
          normalized.criadoEm = normalized.createdAt ?? normalized.created_at;
        }

        setUser(normalized);
        try { localStorage.setItem("user", JSON.stringify(normalized)); } catch {}
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
    router.push("/login");
  };

  // avatar upload removed — nothing to do here

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
              <div className="text-lg font-medium text-gray-800">{String((user as Record<string, unknown>).nome ?? (user as Record<string, unknown>).name ?? "—")}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="text-lg font-medium text-gray-800">{String((user as Record<string, unknown>).email ?? (user as Record<string, unknown>).email ?? "—")}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Data de entrada</div>
              <div className="text-lg font-medium text-gray-800">{formatDateField(user as Record<string, unknown>, ["criadoEm","criado_em","createdAt","created_at","joinedAt","joined_at"]) ?? "—"}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">Nenhuma informação de usuário disponível.</div>
        )}
      </div>
    </section>
  );
}
