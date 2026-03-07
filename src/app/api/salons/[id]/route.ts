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

  const salon = await prisma.salon.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description || null,
      address: body.address,
      city: body.city,
      phone: body.phone || null,
      email: body.email || null,
      type: body.type,
    },
  });

  return NextResponse.json({ salon });
}
