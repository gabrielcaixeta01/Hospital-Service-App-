"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ConsultationForm from "@/components/forms/ConsultationForm";

export default function Page() {
  type Consultation = {
    id: string;
    dataHora: string;
    motivo?: string | null;
    notas?: string | null;
    medico?: { id: string } | null;
    paciente?: { id: string } | null;
  };

  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:4000/api/v1";

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/consultas/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar");
        const json = await res.json();
        setData(json);
      } catch {
        alert("Erro ao carregar consulta");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, API_BASE]);

  if (loading) return <div className="p-6">Carregando…</div>;
  if (!data) return <div className="p-6">Consulta não encontrada</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <ConsultationForm
          mode="edit"
          defaultValues={{
            id: data.id,
            dataHora: data.dataHora, // ISO UTC (o form cuida do local)
            motivo: data.motivo || "",
            notas: data.notas || "",
            medicoId: data.medico?.id,
            pacienteId: data.paciente?.id,
          }}
          onSuccess={() => router.push("/consultas")}
        />
      </div>
    </main>
  );
}
