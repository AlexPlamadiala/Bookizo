"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminSalonActions({
  salonId,
  isActive,
}: {
  salonId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/salons/${salonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isActive ? "ghost" : "outline"}
      size="sm"
      onClick={toggleActive}
      disabled={loading}
      className={`text-xs shrink-0 ${isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}`}
    >
      {isActive ? "Dezactivează" : "Activează"}
    </Button>
  );
}
