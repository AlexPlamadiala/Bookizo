import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  PENDING: "În așteptare",
  CONFIRMED: "Confirmat",
  CANCELLED: "Anulat",
  COMPLETED: "Finalizat",
};

const statusVariants: Record<string, "warning" | "success" | "error" | "default"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
  COMPLETED: "default",
};

export default async function MyBookingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id as string },
    include: {
      salon: true,
      specialist: true,
      service: true,
    },
    orderBy: [{ date: "desc" }, { startTime: "desc" }],
  });

  const upcoming = bookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status !== "CANCELLED"
  );
  const past = bookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === "CANCELLED"
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Programările mele</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Istoricul și programările viitoare
      </p>

      {bookings.length === 0 ? (
        <div className="mt-12 py-16 text-center">
          <Calendar className="mx-auto h-12 w-12 text-neutral-300" />
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            Nicio programare
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Nu ai programări încă. Explorează saloanele și programează-te!
          </p>
          <Link href="/salons" className="mt-4 inline-block text-sm font-medium text-neutral-900 underline">
            Explorează saloane
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Viitoare</h2>
              <div className="mt-3 space-y-3">
                {upcoming.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/salons/${booking.salon.slug}`}
                              className="font-semibold text-neutral-900 hover:underline"
                            >
                              {booking.salon.name}
                            </Link>
                            <Badge variant={statusVariants[booking.status]}>
                              {statusLabels[booking.status]}
                            </Badge>
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-neutral-500">
                            <p className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(booking.date).toLocaleDateString("ro-RO", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              {booking.startTime} - {booking.endTime}
                            </p>
                            <p className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5" />
                              {booking.specialist.name}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5" />
                              {booking.salon.address}, {booking.salon.city}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-medium text-neutral-900">{booking.service.name}</p>
                          <p className="text-sm text-neutral-500">
                            {formatDuration(booking.service.duration)}
                          </p>
                          <p className="mt-1 text-lg font-bold text-neutral-900">
                            {formatPrice(booking.service.price)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Anterioare</h2>
              <div className="mt-3 space-y-3">
                {past.map((booking) => (
                  <Card key={booking.id} className="opacity-70">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900">
                              {booking.salon.name}
                            </span>
                            <Badge variant={statusVariants[booking.status]}>
                              {statusLabels[booking.status]}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-neutral-500">
                            {new Date(booking.date).toLocaleDateString("ro-RO")} &middot;{" "}
                            {booking.startTime} &middot; {booking.specialist.name} &middot;{" "}
                            {booking.service.name}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-neutral-500">
                          {formatPrice(booking.service.price)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
