import Navbar from "@/components/ui/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="px-6 pt-16">{children}</main>
    </>
  );
}
