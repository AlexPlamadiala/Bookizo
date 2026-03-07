import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const specialistId = searchParams.get("specialistId");
  const serviceId = searchParams.get("serviceId");
  const dateStr = searchParams.get("date");

  if (!specialistId || !serviceId || !dateStr) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const date = new Date(dateStr + "T00:00:00");
  const slots = await getAvailableSlots(specialistId, date, service.duration);

  return NextResponse.json({ slots });
}
