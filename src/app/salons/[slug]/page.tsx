import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDuration } from "@/lib/utils";
import {
  MapPin, Phone, Mail, Star, Clock, Users, Scissors, Calendar,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma as prismaClient } from "@/lib/prisma";
import { FavoriteButton } from "@/components/booking/favorite-button";

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Hair Salon",
  BEAUTY_SALON: "Beauty Salon",
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
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-900">{salon.name}</h1>
              <Badge variant="outline">{salonTypeLabels[salon.type]}</Badge>
            </div>
            {salon.description && (
              <p className="mt-2 max-w-2xl text-neutral-500">{salon.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {salon.address}, {salon.city}
              </span>
              {salon.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {salon.phone}
                </span>
              )}
              {salon.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {salon.email}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{salon.rating.toFixed(1)}</span>
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
        <div className="lg:col-span-2 space-y-8">
          {/* Specialists */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Specialiști ({salon.specialists.length})
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {salon.specialists.map((spec) => (
                <Link key={spec.id} href={`/specialists/${spec.id}`}>
                  <Card className="group cursor-pointer transition-all hover:shadow-md h-full">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                          <span className="text-lg font-semibold">
                            {spec.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-700 truncate">
                            {spec.name}
                          </h3>
                          {spec.specialization && (
                            <p className="text-sm text-neutral-500">{spec.specialization}</p>
                          )}
                          <p className="text-xs text-neutral-400 mt-1">
                            {spec.services.length} servicii
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-neutral-900 flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Servicii ({salon.services.length})
            </h2>
            <Card>
              <CardContent className="divide-y divide-neutral-100 p-0">
                {salon.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between px-5 py-4"
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
                    <span className="text-lg font-semibold text-neutral-900 shrink-0 ml-4">
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
              <h2 className="mb-4 text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <Star className="h-5 w-5" />
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
                        <p className="mt-2 text-sm text-neutral-600">{review.comment}</p>
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
          {/* Working hours - show first specialist's schedule as representative */}
          {salon.specialists[0]?.workingHours.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  Program orientativ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                    const wh = salon.specialists[0].workingHours.find(
                      (h) => h.dayOfWeek === day
                    );
                    return (
                      <div key={day} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">{dayNames[day]}</span>
                        <span className={wh?.isWorking ? "font-medium" : "text-neutral-400"}>
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
          <Card className="bg-neutral-900 text-white">
            <CardContent className="p-6 text-center">
              <Calendar className="mx-auto h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold">Programare rapidă</h3>
              <p className="mt-1 text-sm text-neutral-300">
                Alege specialist, serviciu și oră disponibilă.
              </p>
              <Link href={`/book/${salon.id}`}>
                <Button className="mt-4 w-full bg-white text-neutral-900 hover:bg-neutral-100">
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
