import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      imageUrl,
      categoryTag,
      type,
      date,
      departureTime,
      departureLocation,
      venue,
      city,
      destinationCity,
      price,
      depositPrice,
      totalCapacity,
      isFeatured,
      isActive,
      busType,
      includes,
      itinerary,
      pickupPoints,
    } = body;

    if (!title || !description || !imageUrl || !price || !date) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para el evento" },
        { status: 400 }
      );
    }

    let slug = body.slug ? slugify(body.slug) : slugify(title);
    let existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const event = await prisma.event.create({
      data: {
        slug,
        title,
        subtitle: subtitle || null,
        description,
        imageUrl,
        categoryTag: categoryTag || "Recitales",
        type: type || "EVENTO",
        date: new Date(date),
        departureTime: departureTime || "17:30",
        departureLocation: departureLocation || "Terminal de Córdoba",
        venue: venue || null,
        city: city || "Córdoba",
        destinationCity: destinationCity || "Buenos Aires",
        price: Number(price),
        depositPrice: depositPrice ? Number(depositPrice) : null,
        totalCapacity: Number(totalCapacity) || 50,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        busType: busType || "Cama / Semicama",
        includes: typeof includes === "string" ? includes : JSON.stringify(includes || []),
        itinerary: itinerary || null,
        pickupPoints: {
          create: (pickupPoints || []).map((p: any, idx: number) => ({
            name: p.name,
            address: p.address || null,
            time: p.time || "17:30",
            extraPrice: Number(p.extraPrice) || 0,
            order: idx + 1,
          })),
        },
      },
    });

    return NextResponse.json(event);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al crear evento";
    console.error("Create event error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

