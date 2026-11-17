import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Configuración del Sitio | Circus Admin",
};

export default async function AdminConfiguracionPage() {
  const settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Configuración de la Agencia
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Todos los cambios que guardes aquí se reflejan de inmediato en la web pública para tus clientes.
        </p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  );
}
