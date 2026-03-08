import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpecialistForm } from "./specialist-form";
import { WorkingHoursEditor } from "@/components/dashboard/working-hours-editor";

const dayNames = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];

export default async function SpecialistsPage() {
  const session = await auth();
  const salonId = session?.user?.salonId;

  if (!salonId) return <p>Nu ai salon asociat.</p>;

  const [specialists, services] = await Promise.all([
    prisma.specialist.findMany({
      where: { salonId },
      include: {
        workingHours: { orderBy: { dayOfWeek: "asc" } },
        services: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({ where: { salonId, isActive: true } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Specialiști</h1>
          <p className="mt-1 text-neutral-500">Gestionează echipa și programul de lucru.</p>
        </div>
      </div>

      <div className="mt-6">
        <SpecialistForm salonId={salonId} services={services} />
      </div>

      <div className="mt-6 space-y-6">
        {specialists.map((spec) => (
          <div key={spec.id} className="space-y-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                    <span className="font-semibold">
                      {spec.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{spec.name}</h3>
                    {spec.specialization && (
                      <p className="text-sm text-neutral-500">{spec.specialization}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {spec.services.map((s) => (
                        <Badge key={s.id} variant="outline" className="text-xs">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm shrink-0">
                  <p className="text-neutral-500">{spec._count.bookings} programări</p>
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                      const wh = spec.workingHours.find((h) => h.dayOfWeek === day);
                      return (
                        <span
                          key={day}
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${
                            wh?.isWorking
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-100 text-neutral-400"
                          }`}
                        >
                          {dayNames[day]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <WorkingHoursEditor
            specialistId={spec.id}
            specialistName={spec.name}
            initialHours={spec.workingHours.map((wh) => ({
              dayOfWeek: wh.dayOfWeek,
              startTime: wh.startTime,
              endTime: wh.endTime,
              isWorking: wh.isWorking,
            }))}
          />
          </div>
        ))}
        {specialists.length === 0 && (
          <p className="text-sm text-neutral-500">Nu sunt specialiști adăugați.</p>
        )}
      </div>
    </div>
  );
}
