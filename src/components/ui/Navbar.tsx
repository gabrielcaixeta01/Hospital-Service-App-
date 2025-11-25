"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type SectionKey =
  | "hero"
  | "pacientes"
  | "medicos"
  | "consultas"
  | "internacoes"
  | "leitos"
  | "relatorios"
  | "perfil";

const SECTIONS: { key: SectionKey; label: string; path?: string }[] = [
  { key: "hero", label: "Início", path: "/dashboard" },
  { key: "pacientes", label: "Pacientes", path: "/pacientes" },
  { key: "medicos", label: "Médicos", path: "/medicos" },
  { key: "consultas", label: "Consultas", path: "/consultas" },
  { key: "internacoes", label: "Internações", path: "/internacoes" },
  { key: "leitos", label: "Leitos", path: "/leitos" },
  { key: "relatorios", label: "Relatórios", path: "/relatorios" },
  { key: "perfil", label: "Perfil", path: "/perfil" },
];

export default function Navbar() {
  const router = useRouter();
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuButtonRef.current?.contains(target)) return;
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha dropdown com tecla Escape
  useEffect(() => {
    if (!isMobileDropdownOpen) return;
    const handle = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileDropdownOpen(false);
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [isMobileDropdownOpen]);

  const goTo = (key: SectionKey) => {
    const path = SECTIONS.find((s) => s.key === key)?.path;
    if (path) router.push(path);
    setActiveSection(key);
    setIsMobileDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200/70 shadow-sm">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto py-3 px-6">

        {/* Logo */}
        <button
          onClick={() => goTo("hero")}
          className="flex flex-col text-left group"
        >
          <span className="text-xl font-bold tracking-tight text-slate-800 group-hover:text-blue-700 transition">
            Hosp<span className="text-blue-700">Care</span>
          </span>
          <span className="text-[11px] text-slate-500 -mt-1">
            Gestão de Pacientes e Internações
          </span>
        </button>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {SECTIONS.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                className="relative text-sm font-medium text-slate-700 hover:text-blue-700 transition-all"
              >
                {item.label}

                {/* underline animado */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 rounded-full transition-all duration-300 ${
                    isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          ref={menuButtonRef}
          onClick={() => setIsMobileDropdownOpen((s) => s !== true)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-200/60 transition"
        >
          <svg
            className="w-7 h-7 text-slate-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMobileDropdownOpen && (
        <div
          ref={mobileDropdownRef}
          className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl rounded-b-xl p-4 flex flex-col gap-3 transition-all"
        >
          {SECTIONS.map((item) => (
            <button
              key={item.key}
              onClick={() => goTo(item.key)}
              className={`text-base py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition ${
                activeSection === item.key ? "text-blue-700 font-semibold" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
