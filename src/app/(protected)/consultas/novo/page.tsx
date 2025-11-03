import ConsultationForm from "@/components/forms/ConsultationForm";

export default function NovaConsultaPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <ConsultationForm mode="create" />
      </div>
    </main>
  );
}