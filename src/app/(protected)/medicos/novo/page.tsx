"use client";

import DoctorForm from "../components/DoctorForm";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Novo Médico</h1>
          <p className="text-gray-600 mt-2">
            Cadastre um novo médico no sistema.
          </p>
        </div>

        <DoctorForm />
      </div>
    </main>
  );
}
