import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { pickupPoints: { orderBy: { order: "asc" } } },
    });

    if (!event) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener evento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
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

    // Delete existing pickup points and recreate
    if (pickupPoints) {
      await prisma.pickupPoint.deleteMany({
        where: { eventId: id },
      });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        subtitle: subtitle || null,
        description,
        imageUrl,
        categoryTag: categoryTag || "Recitales",
        type: type || "EVENTO",
        date: date ? new Date(date) : undefined,
        departureTime,
        departureLocation,
        venue: venue || null,
        city: city || "Córdoba",
        destinationCity: destinationCity || "Buenos Aires",
        price: price ? Number(price) : undefined,
        depositPrice: depositPrice !== undefined ? (depositPrice ? Number(depositPrice) : null) : undefined,
        totalCapacity: totalCapacity ? Number(totalCapacity) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        busType,
        includes: typeof includes === "string" ? includes : JSON.stringify(includes || []),
        itinerary: itinerary || null,
        pickupPoints: pickupPoints
          ? {
              create: pickupPoints.map((p: any, idx: number) => ({
                name: p.name,
                address: p.address || null,
                time: p.time || "17:30",
                extraPrice: Number(p.extraPrice) || 0,
                order: idx + 1,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al actualizar evento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Check if there are reservations
    const reservationsCount = await prisma.reservation.count({
      where: { eventId: id },
    });

    if (reservationsCount > 0) {
      // Instead of hard deleting with reservations, deactivate it
      await prisma.event.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        message: "El evento tenía reservas activas, por seguridad fue desactivado.",
      });
    }

    await prisma.pickupPoint.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al eliminar evento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

