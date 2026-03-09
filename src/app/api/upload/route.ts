import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user.role !== "SALON_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const target = formData.get("target") as string; // "salon" | "specialist"
  const targetId = formData.get("targetId") as string;

  if (!file || !target || !targetId) {
    return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tip fișier nepermis. Acceptăm: JPG, PNG, WebP" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fișier prea mare. Maxim 5MB." }, { status: 400 });
  }

  // Ensure upload directory exists
  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${target}-${targetId}-${Date.now()}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  const url = `/uploads/${filename}`;

  // Update the target record
  if (target === "salon") {
    await prisma.salon.update({
      where: { id: targetId },
      data: { image: url },
    });

    // Also add to salon images gallery
    await prisma.salonImage.create({
      data: { url, alt: file.name, salonId: targetId },
    });
  } else if (target === "specialist") {
    await prisma.specialist.update({
      where: { id: targetId },
      data: { image: url },
    });
  }

  return NextResponse.json({ url }, { status: 201 });
}
