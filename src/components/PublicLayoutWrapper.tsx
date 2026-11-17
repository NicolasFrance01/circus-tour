"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
  businessName?: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  addressCity?: string | null;
  mapsUrl?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  primaryColor?: string;
}

export default function PublicLayoutWrapper({
  children,
  businessName = "Circus Tours",
  tagline,
  description,
  logoUrl,
  addressCity,
  mapsUrl,
  whatsapp,
  instagram,
  primaryColor = "#a83832",
}: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex-1 flex flex-col min-h-screen">{children}</div>;
  }

  return (
    <>
      <Navbar
        businessName={businessName}
        logoUrl={logoUrl}
        primaryColor={primaryColor}
      />
      <main className="flex-1">{children}</main>
      <Footer
        businessName={businessName}
        tagline={tagline}
        description={description}
        logoUrl={logoUrl}
        addressCity={addressCity}
        mapsUrl={mapsUrl}
      />
      <FloatingButtons
        whatsapp={whatsapp}
        instagram={instagram}
      />
    </>
  );
}

