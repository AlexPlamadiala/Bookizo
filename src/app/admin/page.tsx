import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Users, Calendar, DollarSign, TrendingUp, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminPage() {
  const [
    totalSalons,
    totalUsers,
    totalBookings,
    totalSpecialists,
    totalServices,
    pendingBookings,
    recentBookings,
    recentUsers,
    topSalons,
    bookingsByStatus,
  ] = await Promise.all([
    prisma.salon.count(),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.specialist.count(),
    prisma.service.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { salon: true, service: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.salon.findMany({
      orderBy: { rating: "desc" },
      take: 5,
      include: { _count: { select: { bookings: true, specialists: true } } },
    }),
    Promise.all([
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]),
  ]);

  const stats = [
    { label: "Saloane", value: totalSalons, icon: Store, color: "bg-blue-100 text-blue-600" },
    { label: "Utilizatori", value: totalUsers, icon: Users, color: "bg-green-100 text-green-600" },
    { label: "Programări totale", value: totalBookings, icon: Calendar, color: "bg-purple-100 text-purple-600" },
    { label: "În așteptare", value: pendingBookings, icon: Clock, color: "bg-amber-100 text-amber-600" },
    { label: "Specialiști", value: totalSpecialists, icon: TrendingUp, color: "bg-pink-100 text-pink-600" },
    { label: "Servicii", value: totalServices, icon: DollarSign, color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
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

      {/* Booking Status Breakdown */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Distribuție programări</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-2" />
              Confirmate: <strong>{bookingsByStatus[0]}</strong>
            </div>
            <div>
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500 mr-2" />
              Finalizate: <strong>{bookingsByStatus[1]}</strong>
            </div>
            <div>
              <span className="inline-block h-3 w-3 rounded-full bg-red-500 mr-2" />
              Anulate: <strong>{bookingsByStatus[2]}</strong>
            </div>
            <div>
              <span className="inline-block h-3 w-3 rounded-full bg-amber-500 mr-2" />
              În așteptare: <strong>{pendingBookings}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Salons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top saloane</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSalons.map((salon, i) => (
                <div key={salon.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{salon.name}</p>
                      <p className="text-xs text-neutral-500">
                        {salon._count.specialists} specialiști &middot; {salon._count.bookings} programări
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{salon.rating.toFixed(1)} ★</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Utilizatori recenți</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{user.name || "—"}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    user.role === "SUPER_ADMIN"
                      ? "bg-red-100 text-red-700"
                      : user.role === "SALON_ADMIN"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-neutral-100 text-neutral-700"
                  }`}>
                    {user.role === "SUPER_ADMIN" ? "Admin" : user.role === "SALON_ADMIN" ? "Partener" : "Client"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Programări recente (platforma)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-neutral-500">
                  <th className="p-4 font-medium">Data</th>
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Salon</th>
                  <th className="p-4 font-medium">Serviciu</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50">
                    <td className="p-4 whitespace-nowrap">
                      {new Date(b.date).toLocaleDateString("ro-RO")} {b.startTime}
                    </td>
                    <td className="p-4">{b.customerName}</td>
                    <td className="p-4">{b.salon.name}</td>
                    <td className="p-4">{b.service.name}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                        b.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                        b.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                        "bg-neutral-100 text-neutral-700"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
