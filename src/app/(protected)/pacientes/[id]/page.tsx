"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Paciente {
  id: number;
  nome: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const res = await fetch(`/api/pacientes/${params.id}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setPaciente(data);
      } catch (err) {
        console.error("Erro ao carregar paciente", err);
        setPaciente({
          id: Number(params.id),
          nome: "Paciente Exemplo",
          dataNascimento: "1985-01-01",
          telefone: "(11) 99999-0000",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPaciente();
  }, [params.id]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!paciente) return <div className="p-6">Paciente não encontrado</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">{paciente.nome}</h1>
          <p className="text-gray-600 mt-1">Dados do paciente</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Nome</div>
              <div className="text-lg font-semibold">{paciente.nome}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Data de Nascimento</div>
              <div className="text-lg">{paciente.dataNascimento}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Telefone</div>
              <div className="text-lg">{paciente.telefone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-lg">{paciente.email || "—"}</div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => router.push("/pacientes")}
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
