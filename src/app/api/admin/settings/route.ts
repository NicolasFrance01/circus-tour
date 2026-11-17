import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json(settings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener configuración";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      tagline,
      description,
      logoUrl,
      heroImage,
      heroTitle,
      heroSubtitle,
      phone,
      whatsapp,
      instagram,
      addressCity,
      mapsUrl,
      primaryColor,
      bankAlias,
      bankCbu,
      bankHolder,
    } = body;

    const updated = await prisma.businessSettings.upsert({
      where: { id: "default" },
      update: {
        name,
        tagline,
        description,
        logoUrl,
        heroImage,
        heroTitle,
        heroSubtitle,
        phone,
        whatsapp,
        instagram,
        addressCity,
        mapsUrl,
        primaryColor,
        bankAlias,
        bankCbu,
        bankHolder,
      },
      create: {
        id: "default",
        name: name || "Circus Tours",
        tagline,
        description,
        logoUrl,
        heroImage,
        heroTitle,
        heroSubtitle,
        phone,
        whatsapp,
        instagram,
        addressCity,
        mapsUrl,
        primaryColor: primaryColor || "#a83832",
        bankAlias,
        bankCbu,
        bankHolder,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al guardar configuración";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

