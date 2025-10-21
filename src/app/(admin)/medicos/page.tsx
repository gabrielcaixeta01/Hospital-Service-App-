export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
      <div className="w-full max-w-6xl px-6 py-10">
        <section
          id="medicos"
          className="min-h-screen flex flex-col items-center justify-center"
        >
          <h1 className="text-3xl font-bold text-blue-700">Médicos</h1>
          <p className="text-gray-600 mt-2">Gerencie os médicos cadastrados.</p>
        </section>
      </div>
    </main>
  );
}
