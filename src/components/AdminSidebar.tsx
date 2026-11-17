"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Compass,
  Ticket,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/eventos", label: "Eventos & Recitales", icon: Calendar },
    { href: "/admin/turismo", label: "Turismo & Salidas", icon: Compass },
    { href: "/admin/reservas", label: "Reservas & Pasajes", icon: Ticket },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/configuracion", label: "Configuración Sitio", icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 min-h-screen">
      {/* Top brand */}
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <NextLink href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                Circus Admin
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                Panel de Gestión
              </span>
            </div>
          </NextLink>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40">
          <p className="text-xs font-bold text-white truncate">{user.name}</p>
          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400 mt-1">
            <ShieldCheck className="w-3 h-3" />
            {user.role}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <NextLink
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NextLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <NextLink
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>Ver sitio público</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </NextLink>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

