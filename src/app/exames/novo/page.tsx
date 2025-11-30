"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../utils/api";

type Pessoa = { id: number; nome: string };
type ConsultaLite = {
  id: number;
  dataHora?: string | null;
  motivo?: string | null;
  paciente?: Pessoa | null;
  medico?: Pessoa | null;
};

// uses centralized `api` helper from `src/utils/api`

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
function fmtShort(d?: string | null) {
  return d ? new Date(d).toLocaleString("pt-BR") : "—";
}

export default function NovoExamePage() {
  const router = useRouter();

  const [consultas, setConsultas] = useState<ConsultaLite[]>([]);
  const [consultaId, setConsultaId] = useState<number | "">("");
  const [tipo, setTipo] = useState("");
  const [dataHoraLocal, setDataHoraLocal] = useState(toDatetimeLocal());
  const [resultado, setResultado] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await api("/consultas");
        if (!res.ok) throw new Error(await res.text());
        const json: ConsultaLite[] = await res.json();
        setConsultas(json);
      } catch (e: unknown) {
        console.error(e);
        setErr((e as Error)?.message || "Falha ao carregar consultas.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultaId || !tipo.trim()) {
      alert("Selecione a consulta e informe o tipo do exame.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        consultaId: Number(consultaId),
        tipo: tipo.trim(),
        dataHora: dataHoraLocal ? fromDatetimeLocal(dataHoraLocal) : undefined,
        resultado: resultado.trim() ? resultado.trim() : null,
      };
      const res = await api("/exames", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      alert("Exame criado com sucesso!");
      router.push(`/exames/${created.id}`);
    } catch (e) {
      console.error(e);
      alert("Erro ao criar exame.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Carregando…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Novo Exame</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Consulta
            </label>
            <select
              className="mt-1 w-full border rounded p-2"
              value={consultaId}
              onChange={(e) =>
                setConsultaId(e.target.value ? Number(e.target.value) : "")
              }
              required
            >
              <option value="">Selecione…</option>
              {consultas.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} • {c.paciente?.nome ?? "Paciente"} —{" "}
                  {c.medico?.nome ?? "Médico"} — {fmtShort(c.dataHora)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo do exame
            </label>
            <input
              className="mt-1 w-full border rounded p-2"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder="Hemograma, Raio-X, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data/Hora (opcional)
            </label>
            <input
              type="datetime-local"
              className="mt-1 w-full border rounded p-2"
              value={dataHoraLocal}
              onChange={(e) => setDataHoraLocal(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resultado (opcional)
            </label>
            <textarea
              className="mt-1 w-full border rounded p-2"
              rows={4}
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              placeholder="Deixe em branco para pendente"
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
              onClick={() => router.push("/exames")}
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