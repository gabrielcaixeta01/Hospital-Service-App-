import DoctorForm from "@/components/forms/DoctorForm";

export default function NovoMedicoPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <DoctorForm mode="create" />
      </div>
    </main>
  );
}
