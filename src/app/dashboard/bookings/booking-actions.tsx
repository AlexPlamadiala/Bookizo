"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BookingActions({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === "CANCELLED" || currentStatus === "COMPLETED") {
    return null;
  }

  return (
    <div className="flex gap-1">
      {currentStatus === "PENDING" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateStatus("CONFIRMED")}
          disabled={loading}
          className="text-xs"
        >
          Confirmă
        </Button>
      )}
      {(currentStatus === "PENDING" || currentStatus === "CONFIRMED") && (
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateStatus("COMPLETED")}
            disabled={loading}
            className="text-xs"
          >
            Finalizat
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateStatus("CANCELLED")}
            disabled={loading}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Anulează
          </Button>
        </>
      )}
    </div>
  );
}
