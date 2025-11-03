// Converte ISO UTC -> "YYYY-MM-DDTHH:mm" no fuso local (para input datetime-local)
export function isoUtcToLocalInput(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

// Converte "YYYY-MM-DDTHH:mm" (local) -> ISO UTC com "Z"
export function localInputToIsoUtc(localValue: string) {
  if (!localValue) return null;
  const d = new Date(localValue);
  return d.toISOString(); // envia com Z
}