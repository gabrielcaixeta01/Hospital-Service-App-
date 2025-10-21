'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-blue-700 text-white px-6 py-3 shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">🏥 Hospital Service</Link>
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
        <ul className="hidden md:flex gap-6">
          <li><Link href="/pacientes" className="hover:underline">Pacientes</Link></li>
          <li><Link href="/medicos" className="hover:underline">Médicos</Link></li>
          <li><Link href="/consultas" className="hover:underline">Consultas</Link></li>
          <li><Link href="/relatorios/agenda-medico" className="hover:underline">Relatórios</Link></li>
        </ul>
      </div>
      {open && (
        <ul className="md:hidden mt-3 space-y-2 bg-blue-800 rounded-lg p-4 max-w-6xl mx-auto">
          <li><Link href="/pacientes" onClick={() => setOpen(false)}>Pacientes</Link></li>
          <li><Link href="/medicos" onClick={() => setOpen(false)}>Médicos</Link></li>
          <li><Link href="/consultas" onClick={() => setOpen(false)}>Consultas</Link></li>
          <li><Link href="/relatorios/agenda-medico" onClick={() => setOpen(false)}>Relatórios</Link></li>
        </ul>
      )}
    </nav>
  );
}