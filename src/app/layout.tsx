import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="px-6">{children}</main>
      </body>
    </html>
  );
}