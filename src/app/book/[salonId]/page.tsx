import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/components/booking/booking-wizard";

async function getSalonData(salonId: string) {
  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
    include: {
      specialists: {
        where: { isActive: true },
        include: {
          services: true,
          workingHours: true,
        },
      },
      services: { where: { isActive: true } },
    },
  });
  return salon;
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ salonId: string }>;
  searchParams: Promise<{ specialist?: string; service?: string }>;
}) {
  const { salonId } = await params;
  const search = await searchParams;
  const salon = await getSalonData(salonId);

  if (!salon) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Programare la {salon.name}
        </h1>
        <p className="mt-1 text-neutral-500">
          Alege specialistul, serviciul și data dorită.
        </p>
      </div>
      <BookingWizard
        salon={salon}
        specialists={salon.specialists}
        services={salon.services}
        preselectedSpecialist={search.specialist}
        preselectedService={search.service}
      />
    </div>
  );
}
