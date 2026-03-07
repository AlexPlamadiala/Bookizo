import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/utils";
import { ServiceForm } from "./service-form";
import { Clock } from "lucide-react";

export default async function ServicesPage() {
  const session = await auth();
  const salonId = session?.user?.salonId;

  if (!salonId) return <p>Nu ai salon asociat.</p>;

  const services = await prisma.service.findMany({
    where: { salonId },
    include: {
      _count: { select: { bookings: true, specialists: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Servicii</h1>
          <p className="mt-1 text-neutral-500">Gestionează serviciile oferite.</p>
        </div>
      </div>

      <div className="mt-6">
        <ServiceForm salonId={salonId} />
      </div>

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900">{service.name}</h3>
                  {!service.isActive && <Badge variant="error">Inactiv</Badge>}
                </div>
                {service.description && (
                  <p className="text-sm text-neutral-500">{service.description}</p>
                )}
                <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(service.duration)}
                  </span>
                  <span>{service._count.specialists} specialiști</span>
                  <span>{service._count.bookings} programări</span>
                </div>
              </div>
              <span className="text-xl font-bold text-neutral-900 shrink-0 ml-4">
                {formatPrice(service.price)}
              </span>
            </CardContent>
          </Card>
        ))}
        {services.length === 0 && (
          <p className="text-sm text-neutral-500">Nu sunt servicii adăugate.</p>
        )}
      </div>
    </div>
  );
}
