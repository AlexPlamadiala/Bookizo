import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
  });

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
