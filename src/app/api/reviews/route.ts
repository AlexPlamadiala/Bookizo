import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Trebuie să fii autentificat" }, { status: 401 });
  }

  const { bookingId, rating, comment } = await request.json();

  if (!bookingId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  // Verify booking belongs to user and is COMPLETED
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true, salon: true },
  });

  if (!booking || booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Programare negăsită" }, { status: 404 });
  }

  if (booking.status !== "COMPLETED") {
    return NextResponse.json({ error: "Poți lăsa recenzie doar pentru programări finalizate" }, { status: 400 });
  }

  if (booking.review) {
    return NextResponse.json({ error: "Ai lăsat deja o recenzie" }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment: comment || null,
      author: session.user.name || "Anonim",
      salonId: booking.salonId,
      userId: session.user.id as string,
      bookingId,
    },
  });

  // Update salon rating
  const allReviews = await prisma.review.findMany({
    where: { salonId: booking.salonId },
    select: { rating: true },
  });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await prisma.salon.update({
    where: { id: booking.salonId },
    data: {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
