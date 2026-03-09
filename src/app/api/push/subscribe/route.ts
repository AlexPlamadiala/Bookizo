import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { endpoint, keys } = await request.json();

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: {
      userId_endpoint: {
        userId: session.user.id as string,
        endpoint: endpoint.substring(0, 255),
      },
    },
    update: {
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    create: {
      userId: session.user.id as string,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { endpoint } = await request.json();

  await prisma.pushSubscription.deleteMany({
    where: {
      userId: session.user.id as string,
      endpoint,
    },
  });

  return NextResponse.json({ success: true });
}
