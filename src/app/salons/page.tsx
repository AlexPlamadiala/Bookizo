import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Clock, Scissors } from "lucide-react";

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Hair Salon",
  BEAUTY_SALON: "Beauty Salon",
  UNISEX: "Unisex",
};

async function getSalons(search?: string) {
  return prisma.salon.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { city: { contains: search, mode: "insensitive" as const } },
              { address: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: { specialists: true, services: true },
    orderBy: { rating: "desc" },
  });
}

export default async function SalonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const salons = await getSalons(params.q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Saloane</h1>
        <p className="mt-1 text-neutral-500">
          Găsește salonul perfect și programează-te online.
        </p>
      </div>

      {/* Search */}
      <form className="mb-8" action="/salons" method="GET">
        <div className="relative max-w-lg">
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Caută după nume, oraș sau adresă..."
            className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-neutral-900 p-2 text-white hover:bg-neutral-800"
          >
            <Scissors className="h-4 w-4" />
          </button>
        </div>
      </form>

      {salons.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((salon) => (
            <Link key={salon.id} href={`/salons/${salon.slug}`}>
              <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md h-full">
                <div className="aspect-[16/10] bg-gradient-to-br from-neutral-200 to-neutral-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scissors className="h-12 w-12 text-neutral-300 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur">
                      {salonTypeLabels[salon.type]}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700">
                    {salon.name}
                  </h3>
                  {salon.description && (
                    <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                      {salon.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1 text-sm text-neutral-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {salon.address}, {salon.city}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{salon.rating.toFixed(1)}</span>
                      <span className="text-xs text-neutral-400">({salon.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {salon.specialists.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {salon.services.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <Scissors className="mx-auto h-12 w-12 text-neutral-300" />
          <h3 className="mt-4 text-lg font-medium text-neutral-900">Niciun salon găsit</h3>
          <p className="mt-1 text-sm text-neutral-500">
            {params.q ? "Încearcă o altă căutare." : "Nu sunt saloane disponibile momentan."}
          </p>
        </div>
      )}
    </div>
  );
}
