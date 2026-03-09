import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SalonSettingsForm } from "./settings-form";
import { ImageUpload } from "@/components/dashboard/image-upload";

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

      <div className="mt-6 space-y-6">
        <div>
          <h2 className="text-sm font-medium text-neutral-700 mb-2">Imagine salon</h2>
          <ImageUpload target="salon" targetId={salon.id} currentImage={salon.image} />
        </div>
        <SalonSettingsForm salon={salon} />
      </div>
    </div>
  );
}
