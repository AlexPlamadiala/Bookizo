import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SalonSettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await auth();
  const salonId = session?.user?.salonId;

  if (!salonId) return <p>Nu ai salon asociat.</p>;

  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
  });

  if (!salon) return <p>Salonul nu a fost găsit.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Setări salon</h1>
      <p className="mt-1 text-neutral-500">Editează informațiile salonului tău.</p>

      <div className="mt-6">
        <SalonSettingsForm salon={salon} />
      </div>
    </div>
  );
}
