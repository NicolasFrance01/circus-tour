import { prisma } from "@/lib/prisma";
import ReservasClient from "./ReservasClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestionar Reservas & Pasajes | Circus Admin",
};

export default async function AdminReservasPage() {
  const [reservations, events] = await Promise.all([
    prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            price: true,
          },
        },
        pickupPoint: true,
      },
    }),
    prisma.event.findMany({
      select: { id: true, title: true },
      orderBy: { date: "asc" },
    }),
  ]);

  // Convert Decimals to string/number for serialization
  const serialized = reservations.map((r) => ({
    ...r,
    totalPrice: Number(r.totalPrice.toString()),
    paidAmount: Number(r.paidAmount.toString()),
    createdAt: r.createdAt.toISOString(),
    event: {
      ...r.event,
      date: r.event.date.toISOString(),
      price: Number(r.event.price.toString()),
    },
    pickupPoint: r.pickupPoint
      ? {
          ...r.pickupPoint,
          extraPrice: Number(r.pickupPoint.extraPrice.toString()),
        }
      : null,
  }));

  return <ReservasClient initialReservations={serialized} events={events} />;
}
