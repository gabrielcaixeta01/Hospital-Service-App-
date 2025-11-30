import PatientForm from "@/components/forms/PatientForm";

export default function NovoPacientePage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <PatientForm mode="create" />
      </div>
    </main>
  );
}