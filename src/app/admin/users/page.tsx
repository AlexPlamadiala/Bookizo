import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { AdminUserActions } from "./user-actions";

const roleLabels: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "Super Admin", color: "bg-red-100 text-red-700" },
  SALON_ADMIN: { label: "Partener", color: "bg-blue-100 text-blue-700" },
  CUSTOMER: { label: "Client", color: "bg-neutral-100 text-neutral-700" },
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      salon: { select: { name: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">Utilizatori</h2>
      <p className="mt-1 text-sm text-neutral-500">{users.length} utilizatori pe platformă</p>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-neutral-500">
                  <th className="p-4 font-medium">Nume</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Rol</th>
                  <th className="p-4 font-medium">Salon</th>
                  <th className="p-4 font-medium">Programări</th>
                  <th className="p-4 font-medium">Înregistrat</th>
                  <th className="p-4 font-medium">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => {
                  const role = roleLabels[user.role];
                  return (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="p-4 font-medium">{user.name || "—"}</td>
                      <td className="p-4 text-neutral-500">{user.email}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${role.color}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-500">{user.salon?.name || "—"}</td>
                      <td className="p-4">{user._count.bookings}</td>
                      <td className="p-4 text-neutral-500 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("ro-RO")}
                      </td>
                      <td className="p-4">
                        <AdminUserActions userId={user.id} currentRole={user.role} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
