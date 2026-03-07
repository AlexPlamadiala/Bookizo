import { z } from "zod";

export const bookingSchema = z.object({
  salonId: z.string().min(1),
  specialistId: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().min(1, "Selectează o dată"),
  time: z.string().min(1, "Selectează un slot"),
  customerName: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  customerEmail: z.string().email("Email invalid"),
  customerPhone: z.string().min(8, "Număr de telefon invalid"),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const salonSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  description: z.string().optional(),
  address: z.string().min(5, "Adresa trebuie să aibă cel puțin 5 caractere"),
  city: z.string().min(2, "Orașul trebuie să aibă cel puțin 2 caractere"),
  phone: z.string().optional(),
  email: z.string().email("Email invalid").optional().or(z.literal("")),
  type: z.enum(["BARBER", "HAIR_SALON", "BEAUTY_SALON", "UNISEX"]),
});

export const specialistSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Email invalid").optional().or(z.literal("")),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Prețul trebuie să fie pozitiv"),
  duration: z.coerce.number().int().min(15, "Durata minimă: 15 min").max(480, "Durata maximă: 8 ore"),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalid"),
  password: z.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Email invalid"),
  password: z.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere"),
});
