import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== "SALON_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { workingHours } = body as {
    workingHours: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isWorking: boolean;
    }[];
  };

  if (!workingHours || !Array.isArray(workingHours)) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  // Verify specialist belongs to user's salon
  const specialist = await prisma.specialist.findUnique({
    where: { id },
  });

  if (!specialist || specialist.salonId !== session.user.salonId) {
    return NextResponse.json({ error: "Specialist negăsit" }, { status: 404 });
  }

  // Upsert each working hour entry
  for (const wh of workingHours) {
    await prisma.workingHours.upsert({
      where: {
        specialistId_dayOfWeek: {
          specialistId: id,
          dayOfWeek: wh.dayOfWeek,
        },
      },
      update: {
        startTime: wh.startTime,
        endTime: wh.endTime,
        isWorking: wh.isWorking,
      },
      create: {
        specialistId: id,
        dayOfWeek: wh.dayOfWeek,
        startTime: wh.startTime,
        endTime: wh.endTime,
        isWorking: wh.isWorking,
      },
    });
  }

  return NextResponse.json({ success: true });
}
