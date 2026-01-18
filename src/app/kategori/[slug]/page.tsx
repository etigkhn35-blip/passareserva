"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

type Card = {
  id: string;
  title: string;
  location: string;
  price: number;
  cover?: string;
  category?: string;
  isFake: boolean;
};

const DEFAULT_IMAGES: Record<string, string> = {
  Otel: "/defaults/konaklama-otel.jpg",
  "Villa / Yazlık": "/defaults/konaklama-villa.jpg",
  "Airbnb & Booking Rezervasyonu": "/defaults/konaklama-airbnb.jpg",
  "Bungalow / Tiny House": "/defaults/konaklama-bungalow.jpg",
  "Dağ / Yayla Evi": "/defaults/konaklama-yayla.jpg",
  "Tatil Köyü": "/defaults/konaklama-tatilkoyu.jpg",
  "Apart / Rezidans": "/defaults/konaklama-apart.jpg",

  "Tekne / Yat Tatili": "/defaults/deneyim-tekne.jpg",
  "Cruise (Gemi Turu)": "/defaults/deneyim-gemi.jpg",
  "Kamp / Glamping": "/defaults/deneyim-kamp.jpg",
  "Wellness & Spa Tatili": "/defaults/deneyim-spa.jpg",
  "Yoga / Retreat": "/defaults/deneyim-yoga.jpg",
  "Gastronomi Tatili 🍷": "/defaults/deneyim-gastronomi.jpg",

  "Kültür Turları": "/defaults/tur-kultur.jpg",
  "Doğa & Trekking Turları": "/defaults/tur-doga.jpg",
  "Karadeniz / GAP Turları": "/defaults/tur-karadeniz-gap.jpg",
  "Kayak Turları": "/defaults/tur-kayak.jpg",
  "Günübirlik Turlar": "/defaults/tur-gunubirlik.jpg",
  "Balayı Turları": "/defaults/tur-balay.jpg",

  "Festival + Konaklama": "/defaults/etkinlik-festival.jpg",
  "Konser + Konaklama": "/defaults/etkinlik-konser.jpg",
  "Spor Etkinliği + Otel": "/defaults/etkinlik-spor.jpg",
  "Kültür & Sanat + Otel": "/defaults/etkinlik-kultur.jpg",
  "Workshop + Tatil": "/defaults/etkinlik-workshop.jpg",
    // 🎟️ Etkinlik Alt Kategorileri
  "Müzik Festivalleri": "/defaults/etkinlik-muzik-festivalleri.jpg",
  "Konserler": "/defaults/etkinlik-konserler.jpg",
  "DJ / Club Event": "/defaults/etkinlik-dj-club.jpg",
  "Açık Hava Etkinlikleri": "/defaults/etkinlik-acik-hava.jpg",

  "Sanat & Tasarım": "/defaults/etkinlik-sanat-tasarim.jpg",
  "Fotoğraf & Video": "/defaults/etkinlik-fotograf-video.jpg",
  "Gastronomi (şef workshop, tadım)": "/defaults/etkinlik-gastronomi-workshop.jpg",
  "Kişisel Gelişim": "/defaults/etkinlik-kisisel-gelisim.jpg",
  "Yoga & Meditasyon": "/defaults/etkinlik-yoga-meditasyon.jpg",

  "Futbol Maçları": "/defaults/etkinlik-futbol.jpg",
  "Basketbol / Voleybol": "/defaults/etkinlik-basketbol.jpg",
  "Tenis Turnuvaları": "/defaults/etkinlik-tenis.jpg",
  "Maraton / Koşu": "/defaults/etkinlik-maraton.jpg",
  "CrossFit / Fitness Event": "/defaults/etkinlik-crossfit.jpg",
  "Extreme Sports": "/defaults/etkinlik-extreme-sports.jpg",

  "Tiyatro": "/defaults/etkinlik-tiyatro.jpg",
  "Müzikal": "/defaults/etkinlik-muzikal.jpg",
  "Opera & Bale": "/defaults/etkinlik-opera-bale.jpg",
  "Stand-up": "/defaults/etkinlik-standup.jpg",
  "Gösteriler": "/defaults/etkinlik-gosteri.jpg",

  "Dalış / Yelken Eğitimi": "/defaults/etkinlik-dalis-yelken.jpg",
  "Gastronomi Deneyimi": "/defaults/etkinlik-gastronomi-deneyim.jpg",
  "Şarap Tadımı": "/defaults/etkinlik-sarap-tadimi.jpg",
  "Şehir Turları": "/defaults/etkinlik-sehir-turu.jpg",
  "Atölye Deneyimleri": "/defaults/etkinlik-atolye-deneyimi.jpg",

  "Çocuk Festivalleri": "/defaults/etkinlik-cocuk-festivali.jpg",
  "Atölyeler": "/defaults/etkinlik-cocuk-atolye.jpg",
  "Tema Park Biletleri": "/defaults/etkinlik-tema-park.jpg",
  "Çocuk Gösterileri": "/defaults/etkinlik-cocuk-gosteri.jpg",
  "Oyun Alanları": "/defaults/etkinlik-oyun-alani.jpg",

  "Konferans": "/defaults/etkinlik-konferans.jpg",
  "Zirve": "/defaults/etkinlik-zirve.jpg",
  "Fuar Girişleri": "/defaults/etkinlik-fuar.jpg",
  "Networking Event": "/defaults/etkinlik-networking.jpg",
  "Startup Etkinlikleri": "/defaults/etkinlik-startup.jpg",


  Genel: "/defaults/default.jpg",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [list, setList] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const decodedCategory = decodeURIComponent(slug as string);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "ilanlar"),
          where("status", "==", "approved"),
          where("altKategori", "==", decodedCategory),
          orderBy("olusturmaTarihi", "desc")
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((d) => {
          const doc = d.data() as any;

          const key = doc.altKategori || doc.kategori || "Genel";

          return {
            id: d.id,
            title: doc.baslik || "İsimsiz İlan",
            location: `${doc.il || ""} ${doc.ilce || ""}`.trim(),
            price: doc.ucret || 0,
            category: key, // ✅ BURASI DÜZELDİ
            cover: doc.coverUrl || DEFAULT_IMAGES[key] || DEFAULT_IMAGES["Genel"],
            isFake: false,
          } as Card;
        });

        if (data.length === 0) {
          const fake: Card = {
            id: "fake-" + decodedCategory,
            title: `${decodedCategory} – Örnek İlan`,
            location: "İstanbul / Beşiktaş",
            price: 4500,
            category: decodedCategory,
            cover: DEFAULT_IMAGES[decodedCategory] || DEFAULT_IMAGES["Genel"],
            isFake: true,
          };
          setList([fake]);
        } else {
          setList(data);
        }
      } catch (err) {
        console.error("Kategori ilanları yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decodedCategory]);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">
          🏷️ {decodedCategory} Kategorisindeki İlanlar
        </h1>

        {loading ? (
          <p className="text-gray-500 text-center py-10 animate-pulse">
            İlanlar yükleniyor...
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {list.map((v) => (
              <div
                key={v.id}
                className="group border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-100">
                  <img
                    src={v.cover || DEFAULT_IMAGES[v.category || "Genel"]}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />

                  {v.isFake === true && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                      Devredildi
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="text-sm text-gray-500">{v.location}</div>
                  <div className="font-semibold text-gray-900 mt-0.5 line-clamp-1">
                    {v.title}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-primary font-bold">
                      {v.price.toLocaleString("tr-TR")} ₺
                    </span>
                    <a
                      href={`/ilan/${v.id}`}
                      className="text-[13px] px-2.5 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      İncele
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
