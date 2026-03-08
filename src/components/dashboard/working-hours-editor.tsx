"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Loader2, Save } from "lucide-react";

const dayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
const orderedDays = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun

type WorkingHour = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
};

export function WorkingHoursEditor({
  specialistId,
  specialistName,
  initialHours,
}: {
  specialistId: string;
  specialistName: string;
  initialHours: WorkingHour[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hours, setHours] = useState<WorkingHour[]>(() =>
    orderedDays.map((day) => {
      const existing = initialHours.find((h) => h.dayOfWeek === day);
      return existing || { dayOfWeek: day, startTime: "09:00", endTime: "17:00", isWorking: false };
    })
  );

  const updateHour = (dayOfWeek: number, field: keyof WorkingHour, value: string | boolean) => {
    setHours((prev) =>
      prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h))
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/specialists/${specialistId}/working-hours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workingHours: hours }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Program - {specialistName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {orderedDays.map((day) => {
            const hour = hours.find((h) => h.dayOfWeek === day)!;
            return (
              <div key={day} className="flex items-center gap-3">
                <label className="flex items-center gap-2 w-28 shrink-0">
                  <input
                    type="checkbox"
                    checked={hour.isWorking}
                    onChange={(e) => updateHour(day, "isWorking", e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <span className={`text-sm ${hour.isWorking ? "font-medium text-neutral-900" : "text-neutral-400"}`}>
                    {dayNames[day]}
                  </span>
                </label>
                {hour.isWorking ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={hour.startTime}
                      onChange={(e) => updateHour(day, "startTime", e.target.value)}
                      className="w-32 text-sm"
                    />
                    <span className="text-neutral-400">-</span>
                    <Input
                      type="time"
                      value={hour.endTime}
                      onChange={(e) => updateHour(day, "endTime", e.target.value)}
                      className="w-32 text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400">Liber</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvează program
          </Button>
          {saved && <span className="text-sm text-green-600">Salvat!</span>}
        </div>
      </CardContent>
    </Card>
  );
}
