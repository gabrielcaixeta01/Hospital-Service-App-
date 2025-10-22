"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Paciente {
  id: number;
  nome: string;
  dataNascimento?: string;
  sexo?: string;
  telefone?: string;
  email?: string;
  observacoes?: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
        // const api = process.env.NEXT_PUBLIC_API_URL;
        // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // const res = await fetch(`${api}/pacientes/${params.id}`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
        //   },
        //   cache: 'no-store',
        // });
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
          sexo: "M",
          telefone: "(11) 99999-0000",
          email: "exemplo@email.com",
          observacoes: "",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPaciente();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!paciente) return;
    const { name, value } = e.target;
    setPaciente({ ...paciente, [name]: value });
  };

  const handleSave = async () => {
    if (!paciente) return;
    setSaving(true);
    try {
      // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
      // const api = process.env.NEXT_PUBLIC_API_URL;
      // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // const res = await fetch(`${api}/pacientes/${params.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      //   body: JSON.stringify(paciente),
      // });
      const res = await fetch(`/api/pacientes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      setIsEditing(false);
      alert("Paciente atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar", err);
      alert("Erro ao salvar paciente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Deseja realmente excluir este paciente?")) return;
    try {
      // FUTURA INTEGRAÇÃO COM BACKEND (chamada direta):
      // const api = process.env.NEXT_PUBLIC_API_URL;
      // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // const res = await fetch(`${api}/pacientes/${params.id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      // });
      const res = await fetch(`/api/pacientes/${params.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir");
      alert("Paciente excluído com sucesso!");
      router.push("/pacientes");
    } catch (err) {
      console.error("Erro ao excluir", err);
      alert("Erro ao excluir paciente");
    }
  };

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!paciente) return <div className="p-6">Paciente não encontrado</div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              {paciente.nome}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? "Editando paciente" : "Dados do paciente"}
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
                  value={paciente.nome}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={paciente.dataNascimento || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={paciente.sexo || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  name="telefone"
                  value={paciente.telefone || ""}
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
                  value={paciente.email || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  name="observacoes"
                  value={paciente.observacoes || ""}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500">Nome</div>
                <div className="text-lg font-semibold">{paciente.nome}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Data de Nascimento</div>
                <div className="text-lg">
                  {paciente.dataNascimento
                    ? new Date(paciente.dataNascimento).toLocaleDateString(
                        "pt-BR"
                      )
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Sexo</div>
                <div className="text-lg">
                  {paciente.sexo === "M"
                    ? "Masculino"
                    : paciente.sexo === "F"
                    ? "Feminino"
                    : paciente.sexo === "O"
                    ? "Outro"
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Telefone</div>
                <div className="text-lg">{paciente.telefone || "—"}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-lg">{paciente.email || "—"}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm text-gray-500">Observações</div>
                <div className="text-lg">{paciente.observacoes || "—"}</div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t flex justify-between">
            <button
              onClick={() => router.push("/pacientes")}
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
