export const CATEGORY_FIELDS: Record<
  string,
  {
    en: string[];
    pt: string[];
  }
> = {
  /* ----------------------------- ACCOMMODATION ----------------------------- */
  accommodation_hotels: {
    en: [
      "Hotel Name",
      "Room Type",
      "View Type",
      "Floor / Block",
      "Reservation Number",
      "Notes",
    ],
    pt: [
      "Nome do Hotel",
      "Tipo de Quarto",
      "Tipo de Vista",
      "Andar / Bloco",
      "Número da Reserva",
      "Notas",
    ],
  },

  accommodation_apartments: {
    en: [
      "Property Name",
      "Room Count",
      "Bathroom Count",
      "Size (m²)",
      "Location Notes",
    ],
    pt: [
      "Nome da Propriedade",
      "Número de Quartos",
      "Número de Banheiros",
      "Tamanho (m²)",
      "Notas de Localização",
    ],
  },

  accommodation_villas: {
    en: [
      "Villa Name",
      "Room Count",
      "Bathroom Count",
      "Size (m²)",
      "Location Notes",
    ],
    pt: [
      "Nome da Vila",
      "Número de Quartos",
      "Número de Banheiros",
      "Tamanho (m²)",
      "Notas de Localização",
    ],
  },

  accommodation_resorts: {
    en: ["Resort Name", "Block / Area", "Room Type"],
    pt: ["Nome do Resort", "Bloco / Área", "Tipo de Quarto"],
  },

  accommodation_cabins: {
    en: ["Property Name", "Type", "Capacity", "Heating / Cooling"],
    pt: ["Nome da Propriedade", "Tipo", "Capacidade", "Aquecimento / Arrefecimento"],
  },

  accommodation_tinyhouses: {
    en: ["Property Name", "Type", "Capacity", "Heating / Cooling"],
    pt: ["Nome da Propriedade", "Tipo", "Capacidade", "Aquecimento / Arrefecimento"],
  },

  accommodation_beachhouses: {
    en: ["Property Name", "Distance to Beach", "View Type"],
    pt: ["Nome da Propriedade", "Distância da Praia", "Tipo de Vista"],
  },

  /* ----------------------------- EXPERIENCE ----------------------------- */
  experience_yacht: {
    en: ["Boat / Yacht Name", "Departure Port", "Arrival Port", "Route"],
    pt: ["Nome do Barco / Iate", "Porto de Saída", "Porto de Chegada", "Rota"],
  },

  experience_cruise: {
    en: ["Ship Name", "Route", "Cabin Type", "Visa Status"],
    pt: ["Nome do Navio", "Rota", "Tipo de Cabine", "Status de Visto"],
  },

  experience_camping: {
    en: ["Camp Name", "Camp Type", "Equipment Notes"],
    pt: ["Nome do Acampamento", "Tipo de Acampamento", "Notas de Equipamento"],
  },

  experience_ski: {
    en: ["Ski Resort", "Equipment Status"],
    pt: ["Estação de Esqui", "Status do Equipamento"],
  },

  experience_surf: {
    en: ["Camp Name", "Activity Type", "Difficulty Level"],
    pt: ["Nome do Camp", "Tipo de Atividade", "Nível de Dificuldade"],
  },

  experience_wellness: {
    en: ["Program Name", "Package Details"],
    pt: ["Nome do Programa", "Detalhes do Pacote"],
  },

  experience_yoga: {
    en: ["Program Name", "Instructor / Group"],
    pt: ["Nome do Programa", "Instrutor / Grupo"],
  },

  experience_gastronomy: {
    en: ["Region / Route", "Chef / Restaurant Notes"],
    pt: ["Região / Rota", "Notas do Chef / Restaurante"],
  },

  /* ----------------------------- TOURS ----------------------------- */
  tour_cultural: {
    en: ["Tour Name", "Departure Location", "Duration (Days)"],
    pt: ["Nome do Tour", "Local de Saída", "Duração (Dias)"],
  },

  tour_nature: {
    en: ["Route", "Difficulty Level", "Duration (Days)"],
    pt: ["Rota", "Nível de Dificuldade", "Duração (Dias)"],
  },

  tour_city: {
    en: ["City / Route", "Departure Location", "Duration (Days)"],
    pt: ["Cidade / Rota", "Local de Saída", "Duração (Dias)"],
  },

  tour_ski: {
    en: ["Ski Resort", "Equipment Status"],
    pt: ["Estação de Esqui", "Status do Equipamento"],
  },

  tour_honeymoon: {
    en: ["Package Name", "Special Notes"],
    pt: ["Nome do Pacote", "Notas Especiais"],
  },

  tour_photography: {
    en: ["Location", "Theme"],
    pt: ["Localização", "Tema"],
  },

  tour_daytrip: {
    en: ["Route", "Departure Time"],
    pt: ["Rota", "Horário de Saída"],
  },

  /* ----------------------------- EVENTS ----------------------------- */
  event_festival: {
    en: ["Event Name", "City / Venue", "Ticket Type"],
    pt: ["Nome do Evento", "Cidade / Local", "Tipo de Bilhete"],
  },

  event_workshop: {
    en: ["Workshop Name", "Instructor", "Content"],
    pt: ["Nome do Workshop", "Instrutor", "Conteúdo"],
  },

  event_sports: {
    en: ["Event Name", "Seat / Category"],
    pt: ["Nome do Evento", "Assento / Categoria"],
  },

  event_show: {
    en: ["Show Name", "Venue"],
    pt: ["Nome do Show", "Local"],
  },

  event_activity: {
    en: ["Activity Name", "Details"],
    pt: ["Nome da Atividade", "Detalhes"],
  },

  event_family: {
    en: ["Event Name", "Age Range"],
    pt: ["Nome do Evento", "Faixa Etária"],
  },

  event_business: {
    en: ["Event Name", "Industry"],
    pt: ["Nome do Evento", "Setor"],
  },

  event_food: {
    en: ["Event Name", "Cuisine / Theme"],
    pt: ["Nome do Evento", "Culinária / Tema"],
  },

  /* ----------------------------- TICKETS ----------------------------- */
  ticket_museum: {
    en: ["Attraction Name", "Ticket Type"],
    pt: ["Nome da Atração", "Tipo de Bilhete"],
  },

  ticket_themepark: {
    en: ["Park Name", "Ticket Type"],
    pt: ["Nome do Parque", "Tipo de Bilhete"],
  },

  ticket_transport: {
    en: ["Route", "Transport Type"],
    pt: ["Rota", "Tipo de Transporte"],
  },

  ticket_guided: {
    en: ["Tour Name", "Guide Info"],
    pt: ["Nome do Tour", "Informação do Guia"],
  },

  ticket_citypass: {
    en: ["City", "Included Attractions"],
    pt: ["Cidade", "Atrações Incluídas"],
  },
};