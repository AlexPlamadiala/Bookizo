import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id as string },
    include: {
      salon: {
        include: {
          specialists: { where: { isActive: true } },
          services: { where: { isActive: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ favorites });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { salonId } = await request.json();
  if (!salonId) {
    return NextResponse.json({ error: "salonId obligatoriu" }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_salonId: {
        userId: session.user.id as string,
        salonId,
      },
    },
  });

  if (existing) {
    // Toggle: remove if exists
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: {
      userId: session.user.id as string,
      salonId,
    },
  });

  return NextResponse.json({ favorited: true });
}
