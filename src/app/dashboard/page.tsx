import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Scissors, Clock } from "lucide-react";
import { formatPrice, formatDuration } from "@/lib/utils";

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

export default async function DashboardPage() {
  const session = await auth();
  const salonId = session?.user?.salonId;

  if (!salonId) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-2 text-neutral-500">
          Nu ai un salon asociat contului tău. Contactează administratorul.
        </p>
      </div>
    );
  }

  const [salon, upcomingBookings, totalBookings, specialistCount, serviceCount] =
    await Promise.all([
      prisma.salon.findUnique({ where: { id: salonId } }),
      prisma.booking.findMany({
        where: { salonId, date: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
        include: { specialist: true, service: true },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
        take: 10,
      }),
      prisma.booking.count({ where: { salonId } }),
      prisma.specialist.count({ where: { salonId } }),
      prisma.service.count({ where: { salonId } }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">
        Dashboard - {salon?.name}
      </h1>
      <p className="mt-1 text-neutral-500">Privire de ansamblu asupra salonului tău.</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Programări viitoare", value: upcomingBookings.length, icon: Calendar },
          { label: "Total programări", value: totalBookings, icon: Clock },
          { label: "Specialiști", value: specialistCount, icon: Users },
          { label: "Servicii", value: serviceCount, icon: Scissors },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                  <stat.icon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming bookings */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Programări viitoare</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-neutral-500">
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Ora</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Specialist</th>
                    <th className="pb-3 font-medium">Serviciu</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {upcomingBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="py-3">{new Date(booking.date).toLocaleDateString("ro-RO")}</td>
                      <td className="py-3">{booking.startTime} - {booking.endTime}</td>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-xs text-neutral-400">{booking.customerPhone}</p>
                        </div>
                      </td>
                      <td className="py-3">{booking.specialist.name}</td>
                      <td className="py-3">
                        <div>
                          <p>{booking.service.name}</p>
                          <p className="text-xs text-neutral-400">{formatPrice(booking.service.price)}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={statusVariants[booking.status]}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Nu sunt programări viitoare.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
