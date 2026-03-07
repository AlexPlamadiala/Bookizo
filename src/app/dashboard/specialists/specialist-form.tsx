"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";

type Service = { id: string; name: string };

export function SpecialistForm({
  salonId,
  services,
}: {
  salonId: string;
  services: Service[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/specialists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId,
          name,
          specialization,
          serviceIds: selectedServices,
        }),
      });
      setName("");
      setSpecialization("");
      setSelectedServices([]);
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
        Adaugă specialist
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Specialist nou</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Nume *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ion Popescu"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Specializare</Label>
              <Input
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Frizerie, colorat, etc."
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Servicii</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setSelectedServices((prev) =>
                      prev.includes(s.id)
                        ? prev.filter((id) => id !== s.id)
                        : [...prev, s.id]
                    )
                  }
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selectedServices.includes(s.id)
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !name}>
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
