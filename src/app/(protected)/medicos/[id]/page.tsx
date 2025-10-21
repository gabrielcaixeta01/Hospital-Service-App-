"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Medico {
  id: number;
  nome: string;
  especialidade?: string;
  telefone?: string;
  email?: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedico = async () => {
      try {
        const res = await fetch(`/api/medicos/${params.id}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setMedico(data);
      } catch (err) {
        console.error("Erro ao carregar médico", err);
        setMedico({
          id: Number(params.id),
          nome: "Médico Exemplo",
          especialidade: "Clínica",
          telefone: "(11) 99999-1111",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMedico();
  }, [params.id]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!medico) return <div className="p-6">Médico não encontrado</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">{medico.nome}</h1>
          <p className="text-gray-600 mt-1">Dados do médico</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Nome</div>
              <div className="text-lg font-semibold">{medico.nome}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Especialidade</div>
              <div className="text-lg">{medico.especialidade}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Telefone</div>
              <div className="text-lg">{medico.telefone || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-lg">{medico.email || "—"}</div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => router.push("/medicos")}
              className="px-4 py-2 border rounded"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
