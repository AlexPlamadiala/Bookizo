import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Clock, Scissors, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

async function getSpecialist(id: string) {
  return prisma.specialist.findUnique({
    where: { id },
    include: {
      salon: true,
      services: true,
      workingHours: { orderBy: { dayOfWeek: "asc" } },
    },
  });
}

export default async function SpecialistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const specialist = await getSpecialist(id);

  if (!specialist) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/salons/${specialist.salon.slug}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-amber-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Înapoi la {specialist.salon.name}
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                <span className="text-3xl font-semibold">
                  {specialist.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <h1 className="mt-4 text-xl font-bold text-neutral-900">{specialist.name}</h1>
              {specialist.specialization && (
                <p className="text-sm text-neutral-500">{specialist.specialization}</p>
              )}
              <p className="mt-1 text-xs text-neutral-400">{specialist.salon.name}</p>
              {specialist.bio && (
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">{specialist.bio}</p>
              )}
              <Link href={`/book/${specialist.salonId}?specialist=${specialist.id}`}>
                <Button className="mt-4 w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Programează-te
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Working hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-amber-600" />
                Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                  const wh = specialist.workingHours.find((h) => h.dayOfWeek === day);
                  return (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">{dayNames[day]}</span>
                      <span className={wh?.isWorking ? "font-medium text-neutral-900" : "text-neutral-400"}>
                        {wh?.isWorking ? `${wh.startTime} - ${wh.endTime}` : "Liber"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <div className="md:col-span-2">
          <h2 className="mb-5 text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <Scissors className="h-5 w-5 text-amber-600" />
            Servicii disponibile ({specialist.services.length})
          </h2>
          <div className="space-y-3">
            {specialist.services.map((service) => (
              <Card key={service.id} className="group transition-all hover:shadow-md hover:border-amber-200">
                <CardContent className="flex items-center justify-between p-5">
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
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-lg font-semibold text-amber-700">
                      {formatPrice(service.price)}
                    </span>
                    <Link
                      href={`/book/${specialist.salonId}?specialist=${specialist.id}&service=${service.id}`}
                    >
                      <Button size="sm" variant="outline" className="mt-2 block group-hover:border-amber-300 group-hover:text-amber-700">
                        Programare
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {specialist.services.length === 0 && (
              <div className="py-12 text-center">
                <Scissors className="mx-auto h-8 w-8 text-neutral-300" />
                <p className="mt-2 text-sm text-neutral-500">
                  Niciun serviciu disponibil momentan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
