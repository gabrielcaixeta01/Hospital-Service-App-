// src/utils/api.ts

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export const apiUrl = (path: string) => {
  if (!path.startsWith("/")) path = "/" + path;
  return `${API_BASE}${path}`;
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
  console.log("API_BASE =", API_BASE);
  console.log("Chamando:", apiUrl(path));
  const provided = normalizeHeaders(init?.headers);
  const headers: HeadersRecord = {
    "Content-Type": "application/json",
    ...provided,
  };

  const url = apiUrl(path);
  console.log("[API FETCH]", url);

  const res = await fetch(url, { ...init, headers });
  return res;
}

export async function getJson<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await api(path, { method: "GET", cache: "no-store", ...init });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function postJson<T = any>(path: string, body?: any, init?: RequestInit): Promise<T> {
  const res = await api(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function postForm<T = any>(path: string, form: FormData, init?: RequestInit): Promise<T> {
  const url = apiUrl(path.startsWith("/") ? path : `/${path}`);
  const res = await fetch(url, { method: "POST", body: form, ...init });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function patchJson<T = any>(path: string, body?: any, init?: RequestInit): Promise<T> {
  const res = await api(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function deleteJson(path: string, init?: RequestInit): Promise<void> {
  const res = await api(path, { method: "DELETE", ...init });
  if (!res.ok) throw new Error(await res.text());
}