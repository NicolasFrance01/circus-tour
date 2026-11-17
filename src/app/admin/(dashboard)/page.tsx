import { prisma } from "@/lib/prisma";
import NextLink from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Calendar,
  Ticket,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Administrativo | Circus Tours",
};

export default async function AdminDashboardPage() {
  const [
    eventsCount,
    reservationsCount,
    activeEvents,
    recentReservations,
    allReservations,
  ] = await Promise.all([
    prisma.event.count({ where: { type: "EVENTO" } }),
    prisma.reservation.count(),
    prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
      take: 5,
    }),
    prisma.reservation.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          select: { title: true, date: true },
        },
      },
    }),
    prisma.reservation.findMany({
      select: { totalPrice: true, seatsCount: true, paymentStatus: true },
    }),
  ]);

  const totalRevenue = allReservations.reduce(
    (acc, curr) => acc + Number(curr.totalPrice.toString()),
    0
  );

  const totalPassengers = allReservations.reduce(
    (acc, curr) => acc + curr.seatsCount,
    0
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Panel de Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Resumen General de Operaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisá salidas programadas, pasajes emitidos y recaudación en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NextLink
            href="/admin/eventos/nuevo"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-sm inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Evento</span>
          </NextLink>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reservas Totales
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {reservationsCount}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pasajeros a Bordo
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalPassengers}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Eventos Activos
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activeEvents.length}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recaudación Bruta
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Grid: Recent Reservations & Upcoming events */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recent Reservations (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Últimas Reservas</h2>
            <NextLink
              href="/admin/reservas"
              className="text-xs font-bold text-primary hover:underline"
            >
              Ver todas →
            </NextLink>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Pasajero</th>
                    <th className="py-3 px-4">Salida</th>
                    <th className="py-3 px-4">Asientos</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Pago</th>
                    <th className="py-3 px-4 text-right">Pasaje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {res.ticketCode}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {res.customerName}
                        <span className="block text-[11px] text-slate-400">
                          {res.customerPhone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                        {res.event.title}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {res.seatsCount} ({res.seatType})
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatPrice(res.totalPrice)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            res.paymentStatus === "PAGADO"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {res.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <NextLink
                          href={`/pasaje/${res.ticketCode}`}
                          target="_blank"
                          className="font-bold text-primary hover:underline"
                        >
                          Ver QR
                        </NextLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Active Events (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Próximas Salidas</h2>
            <NextLink
              href="/admin/eventos"
              className="text-xs font-bold text-primary hover:underline"
            >
              Gestionar →
            </NextLink>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 divide-y divide-slate-100">
            {activeEvents.map((evt) => (
              <div key={evt.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900 truncate max-w-[180px]">
                    {evt.title}
                  </span>
                  <span className="font-bold text-primary-ink">
                    {formatPrice(evt.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{formatDate(evt.date, { day: "numeric", month: "short" })}</span>
                  <span>Capacidad: {evt.totalCapacity} butacas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
