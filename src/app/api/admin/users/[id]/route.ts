import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (!["CUSTOMER", "SALON_ADMIN", "SUPER_ADMIN"].includes(body.role)) {
    return NextResponse.json({ error: "Rol invalid" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role: body.role },
  });

  return NextResponse.json({ user });
}
