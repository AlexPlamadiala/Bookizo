"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/utils";
import {
  Calendar, Clock, User, Scissors, Check, Loader2, ArrowLeft, ArrowRight,
} from "lucide-react";

type Specialist = {
  id: string;
  name: string;
  specialization: string | null;
  services: Service[];
  workingHours: { dayOfWeek: number; startTime: string; endTime: string; isWorking: boolean }[];
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
};

type Salon = {
  id: string;
  name: string;
  slug: string;
};

interface BookingWizardProps {
  salon: Salon;
  specialists: Specialist[];
  services: Service[];
  preselectedSpecialist?: string;
  preselectedService?: string;
}

type TimeSlot = { time: string; available: boolean };

export function BookingWizard({
  salon,
  specialists,
  services,
  preselectedSpecialist,
  preselectedService,
}: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>(preselectedSpecialist || "");
  const [selectedService, setSelectedService] = useState<string>(preselectedService || "");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const specialist = specialists.find((s) => s.id === selectedSpecialist);
  const service = services.find((s) => s.id === selectedService);

  // Filter services based on selected specialist
  const availableServices = selectedSpecialist
    ? specialist?.services || []
    : services;

  // Auto-advance if preselected
  useEffect(() => {
    if (preselectedSpecialist && preselectedService) {
      setStep(3);
    } else if (preselectedSpecialist) {
      setStep(2);
    }
  }, [preselectedSpecialist, preselectedService]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedSpecialist || !selectedService || !selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedTime("");
      try {
        const res = await fetch(
          `/api/bookings/slots?specialistId=${selectedSpecialist}&serviceId=${selectedService}&date=${selectedDate}`
        );
        const data = await res.json();
        setSlots(data.slots || []);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedSpecialist, selectedService, selectedDate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId: salon.id,
          specialistId: selectedSpecialist,
          serviceId: selectedService,
          date: selectedDate,
          time: selectedTime,
          customerName,
          customerEmail,
          customerPhone,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Eroare la creare programare");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare necunoscută");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-neutral-900">
            Programare trimisă!
          </h2>
          <p className="mt-2 text-neutral-500">
            Programarea ta la {salon.name} cu {specialist?.name} a fost trimisă și așteaptă confirmarea salonului.
            Vei primi o notificare când este confirmată.
          </p>
          <div className="mt-4 inline-flex items-center gap-4 rounded-lg bg-neutral-50 px-6 py-3 text-sm">
            <span><strong>{selectedDate}</strong></span>
            <span><strong>{selectedTime}</strong></span>
            <span>{service?.name}</span>
          </div>
          <div className="mt-6">
            <a href={`/salons/${salon.slug}`}>
              <Button variant="outline">Înapoi la salon</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[
          { num: 1, label: "Specialist" },
          { num: 2, label: "Serviciu" },
          { num: 3, label: "Data & Ora" },
          { num: 4, label: "Confirmare" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s.num
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {step > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span className="hidden text-sm text-neutral-600 sm:inline">{s.label}</span>
            {s.num < 4 && <div className="mx-1 h-px w-4 bg-neutral-200 sm:w-8" />}
          </div>
        ))}
      </div>

      {/* Step 1: Select specialist */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Alege specialistul
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {specialists.map((spec) => (
              <button
                key={spec.id}
                onClick={() => {
                  setSelectedSpecialist(spec.id);
                  setSelectedService("");
                  setStep(2);
                }}
                className={`w-full rounded-lg border p-4 text-left transition-all hover:border-neutral-400 ${
                  selectedSpecialist === spec.id
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                    {spec.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{spec.name}</p>
                    {spec.specialization && (
                      <p className="text-sm text-neutral-500">{spec.specialization}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select service */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Alege serviciul
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableServices.map((svc) => (
              <button
                key={svc.id}
                onClick={() => {
                  setSelectedService(svc.id);
                  setStep(3);
                }}
                className={`w-full rounded-lg border p-4 text-left transition-all hover:border-neutral-400 ${
                  selectedService === svc.id
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{svc.name}</p>
                    {svc.description && (
                      <p className="text-sm text-neutral-500">{svc.description}</p>
                    )}
                    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(svc.duration)}
                    </div>
                  </div>
                  <span className="text-lg font-semibold">{formatPrice(svc.price)}</span>
                </div>
              </button>
            ))}
            <Button variant="ghost" onClick={() => setStep(1)} className="mt-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select date & time */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Alege data și ora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 max-w-xs"
              />
            </div>

            {selectedDate && (
              <div>
                <Label>Oră disponibilă</Label>
                {loadingSlots ? (
                  <div className="flex items-center gap-2 py-4 text-sm text-neutral-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Se încarcă sloturile...
                  </div>
                ) : slots.length > 0 ? (
                  <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          !slot.available
                            ? "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300 line-through"
                            : selectedTime === slot.time
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-neutral-500">
                    Nu sunt sloturi disponibile pentru această dată. Specialistul nu lucrează sau toate orele sunt ocupate.
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi
              </Button>
              {selectedTime && (
                <Button onClick={() => setStep(4)}>
                  Continuă
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Customer details & confirm */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Confirmă programarea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="rounded-lg bg-neutral-50 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Salon:</span>
                <span className="font-medium">{salon.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Specialist:</span>
                <span className="font-medium">{specialist?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Serviciu:</span>
                <span className="font-medium">{service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Data:</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Ora:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Durată:</span>
                <span className="font-medium">{service ? formatDuration(service.duration) : ""}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2">
                <span className="text-neutral-500">Preț:</span>
                <span className="text-lg font-semibold">
                  {service ? formatPrice(service.price) : ""}
                </span>
              </div>
            </div>

            {/* Customer form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nume complet *</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ion Popescu"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="ion@exemplu.ro"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="07xx xxx xxx"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="notes">Note (opțional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mențiuni speciale..."
                  className="mt-1"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !customerName || !customerEmail || !customerPhone}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se procesează...
                  </>
                ) : (
                  "Confirmă programarea"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
