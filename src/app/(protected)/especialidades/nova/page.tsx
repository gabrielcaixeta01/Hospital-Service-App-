"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoEspecialidadePage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000/api/v1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      // 🔥 Se não houver token → usuário não está logado
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_BASE}/especialidades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✔ token incluído
        },
        body: JSON.stringify({ nome }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Falha ao criar especialidade");
      }

      alert("Especialidade criada com sucesso!");
      router.push("/especialidades");
    } catch (err: unknown) {
      console.error(err);
      alert((err as Error)?.message || "Erro ao criar especialidade");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="px-6 py-10 max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border p-6 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-blue-800 mb-1">
            Nova Especialidade
          </h2>
          <p className="text-gray-600 mb-6">Cadastre uma nova especialidade.</p>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => router.push("/especialidades")}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}