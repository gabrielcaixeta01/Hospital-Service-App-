"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_BASE = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
  ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/+$/, "")
  : "";
const api = (path: string) =>
  fetch(`${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    credentials: "include",
  });

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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");

      // try localStorage (dev shim)
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

      // fallback to /auth/me
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
    router.push("/login");
  };

  const pickFile = (f?: File | null) => {
    if (!f) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    setAvatarFile(f);
    try {
      const url = URL.createObjectURL(f);
      setAvatarPreview(url);
    } catch {
      setAvatarPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!avatarFile) return;
    setUploading(true);
    setErr("");
    try {
      const url = `${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}/auth/avatar`;
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      const tok = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(url, {
        method: "POST",
        body: fd,
        credentials: "include",
        headers: tok ? { Authorization: `Bearer ${tok}` } : undefined,
      } as unknown as RequestInit);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Falha ao enviar avatar");
      }
      const data = await res.json();
      const updated = { ...(user ?? {}), avatarUrl: data.url } as Record<string, unknown>;
      setUser(updated);
      try { localStorage.setItem("user", JSON.stringify(updated)); } catch {}
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (e) {
      console.error(e);
      setErr((e as Error)?.message || "Erro ao enviar avatar");
    } finally {
      setUploading(false);
    }
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
              <div className="text-lg font-medium text-gray-800">{String((user as Record<string, unknown>).nome ?? (user as Record<string, unknown>).name ?? "—")}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="text-lg font-medium text-gray-800">{String((user as Record<string, unknown>).email ?? (user as Record<string, unknown>).email ?? "—")}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Data de entrada</div>
              <div className="text-lg font-medium text-gray-800">{formatDateField(user as Record<string, unknown>, ["createdAt","created_at","joinedAt","joined_at"]) ?? "—"}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-gray-500">Foto de perfil</div>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border">
                  <Image
                    src={String((user as Record<string, unknown>).avatarUrl ?? (user as Record<string, unknown>).avatar ?? (user as Record<string, unknown>).photo ?? "https://via.placeholder.com/96x96?text=User")}
                    alt="Avatar do usuário"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpload}
                      disabled={!avatarFile}
                      className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                    >
                      {uploading ? "Enviando..." : "Enviar foto"}
                    </button>
                    <button
                      onClick={() => pickFile(null)}
                      className="px-3 py-1 rounded border"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              </div>
              {avatarPreview ? (
                <div className="mt-2">
                  <div className="text-xs text-gray-500">Preview</div>
                  <Image
                    src={avatarPreview}
                    alt="Preview avatar"
                    width={96}
                    height={96}
                    unoptimized
                    className="w-24 h-24 rounded-full object-cover border mt-1"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">Nenhuma informação de usuário disponível.</div>
        )}
      </div>
    </section>
  );
}
