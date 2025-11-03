"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type SectionKey =
  | "hero"
  | "pacientes"
  | "medicos"
  | "consultas"
  | "internacoes"
  | "relatorios";

const SECTIONS: { key: SectionKey; label: string; path?: string }[] = [
  { key: "hero", label: "Início", path: "/dashboard" },
  { key: "pacientes", label: "Pacientes", path: "/pacientes" },
  { key: "medicos", label: "Médicos", path: "/medicos" },
  { key: "consultas", label: "Consultas", path: "/consultas" },
  { key: "internacoes", label: "Internações", path: "/internacoes" },
  { key: "relatorios", label: "Relatórios", path: "/relatorios" },
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileDropdownOpen(false);
    };
    if (isMobileDropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
    return;
  }, [isMobileDropdownOpen]);

  // Observa a seção visível (para sublinhar item ativo)
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds: SectionKey[] = [
        "hero",
        "pacientes",
        "medicos",
        "consultas",
        "internacoes",
        "relatorios",
      ];
      let current: SectionKey = "hero";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goTo = (key: SectionKey) => {
    // Tenta rolar para a seção; se não existir, navega para rota correspondente
    const section = document.getElementById(key);
    if (section) {
      const nav = document.querySelector("nav");
      const navHeight = nav ? (nav as HTMLElement).offsetHeight : 0;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      const path = SECTIONS.find((s) => s.key === key)?.path;
      if (path) router.push(path);
    }
    setIsMobileDropdownOpen(false);
    setActiveSection(key);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md py-2 px-4 shadow-sm">
      <div className="flex items-center w-full max-w-7xl mx-auto">
        {/* Menu (single source) - renders as dropdown on mobile and inline on md+ */}
        <div className="relative md:hidden">
          {/* Hamburger (visible on mobile) */}
          <button
            ref={menuButtonRef}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setIsMobileDropdownOpen((open) => !open)}
            className="p-2 rounded-lg hover:bg-gray-200/70 transition-all duration-300 relative z-50"
            aria-label="Abrir menu"
            aria-expanded={isMobileDropdownOpen}
            aria-controls="navbar-menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              strokeWidth={2}
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo / título */}
        <button
          onClick={() => goTo("hero")}
          className="text-lg sm:text-xl font-semibold text-blue-700 mx-auto"
        >
          🏥 Hospital Service
        </button>

        {/* Desktop menu */}
        <div className="hidden md:block md:ml-auto">
          <div className="flex items-center gap-6">
            {SECTIONS.map((item) => (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                className={`text-base font-medium text-gray-800 cursor-pointer transition-colors duration-300 px-2 py-1 rounded focus:outline-none ${
                  activeSection === item.key
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "hover:text-blue-700 border-transparent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile menu container */}
        <div className="md:hidden">
          <div
            id="navbar-menu"
            ref={mobileDropdownRef}
            role="menu"
            aria-hidden={!isMobileDropdownOpen}
            className={`fixed top-14 left-4 w-60 bg-white rounded-xl shadow-2xl py-4 px-4 z-40 flex flex-col gap-2 transform transition-all duration-200 ease-out md:relative md:top-0 md:left-0 md:mt-0 md:w-auto md:bg-transparent md:shadow-none md:flex-row md:items-center md:gap-6 md:px-0 md:py-0 ${
              isMobileDropdownOpen
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto md:opacity-100 md:translate-y-0 md:scale-100 md:pointer-events-auto"
                : "opacity-0 -translate-y-1 scale-95 pointer-events-none md:opacity-100 md:translate-y-0 md:scale-100 md:pointer-events-auto"
            }`}
          >
            {SECTIONS.map((item) => (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                className={`w-full text-left text-base font-medium text-gray-800 cursor-pointer transition-colors duration-300 px-2 py-2 rounded md:w-auto md:text-base md:px-2 md:py-1 md:focus:outline-none ${
                  activeSection === item.key
                    ? "text-blue-700 md:border-b-2 md:border-blue-700"
                    : "hover:text-blue-700 md:border-transparent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
