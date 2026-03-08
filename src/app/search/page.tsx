import { prisma } from "@/lib/prisma";
import { AvailabilitySearch } from "@/components/booking/availability-search";

async function getFilters() {
  const [services, cities] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      select: { name: true },
      distinct: ["name"],
      orderBy: { name: "asc" },
    }),
    prisma.salon.findMany({
      where: { isActive: true },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
  ]);

  return {
    serviceNames: services.map((s) => s.name),
    cities: cities.map((c) => c.city),
  };
}

export default async function SearchPage() {
  const { serviceNames, cities } = await getFilters();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          Găsește disponibilitate
        </h1>
        <p className="mt-1 text-neutral-500">
          Alege ce serviciu dorești și când ești disponibil. Îți arătăm ce saloane au loc.
        </p>
      </div>
      <AvailabilitySearch serviceNames={serviceNames} cities={cities} />
    </div>
  );
}
