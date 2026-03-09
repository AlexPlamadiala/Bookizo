import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== "SALON_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
    return NextResponse.json({ error: "Status invalid" }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
    include: { service: true, specialist: true, salon: true },
  });

  // Notify the customer if they have an account
  if (booking.userId) {
    const notifMap: Record<string, { type: "BOOKING_CONFIRMED" | "BOOKING_CANCELLED" | "BOOKING_COMPLETED"; title: string; message: string }> = {
      CONFIRMED: {
        type: "BOOKING_CONFIRMED",
        title: "Programare confirmată",
        message: `Programarea ta la ${booking.salon.name} pe ${booking.date.toLocaleDateString("ro-RO")} la ${booking.startTime} a fost confirmată.`,
      },
      CANCELLED: {
        type: "BOOKING_CANCELLED",
        title: "Programare anulată",
        message: `Programarea ta la ${booking.salon.name} pe ${booking.date.toLocaleDateString("ro-RO")} la ${booking.startTime} a fost anulată.`,
      },
      COMPLETED: {
        type: "BOOKING_COMPLETED",
        title: "Programare finalizată",
        message: `Programarea ta la ${booking.salon.name} a fost finalizată. Mulțumim!`,
      },
    };

    const notif = notifMap[status];
    if (notif) {
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          ...notif,
        },
      });
    }
  }

  // Send email notification (non-blocking)
  if (status === "CONFIRMED" || status === "CANCELLED") {
    sendBookingConfirmationEmail(booking.customerEmail, {
      customerName: booking.customerName,
      salonName: booking.salon.name,
      specialistName: booking.specialist.name,
      serviceName: booking.service.name,
      date: booking.date.toLocaleDateString("ro-RO"),
      time: booking.startTime,
      status,
    }).catch(() => {}); // Don't block on email failure
  }

  return NextResponse.json({ booking });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== "SALON_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.booking.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
