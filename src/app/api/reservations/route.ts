import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTicketCode } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      pickupPointId,
      seatsCount,
      seatType,
      customerName,
      customerDni,
      customerEmail,
      customerPhone,
      notes,
      paymentMethod,
      totalPrice,
    } = body;

    if (!eventId || !customerName || !customerDni || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para la reserva" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "El evento no existe" }, { status: 404 });
    }

    // Generate unique ticket code
    let ticketCode = generateTicketCode();
    let codeExists = await prisma.reservation.findUnique({ where: { ticketCode } });
    while (codeExists) {
      ticketCode = generateTicketCode();
      codeExists = await prisma.reservation.findUnique({ where: { ticketCode } });
    }

    const reservation = await prisma.reservation.create({
      data: {
        ticketCode,
        eventId,
        pickupPointId: pickupPointId || null,
        customerName,
        customerDni,
        customerEmail,
        customerPhone,
        seatsCount: Number(seatsCount) || 1,
        seatType: seatType || "Semicama",
        totalPrice: Number(totalPrice),
        paymentMethod: paymentMethod || "TRANSFERENCIA",
        paymentStatus: "PENDIENTE",
        status: "ACTIVA",
        notes: notes || null,
      },
      include: {
        event: true,
        pickupPoint: true,
      },
    });

    return NextResponse.json({
      success: true,
      reservationId: reservation.id,
      ticketCode: reservation.ticketCode,
      customerName: reservation.customerName,
      seatsCount: reservation.seatsCount,
      totalPrice: reservation.totalPrice,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al crear la reserva";
    console.error("Reservation creation error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");

    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (status) where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        event: {
          select: {
            title: true,
            date: true,
            imageUrl: true,
          },
        },
        pickupPoint: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener reservas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
