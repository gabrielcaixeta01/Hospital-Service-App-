"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Consulta {
  id: number;
  paciente: string;
  medico: string;
  data: string;
  horario: string;
  status: string;
  motivo?: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        const res = await fetch(`/api/consultas/${params.id}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setConsulta(data);
      } catch (err) {
        console.error("Erro ao carregar consulta", err);
        setConsulta({
          id: Number(params.id),
          paciente: "João da Silva",
          medico: "Dr. Carlos Pereira",
          data: "2025-10-21",
          horario: "09:00",
          status: "Agendada",
          motivo: "Consulta de rotina",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConsulta();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!consulta) return;
    const { name, value } = e.target;
    setConsulta({ ...consulta, [name]: value });
  };

  const handleSave = async () => {
    if (!consulta) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/consultas/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consulta),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      setIsEditing(false);
      alert("Consulta atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar", err);
      alert("Erro ao salvar consulta");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Deseja realmente excluir esta consulta?")) return;
    try {
      const res = await fetch(`/api/consultas/${params.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir");
      alert("Consulta excluída com sucesso!");
      router.push("/consultas");
    } catch (err) {
      console.error("Erro ao excluir", err);
      alert("Erro ao excluir consulta");
    }
  };

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!consulta) return <div className="p-6">Consulta não encontrada</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-4xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Consulta #{consulta.id}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? "Editando consulta" : "Detalhes da consulta"}
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
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Paciente
                </label>
                <input
                  name="paciente"
                  value={consulta.paciente}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Médico
                </label>
                <input
                  name="medico"
                  value={consulta.medico}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={consulta.data}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário
                </label>
                <input
                  type="time"
                  name="horario"
                  value={consulta.horario}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={consulta.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                >
                  <option value="Agendada">Agendada</option>
                  <option value="Realizada">Realizada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Motivo
                </label>
                <textarea
                  name="motivo"
                  value={consulta.motivo || ""}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500">Paciente</div>
                <div className="text-lg font-semibold">{consulta.paciente}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Médico</div>
                <div className="text-lg">{consulta.medico}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Data</div>
                <div className="text-lg">
                  {new Date(consulta.data).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Horário</div>
                <div className="text-lg">{consulta.horario}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-lg">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      consulta.status === "Realizada"
                        ? "bg-green-100 text-green-800"
                        : consulta.status === "Agendada"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {consulta.status}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm text-gray-500">Motivo</div>
                <div className="text-lg">{consulta.motivo || "—"}</div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-between">
            <button
              onClick={() => router.push("/consultas")}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
