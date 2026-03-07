"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";

export function ServiceForm({ salonId }: { salonId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId,
          name,
          description,
          price: parseFloat(price),
          duration: parseInt(duration),
        }),
      });
      setName("");
      setDescription("");
      setPrice("");
      setDuration("30");
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Adaugă serviciu
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Serviciu nou</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Nume serviciu *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tuns, vopsit, etc."
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Descriere</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descriere scurtă"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Preț (RON) *</Label>
              <Input
                type="number"
                step="1"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="50"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Durată (minute) *</Label>
              <Input
                type="number"
                step="15"
                min="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                className="mt-1"
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !name || !price}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvează
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Anulează
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
