import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let business = null;
  try {
    business = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });
  } catch (e) {
    // DB not ready yet
  }

  const name = business?.name || "Circus Tours";
  const description =
    business?.description ||
    "Salimos desde Córdoba y Villa María a los recitales más grandes del país, en cama o semicama, con cena previa y coordinación todo el viaje.";

  return {
    title: {
      default: `${name} | Traslados y Viajes a Eventos`,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      title: `${name} · Traslados de pasajeros a recitales y eventos`,
      description,
      siteName: name,
      locale: "es_AR",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let business = null;
  try {
    business = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });
  } catch (e) {
    // fallback
  }

  const primaryColor = business?.primaryColor || "#a83832";

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root { --tenant-primary: ${primaryColor}; }` }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-white text-slate-900">
        <Navbar
          businessName={business?.name || "Circus Tours"}
          logoUrl={business?.logoUrl}
          primaryColor={primaryColor}
        />
        <main className="flex-1">{children}</main>
        <Footer
          businessName={business?.name || "Circus Tours"}
          tagline={business?.tagline}
          description={business?.description}
          logoUrl={business?.logoUrl}
          addressCity={business?.addressCity}
          mapsUrl={business?.mapsUrl}
        />
        <FloatingButtons
          whatsapp={business?.whatsapp}
          instagram={business?.instagram}
        />
      </body>
    </html>
  );
}
