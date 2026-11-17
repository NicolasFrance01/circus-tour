import { prisma } from "@/lib/prisma";
import NextLink from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Calendar, MapPin, Eye } from "lucide-react";
import EventDeleteButton from "./EventDeleteButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestionar Eventos | Circus Admin",
};

export default async function AdminEventosPage() {
  const events = await prisma.event.findMany({
    where: { type: "EVENTO" },
    orderBy: { date: "desc" },
    include: {
      _count: {
        select: { reservations: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Eventos & Recitales
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administrá las salidas a shows y conciertos que se publican para los clientes.
          </p>
        </div>

        <NextLink
          href="/admin/eventos/nuevo"
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-sm inline-flex items-center gap-2 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Evento</span>
        </NextLink>
      </div>

      {events.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Salida</th>
                  <th className="py-3.5 px-4">Fecha & Salida</th>
                  <th className="py-3.5 px-4">Precio</th>
                  <th className="py-3.5 px-4">Capacidad</th>
                  <th className="py-3.5 px-4">Reservas</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.imageUrl}
                          alt={evt.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-sm">{evt.title}</p>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {evt.categoryTag} · {evt.destinationCity}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <p className="font-semibold text-slate-800">
                        {formatDate(evt.date, { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-[11px] text-slate-400">Salida: {evt.departureTime} hs</p>
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900">
                      {formatPrice(evt.price)}
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-semibold">
                      {evt.totalCapacity} lugares
                    </td>
                    <td className="py-4 px-4 font-bold text-primary">
                      {evt._count.reservations} reservas
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          evt.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {evt.isActive ? "Activo" : "Pausado"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <NextLink
                          href={`/eventos/${evt.slug}`}
                          target="_blank"
                          title="Ver en la web pública"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </NextLink>

                        <NextLink
                          href={`/admin/eventos/${evt.id}/editar`}
                          title="Editar evento"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </NextLink>

                        <EventDeleteButton eventId={evt.id} eventTitle={evt.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
          <p className="text-slate-600 text-sm font-medium">No hay eventos creados todavía.</p>
          <NextLink
            href="/admin/eventos/nuevo"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Crear primer evento</span>
          </NextLink>
        </div>
      )}
    </div>
  );
}
