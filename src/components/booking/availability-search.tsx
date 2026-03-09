"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/utils";
import {
  Search, MapPin, Star, Clock, Users, Calendar, Loader2, Scissors,
} from "lucide-react";

type SpecialistResult = {
  specialistId: string;
  specialistName: string;
  specialization: string | null;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  availableSlots: string[];
};

type SalonResult = {
  salonId: string;
  salonName: string;
  salonSlug: string;
  salonAddress: string;
  salonCity: string;
  salonRating: number;
  salonReviewCount: number;
  salonType: string;
  specialists: SpecialistResult[];
};

const salonTypeLabels: Record<string, string> = {
  BARBER: "Barber",
  HAIR_SALON: "Hair Salon",
  BEAUTY_SALON: "Beauty Salon",
  UNISEX: "Unisex",
};

export function AvailabilitySearch({
  serviceNames,
  cities,
}: {
  serviceNames: string[];
  cities: string[];
}) {
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SalonResult[] | null>(null);
  const [searched, setSearched] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = async () => {
    if (!date) return;
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams({ date });
      if (serviceType) params.set("serviceType", serviceType);
      if (time) params.set("time", time);
      if (city) params.set("city", city);

      const res = await fetch(`/api/availability?${params}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Search form */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>Serviciu dorit</Label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="">Toate serviciile</option>
                {serviceNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Data dorită *</Label>
              <Input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Ora preferată (opțional)</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
                step="1800"
              />
            </div>

            <div>
              <Label>Oraș</Label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="">Toate orașele</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button onClick={handleSearch} disabled={!date || loading} className="mt-4">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Caută disponibilitate
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      )}

      {!loading && searched && results && results.length === 0 && (
        <div className="py-16 text-center">
          <Scissors className="mx-auto h-12 w-12 text-neutral-300" />
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            Niciun salon disponibil
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Nu am găsit saloane disponibile pentru criteriile selectate. Încearcă altă dată sau alt serviciu.
          </p>
        </div>
      )}

      {!loading && results && results.length > 0 && (
        <div>
          <p className="mb-4 text-sm text-neutral-500">
            {results.length} {results.length === 1 ? "salon disponibil" : "saloane disponibile"} pentru{" "}
            {new Date(date + "T00:00:00").toLocaleDateString("ro-RO", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {time ? ` la ora ${time}` : ""}
          </p>

          <div className="space-y-6">
            {results.map((salon) => (
              <Card key={salon.salonId} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Salon header */}
                  <div className="border-b bg-neutral-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/salons/${salon.salonSlug}`}
                            className="text-lg font-semibold text-neutral-900 hover:underline"
                          >
                            {salon.salonName}
                          </Link>
                          <Badge variant="outline">
                            {salonTypeLabels[salon.salonType]}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {salon.salonAddress}, {salon.salonCity}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {salon.salonRating.toFixed(1)} ({salon.salonReviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specialists with available slots */}
                  <div className="divide-y">
                    {salon.specialists.map((spec, idx) => (
                      <div key={`${spec.specialistId}-${spec.serviceId}-${idx}`} className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-neutral-400" />
                              <span className="font-medium text-neutral-900">
                                {spec.specialistName}
                              </span>
                              {spec.specialization && (
                                <span className="text-sm text-neutral-500">
                                  &middot; {spec.specialization}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
                              <span className="flex items-center gap-1">
                                <Scissors className="h-3.5 w-3.5" />
                                {spec.serviceName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatDuration(spec.serviceDuration)}
                              </span>
                              <span className="font-medium text-neutral-900">
                                {formatPrice(spec.servicePrice)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Available time slots */}
                        <div className="mt-3">
                          <p className="mb-2 text-xs font-medium text-neutral-500">
                            Ore disponibile:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {spec.availableSlots.slice(0, 12).map((slot) => (
                              <Link
                                key={slot}
                                href={`/book/${salon.salonId}?specialist=${spec.specialistId}&service=${spec.serviceId}`}
                              >
                                <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium transition-all hover:border-amber-600 hover:bg-amber-600 hover:text-white">
                                  {slot}
                                </button>
                              </Link>
                            ))}
                            {spec.availableSlots.length > 12 && (
                              <span className="flex items-center text-xs text-neutral-400">
                                +{spec.availableSlots.length - 12} ore
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
