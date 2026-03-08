import { PrismaClient, SalonType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.review.deleteMany();
  await prisma.salonImage.deleteMany();
  await prisma.specialist.deleteMany();
  await prisma.service.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.salon.deleteMany();

  console.log("✅ Cleaned existing data");

  // Create salons
  const salons = await Promise.all([
    prisma.salon.create({
      data: {
        name: "Elite Barber Studio",
        slug: "elite-barber-studio",
        description:
          "Salonul de barbering premium din inima Bucureștiului. Experiență de top pentru bărbați moderni.",
        address: "Str. Victoriei 45",
        city: "București",
        phone: "+40 721 000 001",
        email: "contact@elitebarber.ro",
        type: SalonType.BARBER,
        rating: 4.8,
        reviewCount: 127,
      },
    }),
    prisma.salon.create({
      data: {
        name: "Glamour Hair & Beauty",
        slug: "glamour-hair-beauty",
        description:
          "Salon de beauty complet cu servicii de coafură, manichiură și tratamente profesionale.",
        address: "Bd. Unirii 88",
        city: "Cluj-Napoca",
        phone: "+40 721 000 002",
        email: "hello@glamourhair.ro",
        type: SalonType.BEAUTY_SALON,
        rating: 4.6,
        reviewCount: 89,
      },
    }),
    prisma.salon.create({
      data: {
        name: "Fresh Cuts Unisex",
        slug: "fresh-cuts-unisex",
        description:
          "Salon unisex modern cu o echipă tânără și creativă. Servicii pentru toată familia.",
        address: "Str. Mihai Eminescu 12",
        city: "Timișoara",
        phone: "+40 721 000 003",
        email: "info@freshcuts.ro",
        type: SalonType.UNISEX,
        rating: 4.5,
        reviewCount: 64,
      },
    }),
  ]);

  console.log(`✅ Created ${salons.length} salons`);

  // Create services for each salon
  const serviceTemplates: Record<
    string,
    { name: string; description: string; price: number; duration: number }[]
  > = {
    [salons[0].id]: [
      { name: "Tuns clasic", description: "Tuns cu foarfecă și styling", price: 50, duration: 30 },
      { name: "Tuns + Barbă", description: "Pachet complet tuns și aranjare barbă", price: 80, duration: 60 },
      { name: "Aranjare barbă", description: "Trimming și conturare barbă", price: 40, duration: 30 },
      { name: "Ras cu brici", description: "Ras tradițional cu brici și prosop cald", price: 45, duration: 30 },
      { name: "Vopsit păr", description: "Colorare profesională pentru bărbați", price: 100, duration: 60 },
      { name: "Tratament scalp", description: "Tratament de hidratare și revitalizare", price: 70, duration: 30 },
    ],
    [salons[1].id]: [
      { name: "Tuns damă", description: "Tuns cu consultanță de stil", price: 80, duration: 60 },
      { name: "Vopsit integral", description: "Colorare completă cu produse profesionale", price: 200, duration: 120 },
      { name: "Balayage", description: "Tehnica balayage pentru un look natural", price: 250, duration: 150 },
      { name: "Coafură eveniment", description: "Coafură pentru nunți și evenimente speciale", price: 150, duration: 90 },
      { name: "Tratament keratină", description: "Tratament de netezire și strălucire", price: 300, duration: 120 },
      { name: "Tuns + Styling", description: "Tuns cu uscare și styling", price: 100, duration: 60 },
    ],
    [salons[2].id]: [
      { name: "Tuns bărbați", description: "Tuns clasic sau modern", price: 45, duration: 30 },
      { name: "Tuns femei", description: "Tuns cu consultanță", price: 70, duration: 45 },
      { name: "Tuns copii", description: "Tuns pentru copii sub 12 ani", price: 35, duration: 30 },
      { name: "Vopsit", description: "Colorare completă", price: 150, duration: 90 },
      { name: "Spălat + Styling", description: "Spălare, uscare și coafat", price: 50, duration: 30 },
    ],
  };

  const allServices: Record<string, Awaited<ReturnType<typeof prisma.service.create>>[]> = {};

  for (const [salonId, templates] of Object.entries(serviceTemplates)) {
    const created = await Promise.all(
      templates.map((t) =>
        prisma.service.create({
          data: { ...t, salonId },
        })
      )
    );
    allServices[salonId] = created;
  }

  console.log("✅ Created services");

  // Create specialists
  const specialistData: {
    salonId: string;
    name: string;
    specialization: string;
    bio: string;
    serviceIndices: number[];
  }[] = [
    // Elite Barber Studio
    {
      salonId: salons[0].id,
      name: "Andrei Marin",
      specialization: "Master Barber",
      bio: "10 ani experiență în barbering clasic și modern.",
      serviceIndices: [0, 1, 2, 3],
    },
    {
      salonId: salons[0].id,
      name: "Vlad Ionescu",
      specialization: "Senior Barber",
      bio: "Specialist în fade-uri și design barba.",
      serviceIndices: [0, 1, 2, 5],
    },
    {
      salonId: salons[0].id,
      name: "Cristian Pop",
      specialization: "Colorist & Barber",
      bio: "Expert în colorare masculină și styling.",
      serviceIndices: [0, 4, 5],
    },
    // Glamour Hair & Beauty
    {
      salonId: salons[1].id,
      name: "Elena Dumitrescu",
      specialization: "Hair Stylist Senior",
      bio: "15 ani experiență, specializare coafuri eveniment.",
      serviceIndices: [0, 3, 5],
    },
    {
      salonId: salons[1].id,
      name: "Maria Stancu",
      specialization: "Coloristă",
      bio: "Expert în tehnici avansate de colorare.",
      serviceIndices: [1, 2, 4],
    },
    {
      salonId: salons[1].id,
      name: "Ana Gheorghe",
      specialization: "Junior Stylist",
      bio: "Pasionată de tendințele moderne în hairstyling.",
      serviceIndices: [0, 5],
    },
    {
      salonId: salons[1].id,
      name: "Irina Neagu",
      specialization: "Specialist Tratamente",
      bio: "Specializare în tratamente capilare și keratină.",
      serviceIndices: [4, 5],
    },
    // Fresh Cuts Unisex
    {
      salonId: salons[2].id,
      name: "Dan Stoica",
      specialization: "Barber & Stylist",
      bio: "Versatil, lucrează atât cu bărbați cât și cu femei.",
      serviceIndices: [0, 1, 2],
    },
    {
      salonId: salons[2].id,
      name: "Alina Moldovan",
      specialization: "Hair Stylist",
      bio: "Creativă și atentă la detalii.",
      serviceIndices: [1, 3, 4],
    },
  ];

  const createdSpecialists = [];

  for (const spec of specialistData) {
    const salonServices = allServices[spec.salonId];
    const specialist = await prisma.specialist.create({
      data: {
        name: spec.name,
        specialization: spec.specialization,
        bio: spec.bio,
        salonId: spec.salonId,
        services: {
          connect: spec.serviceIndices.map((i) => ({ id: salonServices[i].id })),
        },
      },
    });

    // Create working hours
    const workingHoursData = [
      { dayOfWeek: 0, startTime: "10:00", endTime: "16:00", isWorking: false }, // Sunday
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isWorking: true },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isWorking: true },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isWorking: true },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isWorking: true },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isWorking: true },
      { dayOfWeek: 6, startTime: "10:00", endTime: "14:00", isWorking: true }, // Saturday half day
    ];

    await prisma.workingHours.createMany({
      data: workingHoursData.map((wh) => ({
        ...wh,
        specialistId: specialist.id,
      })),
    });

    createdSpecialists.push(specialist);
  }

  console.log(`✅ Created ${createdSpecialists.length} specialists with working hours`);

  // Create users - all 3 types
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. SUPER_ADMIN - administrează întreaga platformă
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@bookizo.ro",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  // 2. SALON_ADMIN (Parteneri) - proprietari de saloane
  await prisma.user.create({
    data: {
      name: "Admin Elite Barber",
      email: "admin@bookizo.ro",
      password: hashedPassword,
      role: "SALON_ADMIN",
      salonId: salons[0].id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Admin Glamour",
      email: "admin@glamour.ro",
      password: hashedPassword,
      role: "SALON_ADMIN",
      salonId: salons[1].id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Admin Fresh Cuts",
      email: "admin@freshcuts.ro",
      password: hashedPassword,
      role: "SALON_ADMIN",
      salonId: salons[2].id,
    },
  });

  // 3. CUSTOMER - utilizator normal cu cont
  const clientUser = await prisma.user.create({
    data: {
      name: "Ion Popescu",
      email: "client@bookizo.ro",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  console.log("✅ Created users");

  // Create demo bookings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const nextWeek = new Date(tomorrow);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Ensure dates fall on weekdays
  while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }
  while (dayAfter.getDay() === 0 || dayAfter.getDay() === 6) {
    dayAfter.setDate(dayAfter.getDate() + 1);
  }

  const bookingsToCreate = [
    {
      date: tomorrow,
      startTime: "10:00",
      endTime: "10:30",
      customerName: "Maria Ionescu",
      customerEmail: "maria@email.com",
      customerPhone: "0722 111 111",
      status: "CONFIRMED" as const,
      salonId: salons[0].id,
      specialistId: createdSpecialists[0].id,
      serviceId: allServices[salons[0].id][0].id,
    },
    {
      date: tomorrow,
      startTime: "12:00",
      endTime: "13:00",
      customerName: "George Popa",
      customerEmail: "george@email.com",
      customerPhone: "0733 222 222",
      status: "CONFIRMED" as const,
      salonId: salons[0].id,
      specialistId: createdSpecialists[0].id,
      serviceId: allServices[salons[0].id][1].id,
    },
    {
      date: tomorrow,
      startTime: "14:00",
      endTime: "14:30",
      customerName: "Ana Diaconu",
      customerEmail: "ana@email.com",
      customerPhone: "0744 333 333",
      status: "PENDING" as const,
      salonId: salons[0].id,
      specialistId: createdSpecialists[1].id,
      serviceId: allServices[salons[0].id][2].id,
    },
    {
      date: dayAfter,
      startTime: "09:00",
      endTime: "10:00",
      customerName: "Elena Vasile",
      customerEmail: "elena@email.com",
      customerPhone: "0755 444 444",
      status: "CONFIRMED" as const,
      salonId: salons[1].id,
      specialistId: createdSpecialists[3].id,
      serviceId: allServices[salons[1].id][0].id,
    },
    {
      date: dayAfter,
      startTime: "11:00",
      endTime: "13:00",
      customerName: "Ioana Dragomir",
      customerEmail: "ioana@email.com",
      customerPhone: "0766 555 555",
      status: "CONFIRMED" as const,
      salonId: salons[1].id,
      specialistId: createdSpecialists[4].id,
      serviceId: allServices[salons[1].id][1].id,
    },
    {
      date: tomorrow,
      startTime: "15:00",
      endTime: "15:30",
      customerName: "Alexandru Rusu",
      customerEmail: "alex@email.com",
      customerPhone: "0777 666 666",
      status: "CONFIRMED" as const,
      salonId: salons[2].id,
      specialistId: createdSpecialists[7].id,
      serviceId: allServices[salons[2].id][0].id,
    },
    // Programare a clientului demo (Ion Popescu)
    {
      date: tomorrow,
      startTime: "11:00",
      endTime: "11:30",
      customerName: "Ion Popescu",
      customerEmail: "client@bookizo.ro",
      customerPhone: "0788 000 000",
      status: "PENDING" as const,
      salonId: salons[0].id,
      specialistId: createdSpecialists[1].id,
      serviceId: allServices[salons[0].id][0].id,
      userId: clientUser.id,
    },
  ];

  await prisma.booking.createMany({ data: bookingsToCreate });
  console.log(`✅ Created ${bookingsToCreate.length} demo bookings`);

  // Create reviews
  const reviewsData = [
    { salonId: salons[0].id, author: "Mihai D.", rating: 5, comment: "Cel mai bun barber din București! Andrei este un artist." },
    { salonId: salons[0].id, author: "Radu P.", rating: 5, comment: "Atmosferă excelentă, serviciu de top." },
    { salonId: salons[0].id, author: "Florin S.", rating: 4, comment: "Foarte mulțumit, recomand!" },
    { salonId: salons[1].id, author: "Laura M.", rating: 5, comment: "Echipă profesionistă, rezultate incredibile!" },
    { salonId: salons[1].id, author: "Diana C.", rating: 4, comment: "Balayage-ul este superb. O să revin!" },
    { salonId: salons[2].id, author: "Cristina T.", rating: 5, comment: "Salon super fain, echipă prietenoasă!" },
    { salonId: salons[2].id, author: "Bogdan A.", rating: 4, comment: "Raport calitate-preț excelent." },
  ];

  await prisma.review.createMany({ data: reviewsData });
  console.log(`✅ Created ${reviewsData.length} reviews`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📋 Demo accounts (parolă: password123 pentru toate):");
  console.log("   🔑 Super Admin: superadmin@bookizo.ro");
  console.log("   🏪 Partener:    admin@bookizo.ro (Elite Barber Studio)");
  console.log("   🏪 Partener:    admin@glamour.ro (Glamour Hair & Beauty)");
  console.log("   🏪 Partener:    admin@freshcuts.ro (Fresh Cuts Unisex)");
  console.log("   👤 Client:      client@bookizo.ro");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
