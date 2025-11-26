"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Conta criada com sucesso! Faça login para continuar.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const url = API_URL
        ? `${API_URL.replace(/\/+$/, "")}/auth/login`
        : "/api/auth/login";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Credenciais inválidas");
        } else {
          const text = await response.text();
          setError(text || "Erro ao autenticar");
        }
        return;
      }

      const data = await response.json();
      if (data.access_token) localStorage.setItem("token", data.access_token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erro ao autenticar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center relative 
        bg-gradient-to-br from-slate-100 to-slate-200
        px-4 py-12
      "
    >
      {/* Imagem de fundo suave */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('/bg-medico.jpg')`,
        }}
      />

      {/* CARD */}
      <div
        className="
          relative z-10 w-full max-w-md
          bg-white/75 backdrop-blur-xl 
          rounded-xl shadow-lg p-8
          animate-[fadeIn_.5s_ease]
        "
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-700 flex items-center justify-center gap-2">
            HospCare
          </h1>
          <h2 className="mt-1 text-lg font-light text-slate-700">
            Gestão Hospitalar Integrada
          </h2>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="text-sm text-slate-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="
                  mt-1 w-full px-3 py-2 rounded-md 
                  border border-slate-300 bg-white/80
                  placeholder-slate-400 text-gray-900
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                  transition-all
                "
                placeholder="exemplo@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-slate-600">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="
                  mt-1 w-full px-3 py-2 rounded-md 
                  border border-slate-300 bg-white/80
                  placeholder-slate-400 text-gray-900
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                  transition-all
                "
                placeholder="••••••••"
              />
            </div>
          </div>

          {successMessage && (
            <p className="text-green-600 text-sm text-center">{successMessage}</p>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 rounded-md
              bg-blue-600 text-white text-sm
              hover:bg-blue-700 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* LINKS */}
        <div className="flex flex-col space-y-2 text-sm text-center mt-6">
          <Link
            href="/registro"
            className="text-blue-600 hover:text-blue-500"
          >
            Criar uma nova conta
          </Link>
          <a href="#" className="text-blue-600 hover:text-blue-500">
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </div>
  );
}