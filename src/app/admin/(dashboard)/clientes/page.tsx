import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Users, Phone, Mail, Ticket } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Directorio de Clientes | Circus Admin",
};

export default async function AdminClientesPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      customerName: true,
      customerDni: true,
      customerEmail: true,
      customerPhone: true,
      seatsCount: true,
      totalPrice: true,
      createdAt: true,
    },
  });

  // Aggregate by DNI / Email
  const clientsMap = new Map<string, any>();
  for (const r of reservations) {
    const key = r.customerDni || r.customerEmail;
    if (!clientsMap.has(key)) {
      clientsMap.set(key, {
        name: r.customerName,
        dni: r.customerDni,
        email: r.customerEmail,
        phone: r.customerPhone,
        totalReservations: 1,
        totalSeats: r.seatsCount,
        totalSpent: Number(r.totalPrice.toString()),
        lastTrip: r.createdAt,
      });
    } else {
      const existing = clientsMap.get(key);
      existing.totalReservations += 1;
      existing.totalSeats += r.seatsCount;
      existing.totalSpent += Number(r.totalPrice.toString());
      if (r.createdAt > existing.lastTrip) {
        existing.lastTrip = r.createdAt;
      }
    }
  }

  const clients = Array.from(clientsMap.values());

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Directorio de Pasajeros & Clientes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Historial de clientes registrados, frecuencia de viaje y datos de contacto.
        </p>
      </div>

      {clients.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Cliente / Pasajero</th>
                  <th className="py-3.5 px-4">DNI</th>
                  <th className="py-3.5 px-4">WhatsApp / Teléfono</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Viajes Realizados</th>
                  <th className="py-3.5 px-4">Total Invertido</th>
                  <th className="py-3.5 px-4">Última Reserva</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                      {c.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600">
                      {c.dni}
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>+{c.phone}</span>
                      </a>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {c.email}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">
                      {c.totalReservations} reserva(s) ({c.totalSeats} pasajes)
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(c.lastTrip, { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No hay clientes registrados aún.</p>
        </div>
      )}
    </div>
  );
}
