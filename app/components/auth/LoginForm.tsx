"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "No se pudo iniciar sesión");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md p-8 sm:p-10 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-800 transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-1 transform transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
      </div>

      <div className="text-center mt-6">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
            <Image
              src="/images/logo.png"
              alt="Sistema Integral Logo"
              width={56}
              height={56}
              className="rounded-xl object-contain"
            />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Bienvenido
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Ingresa tus credenciales para acceder
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Contraseña
            </label>
            <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <input
            id="password"
            type="password"
            required
            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 mt-2 text-white font-medium bg-gray-900 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-900/20 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}