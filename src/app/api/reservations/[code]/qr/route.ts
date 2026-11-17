import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const reservation = await prisma.reservation.findUnique({
      where: { ticketCode: code },
      include: {
        event: true,
        pickupPoint: true,
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const ticketUrl = `${protocol}://${host}/pasaje/${reservation.ticketCode}`;

    // Generate QR as SVG / PNG buffer
    const qrDataUrl = await QRCode.toDataURL(ticketUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#a83832",
        light: "#ffffff",
      },
    });

    return NextResponse.json({
      ticketCode: reservation.ticketCode,
      ticketUrl,
      qrDataUrl,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al generar código QR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

