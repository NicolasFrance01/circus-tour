"use client";

import { useState } from "react";
import Link from "next/navigation";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Compass } from "lucide-react";

interface NavbarProps {
  businessName?: string | null;
  logoUrl?: string | null;
  primaryColor?: string;
}

export default function Navbar({
  businessName = "Circus Tours",
  logoUrl,
  primaryColor = "#a83832",
}: NavbarProps) {
  const displayBusinessName = businessName || "Circus Tours";
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/eventos", label: "Eventos" },
    { href: "/turismo", label: "Turismo" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="tr-capsula mx-auto max-w-6xl rounded-2xl md:rounded-full px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <NextLink href="/" className="flex items-center gap-2 shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={displayBusinessName}
                className="h-9 md:h-11 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Compass className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  {displayBusinessName}
                </span>
              </div>
            )}
          </NextLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/70"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  {link.label}
                </NextLink>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <NextLink
              href="/eventos"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white shadow-sm hover:shadow-md hover-lift transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Reservar viaje</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-slate-100 mt-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-slate-100 text-primary-ink"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </NextLink>
              );
            })}
            <div className="pt-2">
              <NextLink
                href="/eventos"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Reservar viaje</span>
                <ArrowRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

