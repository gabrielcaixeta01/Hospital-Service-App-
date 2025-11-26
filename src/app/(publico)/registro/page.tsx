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

    // Validação robusta da senha
    const rawPw = (formData as { password?: unknown }).password;
    const pw = rawPw == null ? "" : String(rawPw);
    const validationErrors: string[] = [];

    if (pw.length < 8) validationErrors.push("A senha deve ter pelo menos 8 caracteres.");
    if (!/[a-z]/.test(pw)) validationErrors.push("A senha deve conter pelo menos uma letra minúscula.");
    if (!/[A-Z]/.test(pw)) validationErrors.push("A senha deve conter pelo menos uma letra maiúscula.");
    if (!/\d/.test(pw)) validationErrors.push("A senha deve conter pelo menos um número.");
    if (!/[^A-Za-z0-9]/.test(pw)) validationErrors.push("A senha deve conter pelo menos um caractere especial.");

    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const url = API_URL
        ? `${API_URL.replace(/\/+$/, "")}/auth/register`
        : "/api/auth/register";

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
        let bodyText = "Erro ao criar conta";
        try {
          const json = await response.json();
          if (Array.isArray(json?.message)) bodyText = json.message.join(" ");
          else if (typeof json?.message === "string") bodyText = json.message;
          else if (json) bodyText = JSON.stringify(json);
        } catch {
          bodyText = await response.text().catch(() => bodyText);
        }
        throw new Error(bodyText || "Erro ao criar conta");
      }

      router.push("/login?registered=true");
    } catch (err) {
      console.error(err);
      setError(
        (err as Error).message || "Erro ao criar conta. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-slate-100 to-slate-200
        relative px-4 py-12
      "
    >
      {/* Fundo com imagem suave */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/bg-medico.jpg')` }}
      />

      {/* Card */}
      <div
        className="
          relative z-10 w-full max-w-md
          bg-white/75 backdrop-blur-xl 
          rounded-xl shadow-lg p-8
          animate-[fadeIn_.5s_ease]
        "
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-700 flex items-center justify-center gap-2">
            HospCare
          </h1>
          <h2 className="mt-1 text-lg font-light text-slate-700">
            Crie sua conta
          </h2>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Campos */}
          <div className="space-y-3">
            <div>
              <label htmlFor="nome" className="text-sm text-slate-600">
                Nome completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                className="
                  mt-1 w-full px-3 py-2 rounded-md 
                  border border-slate-300 bg-white/80
                  placeholder-slate-400
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                "
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm text-slate-600">
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
                className="
                  mt-1 w-full px-3 py-2 rounded-md 
                  border border-slate-300 bg-white/80
                  placeholder-slate-400
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                "
                placeholder="email@exemplo.com"
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
                  placeholder-slate-400
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                "
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm text-slate-600">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="
                  mt-1 w-full px-3 py-2 rounded-md 
                  border border-slate-300 bg-white/80
                  placeholder-slate-400
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                "
                placeholder="Repita a senha"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Botão */}
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        {/* Link login */}
        <div className="text-sm text-center mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}