"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";

export function ReviewForm({
  bookingId,
  salonName,
  onReviewSubmitted,
}: {
  bookingId: string;
  salonName: string;
  onReviewSubmitted?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });

      if (res.ok) {
        setSubmitted(true);
        onReviewSubmitted?.();
      } else {
        const data = await res.json();
        setError(data.error || "Eroare");
      }
    } catch {
      setError("Eroare la trimitere");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-center">
        <p className="text-sm font-medium text-green-800">Mulțumim pentru recenzie!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-neutral-900">
        Lasă o recenzie pentru {salonName}
      </p>

      {/* Star rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="p-0.5"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hoverRating || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-neutral-300"
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Scrie un comentariu (opțional)..."
        rows={2}
        className="text-sm"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <Button onClick={handleSubmit} disabled={loading || rating === 0} size="sm">
        {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
        Trimite recenzia
      </Button>
    </div>
  );
}
