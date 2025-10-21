"use client";

import { InternacaoForm } from "../components/InternacaoForm";

export default function NovaInternacao() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Nova Internação</h1>
      <InternacaoForm />
    </div>
  );
}
