const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) || "";

export const apiUrl = (path: string) =>
  `${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`;

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

export async function getJson<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await api(path, { method: "GET", cache: "no-store", ...init });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
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
  return (await res.json()) as T;
}