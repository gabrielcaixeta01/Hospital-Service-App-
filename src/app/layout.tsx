import Navbar from "@/components/ui/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      < Navbar />
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
