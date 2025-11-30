// Remove barras duplicadas do final da URL base
const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")
  : "";

// Garante que sempre tenha UMA barra antes do path
export const apiUrl = (path: string) => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${clean}`;
};

type HeadersRecord = Record<string, string>;

function normalizeHeaders(h?: HeadersInit): HeadersRecord {
  if (!h) return {};
  if (h instanceof Headers) {
    const out: HeadersRecord = {};
    h.forEach((v, k) => (out[k] = v));
    return out;
  }
  if (Array.isArray(h)) {
    const out: HeadersRecord = {};
    for (const [k, v] of h) out[k] = v;
    return out;
  }
  return h as HeadersRecord;
}

export async function api(path: string, init?: RequestInit) {
  const provided = normalizeHeaders(init?.headers);
  const headers: HeadersRecord = {
    "Content-Type": "application/json",
    ...provided,
  };

  const res = await fetch(apiUrl(path), { ...init, headers });
  return res;
}

export async function getJson<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await api(path, { method: "GET", cache: "no-store", ...init });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return await res.json();
}

export async function postJson<T = any>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<T> {
  const res = await api(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return await res.json();
}

export async function patchJson<T = any>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<T> {
  const res = await api(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return await res.json();
}

export async function deleteJson(path: string, init?: RequestInit) {
  const res = await api(path, { method: "DELETE", ...init });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
}