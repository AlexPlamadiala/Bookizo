"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function FavoriteButton({
  salonId,
  initialFavorited,
}: {
  salonId: string;
  initialFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salonId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={loading}
      className="rounded-full p-2 transition-all hover:bg-neutral-100"
      title={favorited ? "Elimină de la favorite" : "Adaugă la favorite"}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          favorited
            ? "fill-red-500 text-red-500"
            : "text-neutral-400 hover:text-red-400"
        }`}
      />
    </button>
  );
}
