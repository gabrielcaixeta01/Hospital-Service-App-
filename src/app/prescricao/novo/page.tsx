"use client";
export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation";
import PrescriptionForm from "@/components/forms/PrescriptionForm";

export default function Page() {
  const router = useRouter();
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams("");
  const consultaId = search.get("consultaId") ?? undefined;

  if (!consultaId) {
    return (
      <main className="min-h-screen pt-16">
        <div className="max-w-3xl mx-auto p-6">Parametro `consultaId` não fornecido.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-3xl px-6 py-10 mx-auto">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Adicionar Prescrição</h1>
            <button onClick={() => router.back()} className="px-3 py-1 border rounded">Voltar</button>
          </div>

          <p className="text-sm text-gray-600">Adiciona uma nova prescrição vinculada à consulta #{consultaId}.</p>

          <PrescriptionForm
            consultaId={consultaId}
            onSuccess={() => {
              router.push(`/consultas/${consultaId}`);
            }}
          />
        </div>
      </div>
    </main>
  );
}
