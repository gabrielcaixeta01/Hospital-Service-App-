import Navbar from "@/components/ui/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto pt-20 pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}
