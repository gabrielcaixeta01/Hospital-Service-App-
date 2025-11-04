"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    // Basic client-side validation to match backend rules and provide quicker feedback
    const pw = formData.password ?? "";
    const validationErrors: string[] = [];
    if (typeof pw !== "string") validationErrors.push("A senha deve ser uma string.");
    if (pw.length < 8) validationErrors.push("A senha deve ter pelo menos 8 caracteres.");
    if (!/[a-z]/.test(pw)) validationErrors.push("A senha deve conter pelo menos uma letra minúscula.");
    if (!/[A-Z]/.test(pw)) validationErrors.push("A senha deve conter pelo menos uma letra maiúscula.");
    if (!/\d/.test(pw)) validationErrors.push("A senha deve conter pelo menos um número.");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) validationErrors.push("A senha deve conter pelo menos um caractere especial.");

    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const url = API_URL ? `${API_URL.replace(/\/+$/, "")}/auth/register` : "/api/auth/register";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        // Try to parse JSON error payload (some backends return { message: [..] })
        let bodyText = "Erro ao criar conta";
        try {
          const json = await response.json();
          if (Array.isArray(json?.message)) {
            bodyText = json.message.join(" ");
          } else if (typeof json?.message === "string") {
            bodyText = json.message;
          } else if (json) {
            bodyText = JSON.stringify(json);
          }
        } catch {
          bodyText = await response.text().catch(() => bodyText);
        }
        throw new Error(bodyText || "Erro ao criar conta");
      }

      // If registration succeeds redirect to login with flag
      router.push("/login?registered=true");
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Erro ao criar conta. Por favor, tente novamente.");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            🏥 Hospital Service
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
            Crie sua conta
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nome" className="sr-only">
                Nome completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirme a senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirme a senha"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              ) : null}
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
