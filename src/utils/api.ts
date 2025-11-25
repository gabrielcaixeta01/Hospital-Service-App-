const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) || "";

export const apiUrl = (path: string) =>
  `${API_BASE ? API_BASE : ""}${API_BASE ? "" : "/api"}${path}`;