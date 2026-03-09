import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const bookingId = searchParams.get("bookingId");
  const salonName = searchParams.get("salon") || "Salon";
  const specialistName = searchParams.get("specialist") || "";
  const serviceName = searchParams.get("service") || "Programare";
  const date = searchParams.get("date");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const address = searchParams.get("address") || "";

  if (!date || !startTime || !endTime) {
    return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
  }

  // Build iCal event
  const startDate = date.replace(/-/g, "");
  const startHour = startTime.replace(":", "");
  const endHour = endTime.replace(":", "");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bookizo//RO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${startDate}T${startHour}00`,
    `DTEND:${startDate}T${endHour}00`,
    `SUMMARY:${serviceName} - ${salonName}`,
    `DESCRIPTION:Programare la ${salonName}${specialistName ? ` cu ${specialistName}` : ""}. Serviciu: ${serviceName}`,
    `LOCATION:${address}`,
    `UID:${bookingId || Date.now()}@bookizo.ro`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Programare în 1 oră",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="programare-bookizo.ics"`,
    },
  });
}
