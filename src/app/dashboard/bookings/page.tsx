import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { BookingActions } from "./booking-actions";

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

export default async function BookingsPage() {
  const session = await auth();
  const salonId = session?.user?.salonId;

  if (!salonId) return <p>Nu ai salon asociat.</p>;

  const bookings = await prisma.booking.findMany({
    where: { salonId },
    include: { specialist: true, service: true },
    orderBy: [{ date: "desc" }, { startTime: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Programări</h1>
      <p className="mt-1 text-neutral-500">Gestionează programările salonului.</p>

      <Card className="mt-6">
        <CardContent className="p-0">
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-neutral-500">
                    <th className="p-4 font-medium">Data</th>
                    <th className="p-4 font-medium">Ora</th>
                    <th className="p-4 font-medium">Client</th>
                    <th className="p-4 font-medium">Contact</th>
                    <th className="p-4 font-medium">Specialist</th>
                    <th className="p-4 font-medium">Serviciu</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-neutral-50">
                      <td className="p-4 whitespace-nowrap">
                        {new Date(booking.date).toLocaleDateString("ro-RO")}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="p-4 font-medium">{booking.customerName}</td>
                      <td className="p-4">
                        <p className="text-xs">{booking.customerEmail}</p>
                        <p className="text-xs text-neutral-400">{booking.customerPhone}</p>
                      </td>
                      <td className="p-4">{booking.specialist.name}</td>
                      <td className="p-4">
                        <p>{booking.service.name}</p>
                        <p className="text-xs text-neutral-400">{formatPrice(booking.service.price)}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusVariants[booking.status]}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <BookingActions bookingId={booking.id} currentStatus={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-6 text-sm text-neutral-500">Nu sunt programări.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
