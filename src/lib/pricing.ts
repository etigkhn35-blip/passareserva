// src/lib/pricing.ts

export const PRICING = {
  normal: {
    freeDays: 15,
    monthlyPrice: 350,
    boosts: {
      categoryFeatured: { price: 149, durationDays: 30, label: "Kategoride Öne Çıkar" },
      homeVitrin: { price: 299, durationDays: 30, label: "Ana Sayfa Vitrin" },
      boldTitle: { price: 99, durationDays: 30, label: "Kalın Punto" },
    },
  },
  event: {
    freeDays: 7,
    monthlyPrice: 150,
    boosts: {
      categoryFeatured: { price: 79, durationDays: 30, label: "Kategoride Öne Çıkar" },
      homeVitrin: { price: 149, durationDays: 30, label: "Ana Sayfa Vitrin" },
      boldTitle: { price: 49, durationDays: 30, label: "Kalın Punto" },
    },
  },
} as const;

export function isEventCategory(mainCategory?: string) {
  return mainCategory === "Etkinlik Paketleri";
}

export const EVENT_SUBCATEGORIES: Record<string, string[]> = {
  "Festival & Konser": [
    "Müzik Festivalleri",
    "Konserler",
    "DJ / Club Event",
    "Açık Hava Etkinlikleri",
  ],
  "Workshop & Eğitim": [
    "Sanat & Tasarım",
    "Fotoğraf & Video",
    "Gastronomi (şef workshop, tadım)",
    "Kişisel Gelişim",
    "Yoga & Meditasyon",
  ],
  "Spor Etkinlikleri": [
    "Futbol Maçları",
    "Basketbol / Voleybol",
    "Tenis Turnuvaları",
    "Maraton / Koşu",
    "CrossFit / Fitness Event",
    "Extreme Sports",
  ],
  "Sahne & Gösteri Sanatları": [
    "Tiyatro",
    "Müzikal",
    "Opera & Bale",
    "Stand-up",
    "Gösteriler",
  ],
  "Deneyim & Aktivite": [
    "Dalış / Yelken Eğitimi",
    "Gastronomi Deneyimi",
    "Şarap Tadımı",
    "Şehir Turları",
    "Atölye Deneyimleri",
  ],
  "Aile & Çocuk Etkinlikleri": [
    "Çocuk Festivalleri",
    "Atölyeler",
    "Tema Park Biletleri",
    "Gösteriler",
    "Oyun Alanları",
  ],
  "Business & Networking": [
    "Konferans",
    "Zirve",
    "Fuar Girişleri",
    "Networking Event",
    "Startup Etkinlikleri",
  ],
};
