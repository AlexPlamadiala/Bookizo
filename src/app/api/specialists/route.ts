import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user.role !== "SALON_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const body = await request.json();
  const { salonId, name, specialization, serviceIds } = body;

  if (!name || !salonId) {
    return NextResponse.json({ error: "Nume și salon obligatorii" }, { status: 400 });
  }

  const specialist = await prisma.specialist.create({
    data: {
      name,
      specialization: specialization || null,
      salonId,
      services: serviceIds?.length
        ? { connect: serviceIds.map((id: string) => ({ id })) }
        : undefined,
      // Create default working hours (Mon-Fri 09:00-17:00)
      workingHours: {
        createMany: {
          data: [1, 2, 3, 4, 5].map((day) => ({
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "17:00",
            isWorking: true,
          })),
        },
      },
    },
  });

  // Also create non-working entries for weekend
  await prisma.workingHours.createMany({
    data: [0, 6].map((day) => ({
      specialistId: specialist.id,
      dayOfWeek: day,
      startTime: "09:00",
      endTime: "17:00",
      isWorking: false,
    })),
  });

  return NextResponse.json({ specialist }, { status: 201 });
}
