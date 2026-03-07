import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user.role !== "SALON_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const body = await request.json();
  const { salonId, ...serviceData } = body;

  const parsed = serviceSchema.safeParse(serviceData);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Date invalide", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const service = await prisma.service.create({
    data: {
      ...parsed.data,
      salonId,
    },
  });

  return NextResponse.json({ service }, { status: 201 });
}
