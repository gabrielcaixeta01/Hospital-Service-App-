export default function Footer() {
  return (
    <footer className="w-full border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-center">
        © {new Date().getFullYear()} Hospital App
      </div>
    </footer>
  );
}
