import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Star, Users, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "@/components/booking/favorite-button";

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Salon coafură",
  BEAUTY_SALON: "Salon beauty",
  UNISEX: "Unisex",
};

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id as string },
    include: {
      salon: {
        include: {
          specialists: { where: { isActive: true } },
          services: { where: { isActive: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Saloane favorite</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Saloanele pe care le-ai salvat
      </p>

      {favorites.length === 0 ? (
        <div className="mt-12 py-16 text-center">
          <Heart className="mx-auto h-12 w-12 text-neutral-300" />
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            Niciun salon favorit
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Apasă pe inimioară pe pagina unui salon pentru a-l salva.
          </p>
          <Link href="/salons" className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700 underline">
            Explorează saloane
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {favorites.map(({ salon }) => (
            <Card key={salon.id} className="group overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <Link href={`/salons/${salon.slug}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900 group-hover:text-amber-700">
                          {salon.name}
                        </h3>
                        <Badge variant="outline">{salonTypeLabels[salon.type]}</Badge>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {salon.address}, {salon.city}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {salon.rating.toFixed(1)}
                        </span>
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
                  </Link>
                  <FavoriteButton salonId={salon.id} initialFavorited={true} />
                </div>
                <Link href={`/book/${salon.id}`}>
                  <Button size="sm" className="mt-3 w-full">
                    <Calendar className="mr-2 h-3.5 w-3.5" />
                    Programează-te
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
