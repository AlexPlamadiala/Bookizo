"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

type BookingItem = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  customerName: string;
  specialistName: string;
  serviceName: string;
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 border-yellow-300 text-yellow-800",
  CONFIRMED: "bg-green-100 border-green-300 text-green-800",
  CANCELLED: "bg-red-100 border-red-200 text-red-600 line-through opacity-50",
  COMPLETED: "bg-neutral-100 border-neutral-200 text-neutral-500",
};

const dayNames = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
const monthNames = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

export function BookingsCalendar({ bookings }: { bookings: BookingItem[] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  // Group bookings by date string (YYYY-MM-DD)
  const bookingsByDate = new Map<string, BookingItem[]>();
  for (const b of bookings) {
    const dateStr = b.date.split("T")[0];
    if (!bookingsByDate.has(dateStr)) bookingsByDate.set(dateStr, []);
    bookingsByDate.get(dateStr)!.push(b);
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const selectedBookings = selectedDate ? (bookingsByDate.get(selectedDate) || []) : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers (Mon-Sun) */}
          <div className="grid grid-cols-7 mb-1">
            {["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-medium text-neutral-500">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square p-1" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayBookings = bookingsByDate.get(dateStr) || [];
              const activeBookings = dayBookings.filter((b) => b.status !== "CANCELLED");
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-1 rounded-lg text-sm relative transition-all hover:bg-neutral-50 ${
                    isSelected ? "bg-neutral-100 ring-2 ring-neutral-900" : ""
                  } ${isToday ? "font-bold" : ""}`}
                >
                  <span className={`${isToday ? "flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white text-xs mx-auto" : ""}`}>
                    {day}
                  </span>
                  {activeBookings.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {activeBookings.length <= 3 ? (
                        activeBookings.map((b, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 w-1.5 rounded-full ${
                              b.status === "CONFIRMED" ? "bg-green-500" : "bg-yellow-500"
                            }`}
                          />
                        ))
                      ) : (
                        <span className="text-[10px] font-medium text-neutral-600">
                          {activeBookings.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected day detail */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {selectedDate
              ? new Date(selectedDate + "T00:00:00").toLocaleDateString("ro-RO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : "Selectează o zi"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            selectedBookings.length > 0 ? (
              <div className="space-y-2">
                {selectedBookings
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((b) => (
                    <div
                      key={b.id}
                      className={`rounded-lg border p-3 text-sm ${statusColors[b.status]}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {b.startTime} - {b.endTime}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {b.status === "PENDING" && "Așteptare"}
                          {b.status === "CONFIRMED" && "Confirmat"}
                          {b.status === "CANCELLED" && "Anulat"}
                          {b.status === "COMPLETED" && "Finalizat"}
                        </Badge>
                      </div>
                      <p className="mt-1 font-medium">{b.customerName}</p>
                      <p className="text-xs opacity-75">
                        {b.specialistName} &middot; {b.serviceName}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Nicio programare în această zi.</p>
            )
          ) : (
            <p className="text-sm text-neutral-500">
              Click pe o zi din calendar pentru a vedea programările.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
