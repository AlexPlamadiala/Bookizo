import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Search, Calendar, Star, MapPin, Scissors, Clock, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Hair Salon",
  BEAUTY_SALON: "Beauty Salon",
  UNISEX: "Unisex",
};

async function getFeaturedSalons() {
  return prisma.salon.findMany({
    where: { isActive: true },
    include: { specialists: true, services: true },
    take: 6,
    orderBy: { rating: "desc" },
  });
}

export default async function HomePage() {
  const salons = await getFeaturedSalons();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDIwIEwgMjAgMjAgMjAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZ3JpZCkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80">
              <Scissors className="h-4 w-4" />
              Platformă de programări online
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Programează-te la
              <span className="block bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                salonul preferat
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-300">
              Găsește cele mai bune frizerii, saloane de beauty și coafori din orașul tău.
              Programare simplă, rapidă, online.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/salons">
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Explorează saloane
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" className="border border-white/30 bg-transparent text-white hover:bg-white/10">
                  <Search className="mr-2 h-4 w-4" />
                  Caută după disponibilitate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Cum funcționează</h2>
            <p className="mt-2 text-neutral-500">Trei pași simpli pentru programarea perfectă</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { icon: Search, title: "Caută salonul", desc: "Explorează saloanele disponibile din zona ta și alege-l pe cel potrivit." },
              { icon: Users, title: "Alege specialistul", desc: "Vezi specialiștii disponibili, serviciile oferite și sloturile libere." },
              { icon: Calendar, title: "Programează-te", desc: "Selectează data, ora și confirmă programarea în câteva secunde." },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">{step.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Saloane recomandate</h2>
              <p className="mt-2 text-neutral-500">Cele mai populare saloane de pe platformă</p>
            </div>
            <Link href="/salons">
              <Button variant="outline">
                Vezi toate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {salons.map((salon) => (
              <Link key={salon.id} href={`/salons/${salon.slug}`}>
                <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
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
                    <div className="mt-2 flex items-center gap-1 text-sm text-neutral-500">
                      <MapPin className="h-3.5 w-3.5" />
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
                          {salon.specialists.length} specialiști
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {salon.services.length} servicii
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {salons.length === 0 && (
            <div className="mt-12 text-center">
              <Scissors className="mx-auto h-12 w-12 text-neutral-300" />
              <p className="mt-4 text-neutral-500">Nu sunt saloane disponibile momentan.</p>
              <p className="text-sm text-neutral-400">Rulează seed-ul pentru a adăuga date demo.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
