"use client";

import { useState } from "react";
import NextLink from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Phone,
  QrCode,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";

interface ReservationItem {
  id: string;
  ticketCode: string;
  customerName: string;
  customerDni: string;
  customerEmail: string;
  customerPhone: string;
  seatsCount: number;
  seatType: string;
  assignedSeats: string | null;
  totalPrice: number;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  notes: string | null;
  createdAt: string;
  event: {
    id: string;
    title: string;
    date: string;
    price: number;
  };
  pickupPoint: {
    id: string;
    name: string;
    time: string;
  } | null;
}

export default function ReservasClient({
  initialReservations,
  events,
}: {
  initialReservations: ReservationItem[];
  events: { id: string; title: string }[];
}) {
  const [reservations, setReservations] = useState<ReservationItem[]>(initialReservations);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterEvent, setFilterEvent] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      r.customerDni.includes(search) ||
      r.customerPhone.includes(search);

    const matchesStatus =
      filterStatus === "ALL" ? true : r.paymentStatus === filterStatus;

    const matchesEvent =
      filterEvent === "ALL" ? true : r.event.id === filterEvent;

    return matchesSearch && matchesStatus && matchesEvent;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      setReservations(
        reservations.map((r) =>
          r.id === id ? { ...r, paymentStatus: newStatus } : r
        )
      );
    } catch (e: any) {
      alert(e.message || "Error al actualizar estado");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSeatAssignment = async (id: string) => {
    const current = reservations.find((r) => r.id === id)?.assignedSeats || "";
    const newSeats = prompt("Ingresá los números de butaca asignados (ej: 14, 15):", current);
    if (newSeats === null) return;

    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedSeats: newSeats }),
      });

      if (!res.ok) throw new Error("Error al asignar butacas");

      setReservations(
        reservations.map((r) =>
          r.id === id ? { ...r, assignedSeats: newSeats } : r
        )
      );
    } catch (e: any) {
      alert(e.message || "Error");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`¿Eliminar la reserva ${code}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setReservations(reservations.filter((r) => r.id !== id));
    } catch (e: any) {
      alert(e.message || "Error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Gestión de Reservas & Pasajes QR
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Controlá pagos, asignación de butacas y visualizá los pasajes con código QR emitidos.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por pasajero, DNI, teléfono o código CT-..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="ALL">Todos los estados de pago</option>
            <option value="PAGADO">Solo PAGADOS</option>
            <option value="PENDIENTE">Solo PENDIENTES</option>
            <option value="PARCIAL">Solo PARCIALES</option>
            <option value="CANCELADO">CANCELADOS</option>
          </select>
        </div>

        {/* Event Filter */}
        <div className="sm:col-span-4">
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="ALL">Todas las salidas</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Código</th>
                  <th className="py-3.5 px-4">Titular & Contacto</th>
                  <th className="py-3.5 px-4">Evento / Salida</th>
                  <th className="py-3.5 px-4">Punto & Butacas</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Estado Pago</th>
                  <th className="py-3.5 px-4 text-right">Pasaje QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-primary">
                      {res.ticketCode}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-extrabold text-sm text-slate-900">
                        {res.customerName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        DNI: {res.customerDni} · {res.customerEmail}
                      </p>
                      <a
                        href={`https://wa.me/${res.customerPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>+{res.customerPhone}</span>
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 max-w-xs truncate">
                        {res.event.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatDate(res.event.date, { day: "numeric", month: "short" })}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-800">
                        {res.seatsCount}x {res.seatType}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <span>Butacas:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {res.assignedSeats || "Sin asignar"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSeatAssignment(res.id)}
                          className="p-1 text-slate-400 hover:text-slate-800"
                          title="Asignar asientos"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-primary truncate max-w-[140px]">
                        {res.pickupPoint?.name || "Punto central"}
                      </p>
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900">
                      {formatPrice(res.totalPrice)}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Vía {res.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={res.paymentStatus}
                        disabled={updatingId === res.id}
                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold border focus:outline-none ${
                          res.paymentStatus === "PAGADO"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : res.paymentStatus === "PARCIAL"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="PARCIAL">SEÑA / PARCIAL</option>
                        <option value="PAGADO">PAGADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <NextLink
                          href={`/pasaje/${res.ticketCode}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Ver Pasaje</span>
                        </NextLink>

                        <button
                          type="button"
                          onClick={() => handleDelete(res.id, res.ticketCode)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                          title="Eliminar reserva"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">
            No se encontraron reservas con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
}
