import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/booking";

/**
 * Search available salons/specialists by service type and date/time.
 *
 * Query params:
 * - serviceType: service name to search for (partial match)
 * - date: YYYY-MM-DD
 * - time: HH:mm (optional - if provided, filters for specific slot availability)
 * - city: city filter (optional)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const serviceType = searchParams.get("serviceType");
  const dateStr = searchParams.get("date");
  const time = searchParams.get("time");
  const city = searchParams.get("city");

  if (!dateStr) {
    return NextResponse.json(
      { error: "Data este obligatorie" },
      { status: 400 }
    );
  }

  const date = new Date(dateStr + "T00:00:00");

  // Find all active salons with their specialists and matching services
  const salons = await prisma.salon.findMany({
    where: {
      isActive: true,
      ...(city ? { city: { contains: city } } : {}),
    },
    include: {
      specialists: {
        where: { isActive: true },
        include: {
          services: {
            where: {
              isActive: true,
              ...(serviceType ? { name: { contains: serviceType } } : {}),
            },
          },
          workingHours: true,
        },
      },
      services: {
        where: {
          isActive: true,
          ...(serviceType ? { name: { contains: serviceType } } : {}),
        },
      },
    },
  });

  const results = [];

  for (const salon of salons) {
    // Only include salons that have matching services
    if (salon.services.length === 0) continue;

    const specialistResults = [];

    for (const specialist of salon.specialists) {
      // Only include specialists that offer the matching services
      const matchingServices = specialist.services.filter((s) =>
        salon.services.some((ss) => ss.id === s.id)
      );

      if (matchingServices.length === 0) continue;

      // Check availability for each matching service
      for (const service of matchingServices) {
        const slots = await getAvailableSlots(specialist.id, date, service.duration);
        const availableSlots = slots.filter((s) => s.available);

        // If a specific time was requested, check if that slot is available
        if (time) {
          const matchingSlot = availableSlots.find((s) => s.time === time);
          if (!matchingSlot) continue;
        }

        if (availableSlots.length === 0) continue;

        specialistResults.push({
          specialistId: specialist.id,
          specialistName: specialist.name,
          specialization: specialist.specialization,
          serviceId: service.id,
          serviceName: service.name,
          servicePrice: service.price,
          serviceDuration: service.duration,
          availableSlots: availableSlots.map((s) => s.time),
        });
      }
    }

    if (specialistResults.length > 0) {
      results.push({
        salonId: salon.id,
        salonName: salon.name,
        salonSlug: salon.slug,
        salonAddress: salon.address,
        salonCity: salon.city,
        salonRating: salon.rating,
        salonReviewCount: salon.reviewCount,
        salonType: salon.type,
        specialists: specialistResults,
      });
    }
  }

  // Sort by rating descending
  results.sort((a, b) => b.salonRating - a.salonRating);

  return NextResponse.json({ results });
}
