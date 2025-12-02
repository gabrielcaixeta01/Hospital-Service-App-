"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getJson, deleteJson } from "../../../utils/api";
import DoctorForm from "@/components/forms/DoctorForm";

type IdLike = string | number;

interface Especialidade {
  id: IdLike;
  nome: string;
}

interface MedicoAPI {
  id: IdLike;
  nome: string;
  crm?: string | null;
  email?: string | null;
  telefone?: string | null;

  // CORRETO → o back retorna "especialidades"
  especialidades?: Especialidade[];
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [medico, setMedico] = useState<MedicoAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const med = await getJson<MedicoAPI>(`/medicos/${id}`);
        setMedico(med);
      } catch (e: unknown) {
        console.error(e);
        setError((e as Error)?.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Deseja realmente excluir este médico?")) return;
    try {
      await deleteJson(`/medicos/${id}`);
      alert("Médico excluído com sucesso!");
      router.push("/medicos");
    } catch (err) {
      console.error("Erro ao excluir", err);
      alert("Erro ao excluir médico");
    }
  };

  if (loading) return <div className="p-6">Carregando…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!medico) return <div className="p-6">Médico não encontrado</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">{medico.nome}</h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? "Editando médico" : "Dados do médico"}
            </p>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <DoctorForm
            mode="edit"
            defaultValues={{
              id: medico.id,
              nome: medico.nome,
              crm: medico.crm ?? "",
              telefone: medico.telefone ?? "",
              email: medico.email ?? "",

              // AQUI → agora usamos o nome real que o back usa
              especialidades: medico.especialidades ?? [],
            }}
            onSuccess={() => router.push("/medicos")}
          />
        ) : (
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Display label="Nome" value={medico.nome} />
              <Display label="CRM" value={medico.crm || "—"} />
              <Display label="Telefone" value={medico.telefone || "—"} />
              <Display label="Email" value={medico.email || "—"} />

              <Display
                label="Especialidades"
                value={
                  (medico.especialidades ?? []).length
                    ? (medico.especialidades ?? [])
                        .map((e) => e.nome)
                        .join(", ")
                    : "—"
                }
                full
              />
            </div>

            <div className="mt-6 pt-6 border-t flex justify-between">
              <button
                onClick={() => router.push("/medicos")}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Display({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-medium text-gray-900">{value}</div>
    </div>
  );
}