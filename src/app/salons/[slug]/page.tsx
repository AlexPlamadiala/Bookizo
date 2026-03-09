import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDuration } from "@/lib/utils";
import {
  MapPin, Phone, Mail, Star, Clock, Users, Scissors, Calendar, ArrowRight,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma as prismaClient } from "@/lib/prisma";
import { FavoriteButton } from "@/components/booking/favorite-button";

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Salon coafură",
  BEAUTY_SALON: "Salon beauty",
  UNISEX: "Unisex",
};

const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

async function getSalon(slug: string) {
  return prisma.salon.findUnique({
    where: { slug },
    include: {
      specialists: {
        where: { isActive: true },
        include: {
          workingHours: { orderBy: { dayOfWeek: "asc" } },
          services: true,
        },
      },
      services: { where: { isActive: true } },
      reviews: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
}

export default async function SalonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const salon = await getSalon(slug);
  if (!salon) notFound();

  const session = await auth();
  let isFavorited = false;
  if (session?.user?.id) {
    const fav = await prismaClient.favorite.findUnique({
      where: { userId_salonId: { userId: session.user.id as string, salonId: salon.id } },
    });
    isFavorited = !!fav;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-900">{salon.name}</h1>
              <Badge variant="outline" className="text-xs">{salonTypeLabels[salon.type]}</Badge>
            </div>
            {salon.description && (
              <p className="mt-2 max-w-2xl leading-relaxed text-neutral-500">{salon.description}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-neutral-400" />
                {salon.address}, {salon.city}
              </span>
              {salon.phone && (
                <a href={`tel:${salon.phone}`} className="flex items-center gap-1.5 transition-colors hover:text-amber-600">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  {salon.phone}
                </a>
              )}
              {salon.email && (
                <a href={`mailto:${salon.email}`} className="flex items-center gap-1.5 transition-colors hover:text-amber-600">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  {salon.email}
                </a>
              )}
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-neutral-900">{salon.rating.toFixed(1)}</span>
              <span className="text-xs text-neutral-400">({salon.reviewCount} recenzii)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {session && <FavoriteButton salonId={salon.id} initialFavorited={isFavorited} />}
            <Link href={`/book/${salon.id}`}>
              <Button size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                Programează-te
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Specialists */}
          <section>
            <h2 className="mb-5 text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600" />
              Specialiști ({salon.specialists.length})
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {salon.specialists.map((spec) => (
                <Link key={spec.id} href={`/specialists/${spec.id}`}>
                  <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:border-amber-200">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700 shrink-0">
                          <span className="text-lg font-semibold">
                            {spec.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-neutral-900 group-hover:text-amber-700 truncate transition-colors">
                            {spec.name}
                          </h3>
                          {spec.specialization && (
                            <p className="text-sm text-neutral-500">{spec.specialization}</p>
                          )}
                          <p className="text-xs text-neutral-400 mt-1">
                            {spec.services.length} servicii
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 text-neutral-300 transition-all group-hover:text-amber-500 group-hover:translate-x-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="mb-5 text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Scissors className="h-5 w-5 text-amber-600" />
              Servicii ({salon.services.length})
            </h2>
            <Card>
              <CardContent className="divide-y divide-neutral-100 p-0">
                {salon.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-amber-50/30"
                  >
                    <div>
                      <h3 className="font-medium text-neutral-900">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-neutral-500">{service.description}</p>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(service.duration)}
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-amber-700 shrink-0 ml-4">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Reviews */}
          {salon.reviews.length > 0 && (
            <section>
              <h2 className="mb-5 text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-600" />
                Recenzii
              </h2>
              <div className="space-y-4">
                {salon.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-900">{review.author}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-neutral-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Working hours */}
          {salon.specialists[0]?.workingHours.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Program orientativ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                    const wh = salon.specialists[0].workingHours.find(
                      (h) => h.dayOfWeek === day
                    );
                    return (
                      <div key={day} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">{dayNames[day]}</span>
                        <span className={wh?.isWorking ? "font-medium text-neutral-900" : "text-neutral-400"}>
                          {wh?.isWorking ? `${wh.startTime} - ${wh.endTime}` : "Închis"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick booking CTA */}
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-neutral-900">Programare rapidă</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Alege specialist, serviciu și oră disponibilă.
              </p>
              <Link href={`/book/${salon.id}`}>
                <Button className="mt-4 w-full">
                  Programează-te acum
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
