import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Clock, Scissors, Search } from "lucide-react";

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Salon coafură",
  BEAUTY_SALON: "Salon beauty",
  UNISEX: "Unisex",
};

async function getSalons(search?: string) {
  return prisma.salon.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { city: { contains: search } },
              { address: { contains: search } },
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
        <p className="mt-2 text-neutral-500">
          Găsește salonul perfect și programează-te online.
        </p>
      </div>

      {/* Search */}
      <form className="mb-10" action="/salons" method="GET">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Caută după nume, oraș sau adresă..."
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm transition-all focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600/10"
          />
        </div>
      </form>

      {salons.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((salon) => (
            <Link key={salon.id} href={`/salons/${salon.slug}`}>
              <Card className="group h-full cursor-pointer overflow-hidden hover:shadow-lg hover:border-neutral-300/80">
                <div className="aspect-[16/9] bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scissors className="h-10 w-10 text-amber-200 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-300" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="border-amber-200/80 bg-white/95 text-xs font-medium text-neutral-600 backdrop-blur-sm">
                      {salonTypeLabels[salon.type]}
                    </Badge>
                  </div>
                  {salon.rating >= 4.5 && (
                    <div className="absolute top-3 right-3">
                      <Badge className="border-0 bg-amber-500 text-xs font-medium text-white">
                        <Star className="mr-1 h-3 w-3 fill-white" />
                        Top
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-neutral-900 transition-colors duration-200 group-hover:text-amber-700">
                    {salon.name}
                  </h3>
                  {salon.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 line-clamp-2">
                      {salon.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                    <span className="truncate">{salon.address}, {salon.city}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-neutral-900">{salon.rating.toFixed(1)}</span>
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <Scissors className="h-8 w-8 text-amber-300" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">Niciun salon găsit</h3>
          <p className="mt-1.5 text-sm text-neutral-500">
            {params.q ? "Încearcă o altă căutare." : "Nu sunt saloane disponibile momentan."}
          </p>
        </div>
      )}
    </div>
  );
}
