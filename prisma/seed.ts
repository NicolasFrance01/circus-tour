import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Business Settings
  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Circus Tours",
      slug: "circus-tours",
      tagline: "Te llevamos y te traemos.",
      description:
        "Salimos desde Córdoba y Villa María a los recitales más grandes del país, en cama o semicama, con cena previa y coordinación todo el viaje. Reservás online y viajás seguro con tu pasaje QR.",
      logoUrl:
        "https://res.cloudinary.com/h1ywvtjv/image/upload/c_limit,h_2000,w_2000/f_auto,q_auto/v1794626260/saas/platform/general/m25abo9cfb0tj3wkwnl6.png?_a=BAMAPqiw0",
      heroImage:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=2000&q=80",
      heroTitle: "Viajá a los mejores recitales y eventos",
      heroSubtitle:
        "Traslados grupales en micros de larga distancia con cena previa, coordinación permanente y pasaje digital con QR.",
      phone: "5493516703575",
      whatsapp: "5493516703575",
      instagram: "circustourscordoba",
      addressCity: "Córdoba",
      addressCountry: "AR",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=-32.022249%2C-63.969874",
      primaryColor: "#a83832",
      navStyle: "flotante",
      bankAlias: "CIRCUS.TOURS.MP",
      bankCbu: "0000003100012345678901",
      bankHolder: "Circus Tours SRL",
    },
  });

  // 2. Admin User
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@circustours.com" },
    update: { passwordHash },
    create: {
      email: "admin@circustours.com",
      name: "Administrador Circus",
      passwordHash,
      role: "ADMIN",
    },
  });

  // 3. Events
  const miloJ = await prisma.event.upsert({
    where: { slug: "milo-j-en-el-kempes" },
    update: {},
    create: {
      slug: "milo-j-en-el-kempes",
      title: "Milo J en el Kempes",
      subtitle: "Estadio Mario Alberto Kempes - Córdoba",
      description:
        "Te llevamos, te esperamos para el regreso y te traemos con la mejor onda. Salida 17:30 desde la Terminal de Córdoba y puntos habilitados. Incluye cena previa y coordinación permanente.",
      imageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      categoryTag: "Recitales",
      type: "EVENTO",
      date: new Date("2026-12-05T17:30:00Z"),
      departureTime: "17:30",
      departureLocation: "Terminal de Córdoba",
      venue: "Estadio Kempes",
      city: "Córdoba",
      destinationCity: "Córdoba",
      price: 35000,
      depositPrice: 15000,
      totalCapacity: 60,
      isFeatured: true,
      isActive: true,
      busType: "Cama / Semicama",
      includes: JSON.stringify([
        "Traslado ida y vuelta en micro de última generación",
        "Coordinador Circus permanente",
        "Cena previa antes de ingresar",
        "Seguro de viaje y asistencia al pasajero",
        "Pasaje digital con código QR",
      ]),
      itinerary:
        "17:30 - Encuentro en Terminal de Córdoba\n18:30 - Llegada a inmediaciones del Estadio Kempes y cena previa\n20:30 - Ingreso al show\n00:30 - Reencuentro en punto convenido y regreso",
      pickupPoints: {
        create: [
          {
            name: "Terminal de Córdoba (Plataformas 1 a 5)",
            address: "Bv. Perón 380, Córdoba",
            time: "17:30",
            order: 1,
          },
          {
            name: "Patio Olmos (Obispo Trejo y San Juan)",
            address: "Av. Vélez Sarsfield 361, Córdoba",
            time: "18:00",
            order: 2,
          },
        ],
      },
    },
  });

  const primavera = await prisma.event.upsert({
    where: { slug: "fiesta-de-la-primavera" },
    update: {},
    create: {
      slug: "fiesta-de-la-primavera",
      title: "Fiesta de la Primavera",
      subtitle: "Villa Carlos Paz - Día completo",
      description:
        "La fiesta más grande de la primavera en la costanera de Villa Carlos Paz. Traslado ida y vuelta con parador exclusivo, desayuno en ruta y sorteos a bordo.",
      imageUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      categoryTag: "Festivales",
      type: "EVENTO",
      date: new Date("2026-09-21T09:00:00Z"),
      departureTime: "09:00",
      departureLocation: "Terminal de Córdoba",
      venue: "Costanera de Villa Carlos Paz",
      city: "Córdoba",
      destinationCity: "Villa Carlos Paz",
      price: 25000,
      depositPrice: 10000,
      totalCapacity: 120,
      isFeatured: true,
      isActive: true,
      busType: "Semicama Premium",
      includes: JSON.stringify([
        "Traslado ida y vuelta",
        "Desayuno en parador exclusivo",
        "Sorteos y regalos en viaje",
        "Coordinación Circus 24hs",
      ]),
      pickupPoints: {
        create: [
          {
            name: "Terminal de Córdoba",
            address: "Bv. Perón 380",
            time: "09:00",
            order: 1,
          },
          {
            name: "Villa María - Estación de Servicio Puma",
            address: "Ruta 9 km 550",
            time: "07:30",
            order: 2,
          },
        ],
      },
    },
  });

  const piojos = await prisma.event.upsert({
    where: { slug: "los-piojos-en-la-plata" },
    update: {},
    create: {
      slug: "los-piojos-en-la-plata",
      title: "Los Piojos en el Estadio Único",
      subtitle: "Estadio Único Diego Armando Maradona - La Plata",
      description:
        "El ritual más esperado del rock nacional. Salimos desde Córdoba con cena en parador, desayuno y traslado directo al estadio. No te quedes afuera del regreso histórico.",
      imageUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      categoryTag: "Rock Nacional",
      type: "EVENTO",
      date: new Date("2026-12-14T22:00:00Z"),
      departureTime: "22:00 (noche anterior)",
      departureLocation: "Terminal de Córdoba",
      venue: "Estadio Único de La Plata",
      city: "Córdoba",
      destinationCity: "La Plata",
      price: 85000,
      depositPrice: 35000,
      totalCapacity: 90,
      isFeatured: true,
      isActive: true,
      busType: "Doble piso Cama / Semicama",
      includes: JSON.stringify([
        "Viaje ida y vuelta en micro doble piso con WiFi",
        "Cena previa en Zombi's Rock Bar o parador",
        "Desayuno en ruta",
        "Bebidas y snacks durante el viaje",
        "Pasaje digital con QR",
      ]),
      pickupPoints: {
        create: [
          {
            name: "Córdoba Capital - Terminal T2",
            address: "Bv. Perón 380",
            time: "22:00",
            order: 1,
          },
          {
            name: "Villa María - Terminal de Ómnibus",
            address: "Av. Hipólito Yrigoyen",
            time: "23:45",
            order: 2,
          },
        ],
      },
    },
  });

  // 4. Turismo / Excursiones
  await prisma.event.upsert({
    where: { slug: "escapada-mar-del-plata" },
    update: {},
    create: {
      slug: "escapada-mar-del-plata",
      title: "Fin de Semana en Mar del Plata",
      subtitle: "3 días y 2 noches frente al mar",
      description:
        "Salida grupal con alojamiento incluido, traslados y excursión a las playas del sur. Salida viernes a la noche y regreso lunes por la mañana.",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      categoryTag: "Escapadas",
      type: "TURISMO",
      date: new Date("2027-01-15T21:00:00Z"),
      departureTime: "21:00",
      departureLocation: "Terminal de Córdoba",
      venue: "Hotel 3* céntrico c/ desayuno",
      city: "Córdoba",
      destinationCity: "Mar del Plata",
      price: 160000,
      depositPrice: 60000,
      totalCapacity: 45,
      isFeatured: true,
      isActive: true,
      busType: "Cama Suite",
      includes: JSON.stringify([
        "Transporte Cama ida y vuelta",
        "2 noches de hotel con desayuno",
        "Coordinador de grupo",
        "Excursión a playas del sur",
      ]),
    },
  });

  await prisma.event.upsert({
    where: { slug: "sierras-y-diques-cordoba" },
    update: {},
    create: {
      slug: "sierras-y-diques-cordoba",
      title: "Circuito Sierras Chicas & Dique San Roque",
      subtitle: "Excursión de día completo",
      description:
        "Recorrido panorámico por Río Ceballos, La Falda y el embalse del Dique San Roque con almuerzo serrano incluido y tiempo libre para pasear.",
      imageUrl:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      categoryTag: "Día de Campo",
      type: "TURISMO",
      date: new Date("2026-11-28T08:30:00Z"),
      departureTime: "08:30",
      departureLocation: "Patio Olmos",
      venue: "Sierras de Córdoba",
      city: "Córdoba",
      destinationCity: "Valle de Punilla",
      price: 42000,
      depositPrice: 20000,
      totalCapacity: 30,
      isFeatured: false,
      isActive: true,
      busType: "Minibus Ejecutivo",
      includes: JSON.stringify([
        "Traslado en minibus con aire acondicionado",
        "Guía turístico habilitado",
        "Almuerzo típico serrano con bebida",
      ]),
    },
  });

  // 5. Testimonios
  const countTestimonials = await prisma.testimonial.count();
  if (countTestimonials === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          text: "Fui solo a ver a Slayer y terminé el viaje con un grupo de amigos nuevos. Los coordinadores, unos genios.",
          authorName: "Diego M.",
          authorOrigin: "Movistar Arena",
          rating: 5,
          order: 1,
        },
        {
          text: "Me gané un sorteo en el viaje y encima el desayuno en la ruta estuvo buenísimo. Ya reservé para el próximo.",
          authorName: "Gabriela L.",
          authorOrigin: "Córdoba",
          rating: 5,
          order: 2,
        },
        {
          text: "Viajamos con amigos a ver a Iron Maiden en River. Todo impecable, llegaron a tiempo y la cena previa estuvo de 10.",
          authorName: "Lucas R.",
          authorOrigin: "Villa María",
          rating: 5,
          order: 3,
        },
        {
          text: "La tranquilidad de tener el asiento asignado y el pasaje con QR en el celu. No hay que imprimir nada. Muy recomendado.",
          authorName: "Sofía P.",
          authorOrigin: "Estadio Kempes",
          rating: 5,
          order: 4,
        },
      ],
    });
  }

  // 6. Demo Reservation
  const countReservations = await prisma.reservation.count();
  if (countReservations === 0) {
    await prisma.reservation.create({
      data: {
        ticketCode: "CT-DEMO-01",
        eventId: miloJ.id,
        customerName: "Juan Pérez",
        customerDni: "38920192",
        customerEmail: "juan.perez@example.com",
        customerPhone: "5493512345678",
        seatsCount: 2,
        seatType: "Semicama",
        assignedSeats: "14, 15",
        totalPrice: 70000,
        paidAmount: 70000,
        paymentMethod: "TRANSFERENCIA",
        paymentStatus: "PAGADO",
        status: "ACTIVA",
        notes: "Pasajeros confirmados con comprobante",
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
