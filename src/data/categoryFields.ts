export const CATEGORY_TREE = {
  en: {
    accommodation: {
      title: "Accommodation Listings",
      sections: [
        { title: "Hotels", key: "accommodation_hotels", sub: [] },
        { title: "Apartments & Holiday Rentals", key: "accommodation_apartments", sub: [] },
        { title: "Villas & Holiday Homes", key: "accommodation_villas", sub: [] },
        { title: "Resorts", key: "accommodation_resorts", sub: [] },
        { title: "Cabins & Chalets", key: "accommodation_cabins", sub: [] },
        { title: "Tiny Houses & Bungalows", key: "accommodation_tinyhouses", sub: [] },
        { title: "Beach Houses", key: "accommodation_beachhouses", sub: [] },
      ],
    },

    experience: {
      title: "Experience Holidays",
      sections: [
        { title: "Yacht & Sailing Holidays", key: "experience_yacht", sub: [] },
        { title: "Cruise Holidays", key: "experience_cruise", sub: [] },
        { title: "Camping & Glamping Trips", key: "experience_camping", sub: [] },
        { title: "Ski & Snow Holidays", key: "experience_ski", sub: [] },
        { title: "Surf & Adventure Camps", key: "experience_surf", sub: [] },
        { title: "Wellness & Spa Retreats", key: "experience_wellness", sub: [] },
        { title: "Yoga & Meditation Retreats", key: "experience_yoga", sub: [] },
        { title: "Wine & Gastronomy Trips", key: "experience_gastronomy", sub: [] },
      ],
    },

    tour: {
      title: "Tour Packages",
      sections: [
        { title: "Cultural Tours", key: "tour_cultural", sub: [] },
        { title: "Nature & Hiking Tours", key: "tour_nature", sub: [] },
        { title: "City Break Tours", key: "tour_city", sub: ["City tours"] },
        { title: "Ski Tours", key: "tour_ski", sub: [] },
        { title: "Honeymoon Packages", key: "tour_honeymoon", sub: [] },
        { title: "Photography Tours", key: "tour_photography", sub: [] },
        { title: "Day Trips & Excursions", key: "tour_daytrip", sub: [] },
      ],
    },

    events: {
      title: "Events",
      sections: [
        {
          title: "Festivals & Concerts",
          key: "event_festival",
          sub: ["Music Festivals", "Concerts"],
        },
        {
          title: "Workshops & Training",
          key: "event_workshop",
          sub: [],
        },
        {
          title: "Sports Events",
          key: "event_sports",
          sub: [],
        },
        {
          title: "Performing Arts & Shows",
          key: "event_show",
          sub: [],
        },
        {
          title: "Experiences & Activities",
          key: "event_activity",
          sub: ["Wine tasting", "City tours"],
        },
        {
          title: "Family & Kids Events",
          key: "event_family",
          sub: [],
        },
        {
          title: "Business & Networking Events",
          key: "event_business",
          sub: [],
        },
        {
          title: "Food & Wine Events",
          key: "event_food",
          sub: [],
        },
      ],
    },

    tickets: {
      title: "Travel Tickets & Passes",
      sections: [
        { title: "Museum & Attraction Tickets", key: "ticket_museum", sub: [] },
        { title: "Theme Park Tickets", key: "ticket_themepark", sub: [] },
        { title: "Train & Transport Passes", key: "ticket_transport", sub: [] },
        { title: "Guided Tour Tickets", key: "ticket_guided", sub: [] },
        { title: "City Passes", key: "ticket_citypass", sub: [] },
      ],
    },
  },

  pt: {
    accommodation: {
      title: "Acomodações",
      sections: [
        { title: "Hotéis", key: "accommodation_hotels", sub: [] },
        { title: "Apartamentos e Aluguéis de Férias", key: "accommodation_apartments", sub: [] },
        { title: "Vilas e Casas de Férias", key: "accommodation_villas", sub: [] },
        { title: "Resorts", key: "accommodation_resorts", sub: [] },
        { title: "Cabines e Chalés", key: "accommodation_cabins", sub: [] },
        { title: "Tiny Houses e Bungalows", key: "accommodation_tinyhouses", sub: [] },
        { title: "Casas de Praia", key: "accommodation_beachhouses", sub: [] },
      ],
    },

    experience: {
      title: "Experiências de Viagem",
      sections: [
        { title: "Férias de Iate e Vela", key: "experience_yacht", sub: [] },
        { title: "Cruzeiros", key: "experience_cruise", sub: [] },
        { title: "Camping e Glamping", key: "experience_camping", sub: [] },
        { title: "Férias de Esqui", key: "experience_ski", sub: [] },
        { title: "Surf e Aventura", key: "experience_surf", sub: [] },
        { title: "Bem-estar e Spa", key: "experience_wellness", sub: [] },
        { title: "Yoga e Meditação", key: "experience_yoga", sub: [] },
        { title: "Gastronomia e Vinhos", key: "experience_gastronomy", sub: [] },
      ],
    },

    tour: {
      title: "Pacotes de Tours",
      sections: [
        { title: "Tours Culturais", key: "tour_cultural", sub: [] },
        { title: "Tours de Natureza", key: "tour_nature", sub: [] },
        { title: "City Tours", key: "tour_city", sub: ["Passeios pela cidade"] },
        { title: "Tours de Esqui", key: "tour_ski", sub: [] },
        { title: "Lua de Mel", key: "tour_honeymoon", sub: [] },
        { title: "Tours de Fotografia", key: "tour_photography", sub: [] },
        { title: "Passeios de Um Dia", key: "tour_daytrip", sub: [] },
      ],
    },

    events: {
      title: "Eventos",
      sections: [
        {
          title: "Festivais e Concertos",
          key: "event_festival",
          sub: ["Festivais de Música", "Concertos"],
        },
        {
          title: "Workshops e Treinamentos",
          key: "event_workshop",
          sub: [],
        },
        {
          title: "Eventos Esportivos",
          key: "event_sports",
          sub: [],
        },
        {
          title: "Artes Cênicas e Shows",
          key: "event_show",
          sub: [],
        },
        {
          title: "Experiências e Atividades",
          key: "event_activity",
          sub: ["Degustação de vinho", "Passeios pela cidade"],
        },
        {
          title: "Eventos para Família e Crianças",
          key: "event_family",
          sub: [],
        },
        {
          title: "Eventos Corporativos",
          key: "event_business",
          sub: [],
        },
        {
          title: "Eventos Gastronômicos",
          key: "event_food",
          sub: [],
        },
      ],
    },

    tickets: {
      title: "Bilhetes e Passes",
      sections: [
        { title: "Museus e Atrações", key: "ticket_museum", sub: [] },
        { title: "Parques Temáticos", key: "ticket_themepark", sub: [] },
        { title: "Transporte", key: "ticket_transport", sub: [] },
        { title: "Tours Guiados", key: "ticket_guided", sub: [] },
        { title: "City Pass", key: "ticket_citypass", sub: [] },
      ],
    },
  },
};