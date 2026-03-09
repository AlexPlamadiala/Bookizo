import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users } from "lucide-react";
import { AdminSalonActions } from "./salon-actions";

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Hair Salon",
  BEAUTY_SALON: "Beauty Salon",
  UNISEX: "Unisex",
};

export default async function AdminSalonsPage() {
  const salons = await prisma.salon.findMany({
    include: {
      _count: { select: { specialists: true, bookings: true, services: true } },
      admins: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">Toate saloanele</h2>
      <p className="mt-1 text-sm text-neutral-500">{salons.length} saloane pe platformă</p>

      <div className="mt-6 space-y-4">
        {salons.map((salon) => (
          <Card key={salon.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">{salon.name}</h3>
                    <Badge variant="outline">{salonTypeLabels[salon.type]}</Badge>
                    {!salon.isActive && <Badge variant="error">Inactiv</Badge>}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {salon.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {salon.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {salon._count.specialists} specialiști
                    </span>
                    <span>{salon._count.bookings} programări</span>
                    <span>{salon._count.services} servicii</span>
                  </div>
                  {salon.admins.length > 0 && (
                    <p className="mt-1 text-xs text-neutral-400">
                      Admin: {salon.admins.map((a) => a.email).join(", ")}
                    </p>
                  )}
                </div>
                <AdminSalonActions salonId={salon.id} isActive={salon.isActive} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
