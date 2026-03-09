import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Search, Calendar, Star, MapPin, Scissors, Clock, Users, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Salon coafură",
  BEAUTY_SALON: "Salon beauty",
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
      {/* Hero Section - Light & Warm */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-white to-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-orange-50/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
              <Sparkles className="h-4 w-4" />
              Platforma #1 de programări online
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Programează-te la{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                salonul preferat
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-500">
              Găsește cele mai bune frizerii, saloane de beauty și coafori din orașul tău.
              Programare simplă, rapidă, online.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/salons">
                <Button size="lg" className="w-full bg-amber-600 text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 sm:w-auto">
                  Explorează saloane
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="w-full border-neutral-300 sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Caută după disponibilitate
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Confirmare rapidă
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Programare gratuită
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Fără obligații
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-neutral-100 bg-neutral-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Simplu și rapid</p>
            <h2 className="mt-2 text-3xl font-bold text-neutral-900">Cum funcționează</h2>
            <p className="mt-3 text-neutral-500">Trei pași simpli pentru programarea perfectă</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              { icon: Search, title: "Caută salonul", desc: "Explorează saloanele disponibile din zona ta și alege-l pe cel potrivit.", step: "01" },
              { icon: Users, title: "Alege specialistul", desc: "Vezi specialiștii disponibili, serviciile oferite și sloturile libere.", step: "02" },
              { icon: Calendar, title: "Programează-te", desc: "Selectează data, ora și confirmă programarea în câteva secunde.", step: "03" },
            ].map((item, i) => (
              <div key={i} className="group relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition-all duration-200 group-hover:bg-amber-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-600/20">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="mt-4 block text-xs font-bold uppercase tracking-widest text-amber-600/70">Pasul {item.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Recomandate</p>
              <h2 className="mt-2 text-3xl font-bold text-neutral-900">Saloane populare</h2>
              <p className="mt-2 text-neutral-500">Cele mai apreciate saloane de pe platformă</p>
            </div>
            <Link href="/salons" className="hidden sm:block">
              <Button variant="outline" className="group">
                Vezi toate
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

          {/* Mobile "Vezi toate" button */}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/salons">
              <Button variant="outline" className="w-full">
                Vezi toate saloanele
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {salons.length === 0 && (
            <div className="mt-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
                <Scissors className="h-8 w-8 text-amber-300" />
              </div>
              <p className="mt-4 font-medium text-neutral-600">Nu sunt saloane disponibile momentan.</p>
              <p className="mt-1 text-sm text-neutral-400">Rulează seed-ul pentru a adăuga date demo.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Light warm */}
      <section className="border-t border-neutral-100 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Scissors className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-neutral-900">Ai un salon?</h2>
          <p className="mt-4 text-lg text-neutral-500">
            Înregistrează-ți salonul pe Bookizo și primește programări online. Gratuit.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="bg-amber-600 text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700">
                Listează-ți salonul
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
