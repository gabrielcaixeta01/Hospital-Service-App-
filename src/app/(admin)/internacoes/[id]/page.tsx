"use client";

import { InternacaoForm } from "../components/InternacaoForm";
import { useEffect, useState } from "react";

interface EditarInternacaoProps {
  params: {
    id: string;
  };
}

interface Internacao {
  pacienteId: number;
  medicoId: number;
  dataInternacao: string;
  motivo: string;
  status: "ATIVO" | "ALTA";
}

export default function EditarInternacao({ params }: EditarInternacaoProps) {
  const [internacao, setInternacao] = useState<Internacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternacao = async () => {
      try {
        const response = await fetch(`/api/internacoes/${params.id}`);
        if (!response.ok) throw new Error("Falha ao carregar internação");
        const data = await response.json();
        setInternacao(data);
      } catch (error) {
        console.error("Erro ao carregar internação:", error);
        setError("Não foi possível carregar os dados da internação");
      } finally {
        setLoading(false);
      }
    };

    fetchInternacao();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error || !internacao) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">
          {error || "Internação não encontrada"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Editar Internação #{params.id}
      </h1>
      <InternacaoForm initialData={internacao} />
    </div>
  );
}
