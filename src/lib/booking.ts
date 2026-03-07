import { prisma } from "./prisma";

export interface TimeSlot {
  time: string; // "HH:mm"
  available: boolean;
}

/**
 * Calculates available time slots for a specialist on a given date.
 *
 * Takes into account:
 * - The specialist's working hours for that day of the week
 * - Existing bookings that overlap
 * - The duration of the requested service
 * - 30-minute interval slots
 */
export async function getAvailableSlots(
  specialistId: string,
  date: Date,
  serviceDuration: number
): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay(); // 0=Sunday ... 6=Saturday

  // Get working hours for this day
  const workingHours = await prisma.workingHours.findUnique({
    where: {
      specialistId_dayOfWeek: {
        specialistId,
        dayOfWeek,
      },
    },
  });

  if (!workingHours || !workingHours.isWorking) {
    return [];
  }

  // Get existing bookings for this specialist on this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await prisma.booking.findMany({
    where: {
      specialistId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    orderBy: { startTime: "asc" },
  });

  return calculateSlots(
    workingHours.startTime,
    workingHours.endTime,
    existingBookings.map((b) => ({ start: b.startTime, end: b.endTime })),
    serviceDuration
  );
}

/**
 * Pure function that calculates available slots.
 * Generates 30-minute interval slots within working hours,
 * checking each slot against existing bookings for overlap.
 */
export function calculateSlots(
  workStart: string,
  workEnd: string,
  bookings: { start: string; end: string }[],
  serviceDuration: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startMinutes = timeToMinutes(workStart);
  const endMinutes = timeToMinutes(workEnd);
  const INTERVAL = 30; // 30-minute intervals

  for (let current = startMinutes; current + serviceDuration <= endMinutes; current += INTERVAL) {
    const slotStart = current;
    const slotEnd = current + serviceDuration;
    const slotStartStr = minutesToTime(slotStart);

    // Check if this slot overlaps with any existing booking
    const hasConflict = bookings.some((booking) => {
      const bookingStart = timeToMinutes(booking.start);
      const bookingEnd = timeToMinutes(booking.end);
      // Overlap: slot starts before booking ends AND slot ends after booking starts
      return slotStart < bookingEnd && slotEnd > bookingStart;
    });

    slots.push({
      time: slotStartStr,
      available: !hasConflict,
    });
  }

  return slots;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}
