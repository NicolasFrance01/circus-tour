"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Compass, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@circustours.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white">
      {/* Left Visual Panel - Dark Branding */}
      <aside className="hidden lg:flex lg:col-span-5 surface-premium relative p-12 flex-col justify-between overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#1a2333] -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        {/* Brand */}
        <NextLink href="/" className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-lg">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Circus Tours
          </span>
        </NextLink>

        {/* Visual Copy */}
        <div className="space-y-4 z-10 max-w-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Panel Administrativo
          </span>
          <h2 className="text-3xl font-black tracking-tight leading-snug">
            El cerebro operativo de tu agencia.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Gestioná eventos, salidas de turismo, pasajes con código QR, reservas de clientes y la configuración que se refleja en la web en tiempo real.
          </p>
        </div>

        {/* Footer Note */}
        <div className="z-10 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Circus Tours · Acceso privado</span>
        </div>
      </aside>

      {/* Right Main Panel - Form */}
      <main className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <NextLink
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-block mb-2"
            >
              ← Volver al sitio web
            </NextLink>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Ingreso del equipo
            </h1>
            <p className="text-sm text-slate-500">
              Ingresá tus credenciales autorizadas para administrar el sistema.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@circustours.com"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>

            {/* Demo Hint */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Credenciales iniciales:</p>
              <p>
                Email: <span className="font-mono text-primary-ink font-semibold">admin@circustours.com</span>
              </p>
              <p>
                Contraseña: <span className="font-mono text-primary-ink font-semibold">admin123</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 transition-all shadow-md hover-lift flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verificando sesión...</span>
              ) : (
                <>
                  <span>Ingresar al Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

