"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  booking: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    salon: { name: string };
    service: { name: string };
    specialist: { name: string };
  } | null;
};

const typeColors: Record<string, string> = {
  BOOKING_CREATED: "bg-blue-100 text-blue-800",
  BOOKING_CONFIRMED: "bg-green-100 text-green-800",
  BOOKING_CANCELLED: "bg-red-100 text-red-800",
  BOOKING_COMPLETED: "bg-neutral-100 text-neutral-800",
  BOOKING_REMINDER: "bg-amber-100 text-amber-800",
};

const typeLabels: Record<string, string> = {
  BOOKING_CREATED: "Nouă",
  BOOKING_CONFIRMED: "Confirmată",
  BOOKING_CANCELLED: "Anulată",
  BOOKING_COMPLETED: "Finalizată",
  BOOKING_REMINDER: "Reminder",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notificări</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {unreadCount > 0 ? `${unreadCount} necitite` : "Toate notificările sunt citite"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Marchează toate ca citite
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Card key={n.id} className={n.isRead ? "opacity-70" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                    n.isRead ? "bg-neutral-100" : "bg-amber-100"
                  }`}>
                    <Bell className={`h-4 w-4 ${n.isRead ? "text-neutral-400" : "text-amber-600"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900">{n.title}</p>
                      <Badge className={typeColors[n.type] || "bg-neutral-100"}>
                        {typeLabels[n.type] || n.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{n.message}</p>
                    {n.booking && (
                      <div className="mt-2 rounded-lg bg-neutral-50 p-2 text-xs text-neutral-500">
                        {n.booking.salon.name} &middot; {n.booking.specialist.name} &middot;{" "}
                        {n.booking.service.name} &middot;{" "}
                        {new Date(n.booking.date).toLocaleDateString("ro-RO")} {n.booking.startTime}
                      </div>
                    )}
                    <p className="mt-1 text-xs text-neutral-400">
                      {new Date(n.createdAt).toLocaleString("ro-RO")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-16 text-center">
            <Bell className="mx-auto h-12 w-12 text-neutral-300" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900">
              Nicio notificare
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Vei primi notificări când faci sau primești programări.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
