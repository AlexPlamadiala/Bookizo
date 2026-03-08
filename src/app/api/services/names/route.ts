import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { name: true },
    distinct: ["name"],
    orderBy: { name: "asc" },
  });

  const cities = await prisma.salon.findMany({
    where: { isActive: true },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });

  return NextResponse.json({
    serviceNames: services.map((s) => s.name),
    cities: cities.map((c) => c.city),
  });
}
