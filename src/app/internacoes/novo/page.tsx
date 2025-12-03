"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJson, postJson } from "../../../utils/api";

interface Paciente { id: number; nome: string }
interface Leito { id: number; codigo: string }

function toDatetimeLocal(now = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = now.getFullYear();
  const MM = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}
function fromDatetimeLocal(local: string) {
  return new Date(local).toISOString();
}

export default function NovaInternacaoPage() {
  const router = useRouter();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [leitos, setLeitos] = useState<Leito[]>([]);

  const [pacienteId, setPacienteId] = useState<number | "">("");
  const [leitoId, setLeitoId] = useState<number | "">("");
  const [dataEntradaLocal, setDataEntradaLocal] = useState<string>(
    toDatetimeLocal()
  );
  const [dataAltaLocal, setDataAltaLocal] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pData, lData] = await Promise.all([
          getJson<Paciente[]>("/pacientes"),
          getJson<Leito[]>("/leitos"),
        ]);
        setPacientes(pData);
        setLeitos(lData);
      } catch (e: unknown) {
        setError((e as Error)?.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !leitoId) {
      alert("Selecione paciente e leito.");
      return;
    }
    setSaving(true);
    try {
      const created = await postJson("/internacoes", {
        pacienteId: Number(pacienteId),
        leitoId: Number(leitoId),
        dataEntrada: fromDatetimeLocal(dataEntradaLocal),
        dataAlta: dataAltaLocal ? fromDatetimeLocal(dataAltaLocal) : null,
      });
      alert("Internação criada com sucesso!");
      router.push(`/internacoes/${created.id}`);
    } catch (e) {
      console.error(e);
      let msg = "Erro ao criar internação";
      try {
        if (e instanceof Error) {
          const maybe = e.message;
          try {
            const parsed = JSON.parse(maybe);
            if (parsed && parsed.message) msg = parsed.message;
            else if (typeof maybe === "string" && maybe.trim()) msg = maybe;
          } catch (_) {
            if (maybe && maybe.trim()) msg = maybe;
          }
        } else if (typeof e === "string") {
          try {
            const parsed = JSON.parse(e);
            if (parsed && parsed.message) msg = parsed.message;
            else msg = e;
          } catch (_) {
            msg = e;
          }
        }
      } catch (_) {
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Carregando…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Nova Internação
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paciente
            </label>
            <select
              className="mt-1 w-full border rounded p-2"
              value={pacienteId}
              onChange={(e) =>
                setPacienteId(e.target.value ? Number(e.target.value) : "")
              }
              required
            >
              <option value="">Selecione…</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Leito
            </label>
            <select
              className="mt-1 w-full border rounded p-2"
              value={leitoId}
              onChange={(e) =>
                setLeitoId(e.target.value ? Number(e.target.value) : "")
              }
              required
            >
              <option value="">Selecione…</option>
              {leitos.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.codigo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Entrada
            </label>
            <input
              type="datetime-local"
              className="mt-1 w-full border rounded p-2"
              value={dataEntradaLocal}
              onChange={(e) => setDataEntradaLocal(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Alta (opcional)
            </label>
            <input
              type="datetime-local"
              className="mt-1 w-full border rounded p-2"
              value={dataAltaLocal}
              onChange={(e) => setDataAltaLocal(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Salvando…" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/internacoes")}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}