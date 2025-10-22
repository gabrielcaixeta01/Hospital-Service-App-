"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Medico {
  id: number;
  nome: string;
  crm?: string;
  especialidade?: string;
  telefone?: string;
  email?: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMedico = async () => {
      try {
        // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
        // const api = process.env.NEXT_PUBLIC_API_URL;
        // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // const res = await fetch(`${api}/medicos/${params.id}`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
        //   },
        //   cache: 'no-store',
        // });
        const res = await fetch(`/api/medicos/${params.id}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setMedico(data);
      } catch (err) {
        console.error("Erro ao carregar médico", err);
        setMedico({
          id: Number(params.id),
          nome: "Médico Exemplo",
          crm: "CRM/SP 123456",
          especialidade: "Clínica Geral",
          telefone: "(11) 99999-1111",
          email: "medico@exemplo.com",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMedico();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!medico) return;
    const { name, value } = e.target;
    setMedico({ ...medico, [name]: value });
  };

  const handleSave = async () => {
    if (!medico) return;
    setSaving(true);
    try {
      // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
      // const api = process.env.NEXT_PUBLIC_API_URL;
      // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // const res = await fetch(`${api}/medicos/${params.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      //   body: JSON.stringify(medico),
      // });
      const res = await fetch(`/api/medicos/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medico),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      setIsEditing(false);
      alert("Médico atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar", err);
      alert("Erro ao salvar médico");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Deseja realmente excluir este médico?")) return;
    try {
      // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
      // const api = process.env.NEXT_PUBLIC_API_URL;
      // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // const res = await fetch(`${api}/medicos/${params.id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      // });
      const res = await fetch(`/api/medicos/${params.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir");
      alert("Médico excluído com sucesso!");
      router.push("/medicos");
    } catch (err) {
      console.error("Erro ao excluir", err);
      alert("Erro ao excluir médico");
    }
  };

  if (loading) return <div className="p-6">Carregando...</div>;
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
                  Nome
                </label>
                <input
                  name="nome"
                  value={medico.nome}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CRM
                </label>
                <input
                  name="crm"
                  value={medico.crm || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Especialidade
                </label>
                <input
                  name="especialidade"
                  value={medico.especialidade || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  name="telefone"
                  value={medico.telefone || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={medico.email || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500">Nome</div>
                <div className="text-lg font-semibold">{medico.nome}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">CRM</div>
                <div className="text-lg">{medico.crm || "—"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Especialidade</div>
                <div className="text-lg">{medico.especialidade || "—"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Telefone</div>
                <div className="text-lg">{medico.telefone || "—"}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-lg">{medico.email || "—"}</div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-between">
            <button
              onClick={() => router.push("/medicos")}
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
