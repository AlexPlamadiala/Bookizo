import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";
import { addMinutesToTime } from "@/lib/booking";
import { getAvailableSlots } from "@/lib/booking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { salonId, specialistId, serviceId, date, time, customerName, customerEmail, customerPhone, notes } = parsed.data;

    // Verify service exists and get duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviciu negăsit" }, { status: 404 });
    }

    // Double-check slot availability to prevent race conditions
    const dateObj = new Date(date + "T00:00:00");
    const slots = await getAvailableSlots(specialistId, dateObj, service.duration);
    const slot = slots.find((s) => s.time === time);

    if (!slot || !slot.available) {
      return NextResponse.json(
        { error: "Acest slot nu mai este disponibil. Te rugăm să alegi altă oră." },
        { status: 409 }
      );
    }

    const endTime = addMinutesToTime(time, service.duration);

    const booking = await prisma.booking.create({
      data: {
        salonId,
        specialistId,
        serviceId,
        date: dateObj,
        startTime: time,
        endTime,
        customerName,
        customerEmail,
        customerPhone,
        notes: notes || null,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Eroare la crearea programării" },
      { status: 500 }
    );
  }
}
