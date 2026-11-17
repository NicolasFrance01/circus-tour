import EventForm from "@/components/EventForm";

export const metadata = {
  title: "Nuevo Evento | Circus Admin",
};

export default function NuevoEventoPage() {
  return <EventForm isEditing={false} />;
}
