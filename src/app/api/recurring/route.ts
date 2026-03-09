import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { addMinutesToTime } from "@/lib/booking";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const recurring = await prisma.recurringBooking.findMany({
    where: { userId: session.user.id as string },
    include: {
      bookings: {
        orderBy: { date: "desc" },
        take: 3,
        include: { salon: true, specialist: true, service: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Enrich with salon/specialist/service info from latest booking
  return NextResponse.json({ recurring });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { salonId, specialistId, serviceId, interval, dayOfWeek, startTime, startDate } =
    await request.json();

  if (!salonId || !specialistId || !serviceId || !interval || dayOfWeek === undefined || !startTime || !startDate) {
    return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Serviciu negăsit" }, { status: 404 });
  }

  const nextDate = new Date(startDate + "T00:00:00");

  const recurring = await prisma.recurringBooking.create({
    data: {
      interval,
      dayOfWeek,
      startTime,
      userId: session.user.id as string,
      salonId,
      specialistId,
      serviceId,
      nextDate,
    },
  });

  // Create the first booking immediately
  const endTime = addMinutesToTime(startTime, service.duration);
  await prisma.booking.create({
    data: {
      salonId,
      specialistId,
      serviceId,
      date: nextDate,
      startTime,
      endTime,
      customerName: session.user.name || "Client",
      customerEmail: session.user.email || "",
      customerPhone: "",
      status: "PENDING",
      userId: session.user.id as string,
      recurringBookingId: recurring.id,
    },
  });

  return NextResponse.json({ recurring }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await request.json();

  await prisma.recurringBooking.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
