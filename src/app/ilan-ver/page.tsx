"use client";
import { useLanguage } from "@/context/LanguageContext";
import { ilanVerTranslations } from "@/data/ilanVerTranslations";
import { useEffect, useMemo, useState } from "react";
import { auth, db, storage } from "@/lib/firebaseConfig";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { CATEGORY_FIELDS } from "@/data/categoryFields";
import { PRICING, isEventCategory, EVENT_SUBCATEGORIES } from "@/lib/pricing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ------------------------------ Helpers ------------------------------ */
const todayStr = () => new Date().toISOString().slice(0, 10);

const getCategoryKey = (category: string, subCategory: string) => {
  const map: Record<string, string> = {
    // ACCOMMODATION
    "Accommodation Listings > Hotels": "accommodation_hotels",
    "Accommodation Listings > Apartments & Holiday Rentals": "accommodation_apartments",
    "Accommodation Listings > Villas & Holiday Homes": "accommodation_villas",
    "Accommodation Listings > Resorts": "accommodation_resorts",
    "Accommodation Listings > Cabins & Chalets": "accommodation_cabins",
    "Accommodation Listings > Tiny Houses & Bungalows": "accommodation_tinyhouses",
    "Accommodation Listings > Beach Houses": "accommodation_beachhouses",

    // EXPERIENCE
    "Experience Holidays > Yacht & Sailing Holidays": "experience_yacht",
    "Experience Holidays > Cruise Holidays": "experience_cruise",
    "Experience Holidays > Camping & Glamping Trips": "experience_camping",
    "Experience Holidays > Ski & Snow Holidays": "experience_ski",
    "Experience Holidays > Surf & Adventure Camps": "experience_surf",
    "Experience Holidays > Wellness & Spa Retreats": "experience_wellness",
    "Experience Holidays > Yoga & Meditation Retreats": "experience_yoga",
    "Experience Holidays > Wine & Gastronomy Trips": "experience_gastronomy",

    // TOURS
    "Tour Packages > Cultural Tours": "tour_cultural",
    "Tour Packages > Nature & Hiking Tours": "tour_nature",
    "Tour Packages > City Break Tours": "tour_city",
    "Tour Packages > Ski Tours": "tour_ski",
    "Tour Packages > Honeymoon Packages": "tour_honeymoon",
    "Tour Packages > Photography Tours": "tour_photography",
    "Tour Packages > Day Trips & Excursions": "tour_daytrip",

    // EVENTS
    "Events > Festivals & Concerts": "event_festival",
    "Events > Workshops & Training": "event_workshop",
    "Events > Sports Events": "event_sports",
    "Events > Performing Arts & Shows": "event_show",
    "Events > Experiences & Activities": "event_activity",
    "Events > Family & Kids Events": "event_family",
    "Events > Business & Networking Events": "event_business",
    "Events > Food & Wine Events": "event_food",

    // TICKETS
    "Travel Tickets & Passes > Museum & Attraction Tickets": "ticket_museum",
    "Travel Tickets & Passes > Theme Park Tickets": "ticket_themepark",
    "Travel Tickets & Passes > Train & Transport Passes": "ticket_transport",
    "Travel Tickets & Passes > Guided Tour Tickets": "ticket_guided",
    "Travel Tickets & Passes > City Passes": "ticket_citypass",
  };

  return map[`${category} > ${subCategory}`] || "";
};


const formatIlanNo = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TD-${y}${m}${dd}-${rand}`;
};

const formatWithComma = (val: string) => {
  if (!val) return "";
  const num = Number(val.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US");
};

const onlyNumbers = (val: string) => val.replace(/[^0-9]/g, "");

const ErrorText = ({ msg }: { msg?: string }) =>
  msg ? <div className="mt-1 text-xs text-red-600 font-medium">{msg}</div> : null;

/* ------------------ Alt kategoriye göre görsel eşleştirme ------------------ */



  const getDefaultCover = (categoryKey: string) => {
  // ACCOMMODATION
  if (categoryKey.startsWith("accommodation")) {
    if (categoryKey.includes("villa")) return "/defaults/konaklama-villa.jpg";
    if (categoryKey.includes("hotels")) return "/defaults/konaklama-otel.jpg";
    if (categoryKey.includes("apartments")) return "/defaults/konaklama-apart.jpg";
    if (categoryKey.includes("tinyhouses")) return "/defaults/konaklama-bungalow.jpg";
    if (categoryKey.includes("cabins")) return "/defaults/konaklama-yayla.jpg";
    if (categoryKey.includes("beachhouses")) return "/defaults/konaklama-tatilkoyu.jpg";
    return "/defaults/konaklama-otel.jpg";
  }

  // EXPERIENCE
  if (categoryKey.startsWith("experience")) {
    if (categoryKey.includes("wellness")) return "/defaults/deneyim-spa.jpg";
    if (categoryKey.includes("camping")) return "/defaults/deneyim-kamp.jpg";
    if (categoryKey.includes("yacht")) return "/defaults/deneyim-tekne.jpg";
    if (categoryKey.includes("cruise")) return "/defaults/deneyim-gemi.jpg";
    if (categoryKey.includes("yoga")) return "/defaults/deneyim-yoga.jpg";
    if (categoryKey.includes("gastronomy")) return "/defaults/deneyim-gastronomi.jpg";
    return "/defaults/deneyim-genel.jpg";
  }

  // TOURS
  if (categoryKey.startsWith("tour")) {
    if (categoryKey.includes("cultural")) return "/defaults/tur-kultur.jpg";
    if (categoryKey.includes("nature")) return "/defaults/tur-doga.jpg";
    if (categoryKey.includes("ski")) return "/defaults/tur-kayak.jpg";
    if (categoryKey.includes("daytrip")) return "/defaults/tur-gunubirlik.jpg";
    if (categoryKey.includes("honeymoon")) return "/defaults/tur-balayi.jpg";
    return "/defaults/tur-genel.jpg";
  }

  // EVENTS
  if (categoryKey.startsWith("event")) {
    if (categoryKey.includes("festival")) return "/defaults/etkinlik-festival.jpg";
    if (categoryKey.includes("workshop")) return "/defaults/etkinlik-sanat-tasarim.jpg";
    if (categoryKey.includes("sports")) return "/defaults/etkinlik-futbol.jpg";
    if (categoryKey.includes("show")) return "/defaults/etkinlik-tiyatro.jpg";
    if (categoryKey.includes("activity")) return "/defaults/etkinlik-gosteri.jpg";
    if (categoryKey.includes("family")) return "/defaults/etkinlik-cocuk-festivali.jpg";
    if (categoryKey.includes("business")) return "/defaults/etkinlik-networking.jpg";
    if (categoryKey.includes("food")) return "/defaults/etkinlik-gastronomi-workshop.jpg";
    return "/defaults/etkinlik-festival.jpg";
  }

  // TICKETS
  if (categoryKey.startsWith("ticket")) {
    return "/defaults/tur-genel.jpg";
  }

  return "/defaults/default.jpg";
};

/* --------------------------- Kategori Yapısı -------------------------- */
const CATEGORIES: Record<string, string[]> = {
  Konaklama: [
    "Otel",
    "Villa / Yazlık",
    "Airbnb & Booking Rezervasyonu",
    "Bungalow / Tiny House",
    "Dağ / Yayla Evi",
    "Tatil Köyü",
    "Apart / Rezidans",
  ],
  "Deneyim Tatilleri": [
    "Tekne / Yat Tatili",
    "Cruise (Gemi Turu)",
    "Kamp / Glamping",
    "Wellness & Spa Tatili",
    "Yoga / Retreat",
    "Gastronomi Tatili",
  ],
  Turlar: [
    "Kültür Turları",
    "Doğa & Trekking Turları",
    "Karadeniz / GAP Turları",
    "Kayak Turları",
    "Günübirlik Turlar",
    "Balayı Turları",
  ],
  "Etkinlik Paketleri": [
    "Festival & Konser",
    "Workshop & Eğitim",
    "Spor Etkinlikleri",
    "Sahne & Gösteri Sanatları",
    "Deneyim & Aktivite",
    "Aile & Çocuk Etkinlikleri",
    "Business & Networking",
  ],
};

/* ----------------------------- Step UI ----------------------------- */
const STEPS = [
  { id: 1, title: "Kategori & Konum" },
  { id: 2, title: "Başlık & Açıklama" },
  { id: 3, title: "Detaylar" },
  { id: 4, title: "Medya & Fiyat" },
  { id: 5, title: "Önizleme" },
];

function StepHeader({
  step,
  setStep,
  maxStepReached,
}: {
  step: number;
  setStep: (n: number) => void;
  maxStepReached: number;
}) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-sm text-gray-500">
            Adım {step} / {STEPS.length}
          </div>
          <div className="text-lg font-bold">{STEPS[step - 1]?.title}</div>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          {STEPS.map((s, idx) => {
            const n = idx + 1;
            const clickable = n <= maxStepReached;
            const active = n === step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => clickable && setStep(n)}
                className={[
                  "px-3 py-2 rounded-xl border transition",
                  active ? "bg-gray-900 text-white border-gray-900" : "bg-white",
                  clickable ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed",
                ].join(" ")}
                disabled={!clickable}
                title={s.title}
              >
                {n}. {s.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gray-900" style={{ width: `${(step / STEPS.length) * 100}%` }} />
      </div>
    </div>
  );
}

/* ---------------------- Kategoriye göre placeholder ---------------------- */
function getTitlePlaceholder(category: string, subCategory: string, il: string) {
  const cityHint = il?.trim() ? `${il.trim()} ` : "";
  if (category === "Konaklama") {
    return `Örn: ${cityHint}${subCategory || "Otel"} - 5 Gece 2 Kişilik Rezervasyon Devri`;
  }
  if (category === "Turlar") {
    return `Örn: ${cityHint}${subCategory || "Kültür Turu"} - 2 Kişi / Transfer Dahil`;
  }
  if (category === "Deneyim Tatilleri") {
    return `Örn: ${cityHint}${subCategory || "Tekne Tatili"} - 3 Günlük Paket / 2 Kişi`;
  }
  if (category === "Etkinlik Paketleri") {
    return `Örn: ${cityHint}${subCategory || "Konser"} - 2 Bilet / Avantajlı Fiyat`;
  }
  return "Örn: İlan başlığınızı yazın";
}

function getDescPlaceholder(category: string) {
  if (category === "Konaklama") {
    return `• Otel/tesis adı, oda tipi, pansiyon tipi
• Rezervasyon detayları (tarih, kişi sayısı)
• Devir şartları (isim değişikliği, ek ücret vs.)
• Öne çıkan avantajlar`;
  }
  if (category === "Turlar") {
    return `• Tur programı (gün gün), dahil/haric
• Hareket/varış, transfer bilgisi
• Kişi sayısı ve paket kapsamı
• Devir şartları ve notlar`;
  }
  if (category === "Deneyim Tatilleri") {
    return `• Deneyimin kapsamı (tekne/kamp/spa vb.)
• Dahil olan hizmetler, süre, kişi sayısı
• Tarih/rezervasyon veya kupon koşulları
• Devir şartları ve notlar`;
  }
  if (category === "Etkinlik Paketleri") {
    return `• Etkinlik adı/konsept, mekan, şehir
• Bilet türü/koltuk bilgisi (varsa)
• Teslim/devir yöntemi (QR, isim değişikliği vb.)
• Önemli notlar (kurallar, giriş koşulları)`;
  }
  return "Detayları açıklayın...";
}

type ErrorMap = Record<string, string>;

export default function IlanVerPage() {
  const { lang } = useLanguage();
const t = ilanVerTranslations[lang];
  const router = useRouter();

  /* ---------- UI: uyarı popup (ekran ortası) ---------- */
  const [popup, setPopup] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const showPopup = (message: string) => {
    setPopup({ show: true, message });
    setTimeout(() => setPopup({ show: false, message: "" }), 3000);
  };

  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  // inline validation görünürlüğü
  const [showInlineErrors, setShowInlineErrors] = useState(false);
  const [errors, setErrors] = useState<ErrorMap>({});

  const [showPricing, setShowPricing] = useState(false);
  const [isFirstListing, setIsFirstListing] = useState(true);

  /* ------------------------------- State ------------------------------- */
  const [user, setUser] = useState<any>(auth.currentUser);

  const [il, setIl] = useState("");
  const [ilce, setIlce] = useState("");
  const [mahalle, setMahalle] = useState("");

  // Kategoriler
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subOptions, setSubOptions] = useState<string[]>([]);
  const [eventMainCategory, setEventMainCategory] = useState("");

  const isEvent = isEventCategory(category);
  const plan = isEvent ? PRICING.event : PRICING.normal;

  // Genel alanlar
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [orjinalFiyat, setOrjinalFiyat] = useState("");
  const [price, setPrice] = useState("");

  // Konaklama/Tur/Deneyim: Tarih & kişi
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Etkinlik: tarih / saat / mekan
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [venueName, setVenueName] = useState("");

  // Etkinlik: bilet detayları (yeni)
  const [ticketCount, setTicketCount] = useState<number>(2);
  const [ticketType, setTicketType] = useState<string>("");
  const [seatInfo, setSeatInfo] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<string>("");

  // Oda tipi
  const [odaTipi, setOdaTipi] = useState<string>("");
  const ODA_TIPLERI = [
    "Standart Oda",
    "Deluxe Oda",
    "Aile Odası",
    "Suit",
    "King Suit",
    "Bungalow",
    "Villa",
    "Tiny House",
  ];

  // Dosyalar + önizleme
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [reservationFile, setReservationFile] = useState<File | null>(null);
  const [reservationPreview, setReservationPreview] = useState<string | null>(null);

  // Dinamik alanlar
  const [ozelAlanlar, setOzelAlanlar] = useState<Record<string, string>>({});

  // Konaklama: pansiyon + donanımlar
  const [pansiyonTipi, setPansiyonTipi] = useState<
    | "Tam Pansiyon"
    | "Yarım Pansiyon"
    | "Oda Kahvaltı"
    | "Her Şey Dahil"
    | "Ultra Her Şey Dahil"
    | "Sadece Oda"
    | ""
  >("");

  const [donanimlar, setDonanimlar] = useState<Record<string, boolean>>({
    tv: false,
    minibar: false,
    klima: false,
    havuz: false,
    spa: false,
    kahvaltiDahil: false,
    denizManzarasi: false,
    balkon: false,
    wifi: false,
    otopark: false,
    resepsiyon24: false,
    odaServisi: false,
    fitness: false,
    hamam: false,
    sauna: false,
    plajaYakin: false,
    engelliErisimi: false,
    sicakSu: false,
    mutfak: false,
    camasirMakinesi: false,
    klimaMerkezi: false,
  });

  // Upsell + KVKK
  const [oneCikar, setOneCikar] = useState(false);
  const [vitrin, setVitrin] = useState(false);
  const [kalinYazi, setKalinYazi] = useState(false);
  const [kvkkOnay, setKvkkOnay] = useState(false);

  const boostCategoryFeatured = plan.boosts.categoryFeatured.price;
  const boostHomeVitrin = plan.boosts.homeVitrin.price;
  const boostBoldTitle = plan.boosts.boldTitle.price;

  // KVKK / Koşullar modal
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<"terms" | "kvkk">("terms");

  const [submitting, setSubmitting] = useState(false);

  /* ------------------------------ Effects ------------------------------ */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else router.push("/giris");
    });
    return () => unsubscribe();
  }, [router]);

  /* 🟦 Kullanıcının ilk ilanı mı? */
  useEffect(() => {
    if (!user?.uid) return;

    const checkFirstListing = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const used = userSnap.exists() ? Boolean(userSnap.data()?.ilkIlanKullanildi) : false;
        setIsFirstListing(!used);
      } catch (err) {
        console.error("ilk ilan kontrol hatası:", err);
        setIsFirstListing(false);
      }
    };

    checkFirstListing();
  }, [user]);

  /* Alt kategori seçenekleri */
  useEffect(() => {
    if (category !== "Etkinlik Paketleri") {
      setSubOptions(category ? CATEGORIES[category] : []);
      setSubCategory("");
      setEventMainCategory("");
      return;
    }

    if (!eventMainCategory) {
      setSubOptions([]);
      setSubCategory("");
      return;
    }

    setSubOptions(EVENT_SUBCATEGORIES[eventMainCategory] || []);
    setSubCategory("");
  }, [category, eventMainCategory]);

  // Etkinlik seçilince konaklama/tur tarih alanlarını temizle (karışmasın)
  useEffect(() => {
    if (!isEvent) return;
    setCheckIn("");
    setCheckOut("");
    setAdults(2);
    setChildren(0);
    setPansiyonTipi("");
    setOdaTipi("");
  }, [isEvent]);

  /* Kaç gece (eventte kullanılmayacak) */
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const a = new Date(checkIn).getTime();
    const b = new Date(checkOut).getTime();
    return Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  /* ----------------------------- Handlers ----------------------------- */
  const onCoverChange = (f: File | null) => {
    setCoverFile(f);
    if (!f) return setCoverPreview(null);
    const r = new FileReader();
    r.onload = () => setCoverPreview(String(r.result));
    r.readAsDataURL(f);
  };

  const onReservationChange = (f: File | null) => {
    setReservationFile(f);
    if (!f) return setReservationPreview(null);
    const isImage = f.type.startsWith("image/");
    if (!isImage) setReservationPreview("PDF_SELECTED");
    else {
      const r = new FileReader();
      r.onload = () => setReservationPreview(String(r.result));
      r.readAsDataURL(f);
    }
  };

  /* ----------------------- Kategoriye Özel Alanlar ---------------------- */
  const categoryKey = getCategoryKey(category, subCategory);
 const metaFieldsRaw = CATEGORY_FIELDS[categoryKey]?.[lang] || [];
  const metaFields = metaFieldsRaw.filter((label: string) => {
    const normalized = label.trim().toLowerCase();
    return normalized !== "not" && normalized !== "kat/blok" && normalized !== "kat" && normalized !== "blok";
  });

  const OdaTipiFieldInMeta =
    category === "Konaklama" ? (
      <div>
        <label className="block text-sm font-semibold mb-1">
          Oda Tipi <span className="text-red-600">*</span>
        </label>
        <select value={odaTipi} onChange={(e) => setOdaTipi(e.target.value)} className="w-full border rounded-lg px-3 py-2">
          <option value="">Seçiniz</option>
          {ODA_TIPLERI.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ErrorText msg={showInlineErrors ? errors.odaTipi : ""} />
      </div>
    ) : null;

  const KonaklamaEkleri =
    category === "Konaklama" ? (
      <section className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Pansiyon Tipi <span className="text-red-600">*</span>
          </label>
          <select
            value={pansiyonTipi}
            onChange={(e) => setPansiyonTipi(e.target.value as any)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Seçiniz</option>
            <option value="Tam Pansiyon">Tam Pansiyon</option>
            <option value="Yarım Pansiyon">Yarım Pansiyon</option>
            <option value="Oda Kahvaltı">Oda Kahvaltı</option>
            <option value="Her Şey Dahil">Her Şey Dahil</option>
            <option value="Ultra Her Şey Dahil">Ultra Her Şey Dahil</option>
            <option value="Sadece Oda">Sadece Oda</option>
          </select>
          <ErrorText msg={showInlineErrors ? errors.pansiyonTipi : ""} />
        </div>

        {!isEvent && (
          <div>
            <label className="block text-sm font-semibold mb-2">Oda/Tesis Donanımları</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {[
                ["tv", "TV"],
                ["minibar", "Mini Buzdolabı"],
                ["klima", "Klima"],
                ["havuz", "Havuz"],
                ["spa", "SPA"],
                ["kahvaltiDahil", "Kahvaltı Dahil"],
                ["denizManzarasi", "Deniz Manzarası"],
                ["balkon", "Balkon"],
                ["wifi", "WiFi"],
                ["otopark", "Otopark"],
                ["resepsiyon24", "7/24 Resepsiyon"],
                ["odaServisi", "Oda Servisi"],
                ["fitness", "Fitness"],
                ["hamam", "Türk Hamamı"],
                ["sauna", "Sauna"],
                ["plajaYakin", "Plaja Yakın"],
                ["engelliErisimi", "Engelli Erişimi"],
                ["sicakSu", "Sürekli Sıcak Su"],
                ["mutfak", "Mutfak"],
                ["camasirMakinesi", "Çamaşır Makinesi"],
                ["klimaMerkezi", "Merkezi Klima"],
              ].map(([k, label]) => (
                <label key={String(k)} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!donanimlar[String(k)]}
                    onChange={() => setDonanimlar((p) => ({ ...p, [String(k)]: !p[String(k)] }))}
                  />
                  {label as string}
                </label>
              ))}
            </div>
          </div>
        )}
      </section>
    ) : null;

  /* --------------------------- KVKK / TERMS MODAL --------------------------- */
  const PolicyModal = () =>
    !policyOpen ? null : (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setPolicyOpen(false)} />
        <div className="relative bg-white w-[min(92vw,800px)] max-h-[80vh] rounded-2xl shadow-xl border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                  policyTab === "terms" ? "bg-gray-900 text-white" : "bg-white border"
                }`}
                onClick={() => setPolicyTab("terms")}
              >
                Kullanım Koşulları
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                  policyTab === "kvkk" ? "bg-gray-900 text-white" : "bg-white border"
                }`}
                onClick={() => setPolicyTab("kvkk")}
              >
                KVKK Aydınlatma
              </button>
            </div>
            <button
              className="text-gray-600 hover:text-gray-900 text-xl leading-none px-2"
              onClick={() => setPolicyOpen(false)}
              aria-label="Kapat"
            >
              ×
            </button>
          </div>

          <div className="p-5 overflow-auto text-sm leading-6 space-y-4">
            {policyTab === "terms" ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">Kullanım Koşulları</h3>
                <p>
                  Bu platformu kullanarak <b>Kullanım Koşulları</b>’nı kabul etmiş olursunuz. İlan içerikleri
                  kullanıcılar tarafından oluşturulur; ilan doğrulaması yapılana kadar yayımlanmaz.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>İlan veren; bilgilerin doğruluğundan ve güncelliğinden sorumludur.</li>
                  <li>Hakaret, nefret söylemi ve yasa dışı içerik yasaktır.</li>
                  <li>Ödeme ve iade süreçleri ilan açıklamasında belirtilir.</li>
                </ul>
                <p>
                  Detaylar için{" "}
                  <a href="/kullanim-kosullari" className="text-primary underline">
                    Kullanım Koşulları
                  </a>{" "}
                  sayfasını ziyaret edebilirsiniz.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">KVKK Aydınlatma Metni</h3>
                <p>
                  6698 sayılı KVKK kapsamında; kimlik, iletişim, rezervasyon belgesi gibi verileriniz hizmetin
                  sunulması ve doğrulama amaçlarıyla işlenebilir.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Veri sorumlusu: tatilinidevret.com</li>
                  <li>İşleme amaçları: üyelik, ilan doğrulama, müşteri desteği, güvenlik</li>
                  <li>Haklarınız: başvuru, düzeltme, silme, itiraz</li>
                </ul>
                <p>
                  Detaylar için{" "}
                  <a href="/kvkk" className="text-primary underline">
                    KVKK Aydınlatma
                  </a>{" "}
                  sayfasını ziyaret edebilirsiniz.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t bg-gray-50">
            <button className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => setPolicyOpen(false)}>
              Kapat
            </button>
          </div>
        </div>
      </div>
    );

  /* ----------------------------- Validation (INLINE) ----------------------------- */
  const getErrorsForStep = (s: number): ErrorMap => {
    const e: ErrorMap = {};

    // STEP 1
    if (s === 1) {
      if (!il.trim()) e.il = "İl zorunludur.";
      if (!ilce.trim()) e.ilce = "İlçe zorunludur.";
      if (!mahalle.trim()) e.mahalle = "Mahalle / Semt zorunludur.";
      if (!category) e.category = "Ana kategori seçiniz.";
      if (category === "Etkinlik Paketleri" && !eventMainCategory) e.eventMainCategory = "Etkinlik üst kategorisi seçiniz.";
      if (!subCategory) e.subCategory = "Alt kategori seçiniz.";
      return e;
    }

    // STEP 2
    if (s === 2) {
      if (title.trim().length < 6) e.title = "Başlık en az 6 karakter olmalı.";
      if (desc.trim().length < 10) e.desc = "Açıklama en az 10 karakter olmalı.";
      return e;
    }

    // STEP 3
    if (s === 3) {
      if (isEvent) {
        if (!eventDate) e.eventDate = "Etkinlik tarihi seçiniz.";
        if (!venueName.trim()) e.venueName = "Mekan adı zorunludur.";
        if (eventStartTime && !eventEndTime) e.eventEndTime = "Bitiş saatini seçin.";
        if (!ticketCount || ticketCount < 1) e.ticketCount = "Bilet adedi en az 1 olmalı.";
        if (!ticketType.trim()) e.ticketType = "Bilet türü yazın (örn: Genel Giriş / VIP).";
        if (!deliveryMethod.trim()) e.deliveryMethod = "Teslim/devir yöntemi yazın (örn: QR / isim değişikliği).";
        // seatInfo opsiyonel
      } else {
        if (!checkIn) e.checkIn = "Giriş tarihi seçiniz.";
        if (!checkOut) e.checkOut = "Çıkış tarihi seçiniz.";
        if (checkIn && checkOut && nights <= 0) e.checkOut = "Çıkış tarihi girişten sonra olmalı.";
        if (category === "Konaklama" && !pansiyonTipi) e.pansiyonTipi = "Pansiyon tipi seçiniz.";
        if (category === "Konaklama" && !odaTipi) e.odaTipi = "Oda tipi seçiniz.";
      }
      return e;
    }

    // STEP 4
    if (s === 4) {
      const o = Number(orjinalFiyat || 0);
      const p = Number(price || 0);

      if (!reservationFile) e.reservationFile = "Belge yüklemek zorunludur.";
      if (!orjinalFiyat || o <= 0) e.orjinalFiyat = "Orijinal fiyat zorunludur.";
      if (!price || p <= 0) e.price = "Satış fiyatı zorunludur.";
      if (o > 0 && p > o) e.price = "Satış fiyatı orijinal fiyattan büyük olamaz.";
      if (!kvkkOnay) e.kvkkOnay = "Devam etmek için KVKK onayı gereklidir.";
      return e;
    }

    return e;
  };

  const recomputeErrorsIfNeeded = () => {
    if (!showInlineErrors) return;
    setErrors(getErrorsForStep(step));
  };

  useEffect(() => {
    // step değişince (ve kullanıcı hata görüyorsa) güncelle
    if (showInlineErrors) setErrors(getErrorsForStep(step));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* --------------------------- Preview Calculations --------------------------- */
  const discountInfo = useMemo(() => {
    const o = Number(orjinalFiyat || 0);
    const s = Number(price || 0);
    if (!o || !s) return { pct: 0, label: "" };
    const pct = Math.round(((o - s) / o) * 100);
    let label = "";
    if (pct >= 40) label = "Efsane İlanlar (≥%40 indirim)";
    else if (pct >= 30) label = "Muhteşem İlanlar (%30–%40 indirim)";
    return { pct, label };
  }, [orjinalFiyat, price]);

  const cartTotals = useMemo(() => {
    const base = isFirstListing ? 0 : 350;
    const extra =
      (oneCikar ? boostCategoryFeatured : 0) + (vitrin ? boostHomeVitrin : 0) + (kalinYazi ? boostBoldTitle : 0);

    const needsPayment = oneCikar || vitrin || kalinYazi || !isFirstListing;
    const subtotal = needsPayment ? base + extra : 0;
    const kdv = subtotal * 0.2;
    const total = subtotal + kdv;

    return { needsPayment, base, extra, subtotal, kdv, total };
  }, [isFirstListing, oneCikar, vitrin, kalinYazi, boostCategoryFeatured, boostHomeVitrin, boostBoldTitle]);

  /* ----------------------------- Step Actions ----------------------------- */
  const goNext = () => {
    setShowInlineErrors(true);

    const stepErr = getErrorsForStep(step);
    setErrors(stepErr);

    if (Object.keys(stepErr).length > 0) {
      showPopup("⚠️ Lütfen işaretli alanları kontrol edin.");
      return;
    }

    const next = Math.min(STEPS.length, step + 1);
    setStep(next);
    setMaxStepReached((p) => Math.max(p, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    const prev = Math.max(1, step - 1);
    setStep(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ------------------------------- Submit (Final) ------------------------------ */
  const handleFinalSubmit = async () => {
    setShowInlineErrors(true);

    

    // tüm adımları tek tek kontrol et
    const allSteps = [1, 2, 3, 4];
    for (const s of allSteps) {
      const e = getErrorsForStep(s);
      if (Object.keys(e).length > 0) {
        setStep(s);
        setMaxStepReached((p) => Math.max(p, s));
        setErrors(e);
        showPopup("⚠️ Eksik alanlar var. Lütfen düzeltip tekrar deneyin.");
        return;
      }
    }
    

    setSubmitting(true);
    

    try {
      const ilanNo = formatIlanNo();

      // Kapak (opsiyonel)
      let coverUrl: string | null = null;
      if (coverFile) {
        const uid = user?.uid || "anon";
        const timestamp = Date.now();
        const refC = ref(storage, `covers/${uid}/${ilanNo}/${timestamp}_${coverFile.name}`);
        await uploadBytes(refC, coverFile);
        coverUrl = await getDownloadURL(refC);
      }

    

      // Belge (zorunlu)
      let reservationUrl: string | null = null;
      if (reservationFile) {
        const uid = user?.uid || "anon";
        const timestamp = Date.now();
        const safeName = (reservationFile.name || "document").replace(/\s+/g, "_");
        const refV = ref(storage, `docs/${uid}/${ilanNo}/${timestamp}_${safeName}`);
        await uploadBytes(refV, reservationFile);
        reservationUrl = await getDownloadURL(refV);
      }

      const eventKey =
  category === "Etkinlik Paketleri"
    ? `${eventMainCategory} ${subCategory}`.trim()
    : subCategory;

// Tek ve tek autoCoverUrl tanımı ✅
const autoCoverUrl = coverUrl ?? getDefaultCover(categoryKey);
      // paket süresi

      const days = isFirstListing ? 15 : 30;
      const endDate = Timestamp.fromDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));

      const payload: any = {
        ilanNo,
        adSoyad: user?.displayName || "Bilinmiyor",
        sahipUid: user?.uid || null,
        sahipEmail: user?.email || null,

        baslik: title.trim(),
        aciklama: desc.trim(),

        kategori: category,
        ustKategori: category === "Etkinlik Paketleri" ? eventMainCategory : category,
        altKategori: subCategory,
        eventMainCategory: category === "Etkinlik Paketleri" ? eventMainCategory : "",

        il: il.trim(),
        ilce: ilce.trim(),
        mahalle: mahalle.trim(),

        // fiyat
        ucret: Number(price),
        orjinalFiyat: Number(orjinalFiyat) || null,

        // medya
       coverUrl: autoCoverUrl,
       cover: autoCoverUrl,        // ✅ EKLE (çok kritik)
       pdfUrl: reservationUrl,

        // dinamik
        ozelAlanlar,

        // görünürlük
        oneCikar,
        vitrin,
        kalinYazi,

        kvkkOnay: Boolean(kvkkOnay),


        // ilan tipi / yayın süresi
        isFirstListing,
        listingDurationDays: days,

        // ödeme alanları (admin paneli bunları okuyacak)
        paymentStatus: isFirstListing ? "free" : "unpaid",
        paymentMode: isFirstListing ? "free" : null,

        paymentAmount: 0,
        vitrinPaymentAmount: 0,
        oneCikarPaymentAmount: 0,
        uzatmaPaymentAmount: 0,
        totalPaidAmount: 0,

        paymentAt: null,
        paymentExtendAt: null,
        status: isFirstListing ? "pending" : "payment_pending",
        baslangicTarihi: Timestamp.now(),
        olusturmaTarihi: serverTimestamp(),
        bitisTarihi: endDate,
        paketTipi: isFirstListing ? "free" : "standard",

      };

      if (isEvent) {
        payload.etkinlikTarihi = eventDate;
        payload.baslangicSaati = eventStartTime || "";
        payload.bitisSaati = eventEndTime || "";
        payload.mekanAdi = venueName.trim();

        payload.biletAdedi = Number(ticketCount) || 1;
        payload.biletTuru = ticketType.trim();
        payload.oturmaBilgisi = seatInfo.trim();
        payload.teslimYontemi = deliveryMethod.trim();

        // eski alanlar kırılmasın
        payload.girisTarihi = "";
        payload.cikisTarihi = "";
        payload.geceSayisi = 0;
        payload.yetiskinSayisi = 0;
        payload.cocukSayisi = 0;
        payload.pansiyonTipi = "";
        payload.odaTipi = "";
        payload.donanimlar = {};
      } else {
        payload.girisTarihi = checkIn;
        payload.cikisTarihi = checkOut;
        payload.geceSayisi = nights;
        payload.yetiskinSayisi = adults;
        payload.cocukSayisi = children;

        payload.pansiyonTipi = category === "Konaklama" ? pansiyonTipi : "";
        payload.odaTipi = category === "Konaklama" ? odaTipi : "";
        payload.donanimlar = category === "Konaklama" ? donanimlar : {};
      }

      // ✅ DEBUG (geçici): Kaydedilen kategori / alt kategori ve seçilen otomatik görsel
console.log("KAYIT:", { category, eventMainCategory, subCategory });
console.log("PAYLOAD.kategori/altKategori:", {
  kategori: payload?.kategori,
  altKategori: payload?.altKategori,
});
console.log("COVER URL:", payload?.coverUrl);



const docRef = await addDoc(collection(db, "ilanlar"), payload);

      if (isFirstListing && user?.uid) {
        await setDoc(doc(db, "users", user.uid), { ilkIlanKullanildi: true }, { merge: true });
      }

     // Ödeme gerektiriyorsa yönlendir
if (cartTotals.needsPayment) {
  await setDoc(
    doc(db, "ilanlar", docRef.id),
    {
      paymentAmount: cartTotals.base,
      vitrinPaymentAmount: vitrin ? boostHomeVitrin : 0,
      oneCikarPaymentAmount: oneCikar ? boostCategoryFeatured : 0,

      // kalın yazı ücretini şimdilik toplam içinde tutuyoruz
      totalPaidAmount: cartTotals.total,

      paymentStatus: "pending",
      paymentMode: "publish",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  router.push(`/odeme/yeni-ilan/${docRef.id}`);
  return;
}

showPopup("✅ İlanınız alındı. Kısa süre içinde incelenip yayına alınacaktır.");
setTimeout(() => router.push("/"), 800);
    } catch (err) {
      console.error(err);
      showPopup("❌ Hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------- Sticky Summary --------------------------- */
 const summaryKey =
  category === "Etkinlik Paketleri"
    ? `${eventMainCategory} ${subCategory}`.trim()
    : subCategory;

const summaryCover = coverPreview || getDefaultCover(categoryKey);
  const hasReservation = !!reservationFile;

  const StickySummary = () => (
    <aside className="md:sticky md:top-24 space-y-3">
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="font-bold">🧾 İlan Özeti</div>
          <div className="text-xs text-gray-500"></div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-3 items-start">
            <div className="w-20 h-16 rounded-xl overflow-hidden border bg-gray-100 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={summaryCover} alt="Kapak" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Başlık</div>
              <div className="font-semibold leading-snug break-words">
                {title?.trim() ? title.trim() : <span className="text-gray-400">Henüz girilmedi</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="border rounded-xl p-3">
              <div className="text-xs text-gray-500">Kategori</div>
              <div className="font-semibold">
                {category ? category : <span className="text-gray-400">—</span>}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {subCategory ? subCategory : <span className="text-gray-400">Alt kategori</span>}
              </div>
            </div>

            <div className="border rounded-xl p-3">
              <div className="text-xs text-gray-500">Konum</div>
              <div className="font-semibold">
                {il?.trim() ? il.trim() : <span className="text-gray-400">İl</span>}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {ilce?.trim() ? ilce.trim() : <span className="text-gray-400">İlçe</span>}
                {" · "}
                {mahalle?.trim() ? mahalle.trim() : <span className="text-gray-400">Mahalle</span>}
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-3 text-sm">
            <div className="text-xs text-gray-500">{isEvent ? "Etkinlik" : "Tarih / Kişi"}</div>
            {isEvent ? (
              <div className="mt-1">
                <div className="font-semibold">
                  {eventDate || <span className="text-gray-400">Tarih</span>}
                  {eventStartTime || eventEndTime ? (
                    <span className="text-gray-600 font-medium">
                      {" "}
                      ({eventStartTime || "--:--"} - {eventEndTime || "--:--"})
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Mekan: {venueName?.trim() ? venueName.trim() : <span className="text-gray-400">—</span>}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Bilet: <b>{ticketCount || 0}</b> · {ticketType?.trim() ? ticketType.trim() : <span className="text-gray-400">Tür</span>}
                </div>
              </div>
            ) : (
              <div className="mt-1">
                <div className="font-semibold">
                  {checkIn && checkOut ? `${checkIn} → ${checkOut}` : <span className="text-gray-400">Tarih seçilmedi</span>}
                  {checkIn && checkOut ? <span className="text-gray-600 font-medium"> ({nights} gece)</span> : null}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {adults} yetişkin · {children} çocuk
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-xl p-3">
              <div className="text-xs text-gray-500">Orijinal</div>
              <div className="font-bold">{orjinalFiyat ? `${formatWithComma(orjinalFiyat)} ₺` : <span className="text-gray-400">—</span>}</div>
            </div>
            <div className="border rounded-xl p-3">
              <div className="text-xs text-gray-500">Satış</div>
              <div className="font-bold">{price ? `${formatWithComma(price)} ₺` : <span className="text-gray-400">—</span>}</div>
              <div className="text-xs text-gray-500 mt-1">
                İndirim: <b>%{discountInfo.pct || 0}</b>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Belge</span>
              <span className={hasReservation ? "text-emerald-700 font-semibold" : "text-red-600 font-semibold"}>
                {hasReservation ? "Yüklendi" : "Eksik"}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {reservationFile?.name ? reservationFile.name : "PDF/JPG yüklenmeli"}
            </div>
          </div>

          <div className="border rounded-xl p-3 text-sm bg-gray-50">
            <div className="font-semibold mb-1">Ödeme</div>
            {cartTotals.needsPayment ? (
              <div className="space-y-1">
                <div className="text-xs text-gray-600">KDV dahil toplam</div>
                <div className="text-lg font-bold text-blue-700">{cartTotals.total.toFixed(2)} ₺</div>
              </div>
            ) : (
              <div className="text-emerald-700 font-semibold">İlk ilan ücretsiz</div>
            )}
          </div>

          <div className="rounded-xl border bg-emerald-50 p-3 text-xs text-emerald-900">
            <b>Bilgilendirme:</b> İlanınız kaydedildikten sonra incelemeye alınır ve onaydan sonra yayına alınır.
          </div>
        </div>
      </div>
    </aside>
  );

  /* --------------------------------- UI -------------------------------- */
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">📝 {t.pageTitle}</h1>

          <StepHeader step={step} setStep={setStep} maxStepReached={maxStepReached} />

          {/* 2 kolon layout */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-start">
            {/* SOL: Form */}
            <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-6">
              {/* Kullanıcı */}
              <div>
                <label className="block font-semibold mb-1">Ad Soyad / Firma Adı</label>
                <input value={user?.displayName || ""} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-100" />
              </div>

              {/* ------------------ STEP 1 ------------------ */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">
                        {t.city} <span className="text-red-600">*</span>
                      </label>
                      <input
                        value={il}
                        onChange={(e) => { setIl(e.target.value); recomputeErrorsIfNeeded(); }}
                        placeholder="Örn: İzmir"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                      <ErrorText msg={showInlineErrors ? errors.il : ""} />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">
                        İlçe <span className="text-red-600">*</span>
                      </label>
                      <input
                        value={ilce}
                        onChange={(e) => { setIlce(e.target.value); recomputeErrorsIfNeeded(); }}
                        placeholder="Örn: Konak"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                      <ErrorText msg={showInlineErrors ? errors.ilce : ""} />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">
                        Mahalle / Semt <span className="text-red-600">*</span>
                      </label>
                      <input
                        value={mahalle}
                        onChange={(e) => { setMahalle(e.target.value); recomputeErrorsIfNeeded(); }}
                        placeholder="Örn: Alsancak"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                      <ErrorText msg={showInlineErrors ? errors.mahalle : ""} />
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 gap-4 ${category === "Etkinlik Paketleri" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                    <div>
                      <label className="block font-semibold mb-1">
                        Ana Kategori <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setEventMainCategory("");
                          setSubCategory("");
                          setShowInlineErrors(false);
                          setErrors({});
                        }}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">Seçiniz</option>
                        {Object.keys(CATEGORIES).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ErrorText msg={showInlineErrors ? errors.category : ""} />
                    </div>

                    {category === "Etkinlik Paketleri" && (
                      <div>
                        <label className="block font-semibold mb-1">
                          Etkinlik Üst Kategorisi <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={eventMainCategory}
                          onChange={(e) => { setEventMainCategory(e.target.value); setSubCategory(""); recomputeErrorsIfNeeded(); }}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value="">Seçiniz</option>
                          <option value="Festival & Konser">Festival & Konser</option>
                          <option value="Workshop & Eğitim">Workshop & Eğitim</option>
                          <option value="Spor Etkinlikleri">Spor Etkinlikleri</option>
                          <option value="Sahne & Gösteri Sanatları">Sahne & Gösteri Sanatları</option>
                          <option value="Deneyim & Aktivite">Deneyim & Aktivite</option>
                          <option value="Aile & Çocuk Etkinlikleri">Aile & Çocuk Etkinlikleri</option>
                          <option value="Business & Networking">Business & Networking</option>
                        </select>
                        <ErrorText msg={showInlineErrors ? errors.eventMainCategory : ""} />
                      </div>
                    )}

                    <div>
                      <label className="block font-semibold mb-1">
                        Alt Kategori <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={subCategory}
                        onChange={(e) => { setSubCategory(e.target.value); recomputeErrorsIfNeeded(); }}
                        disabled={category === "Etkinlik Paketleri" ? !eventMainCategory : !subOptions.length}
                        className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                      >
                        <option value="">Seçiniz</option>
                        {subOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ErrorText msg={showInlineErrors ? errors.subCategory : ""} />
                    </div>
                  </div>

                  
                </div>
              )}

              {/* ------------------ STEP 2 ------------------ */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-1">
                      {t.title} <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); recomputeErrorsIfNeeded(); }}
                      placeholder={getTitlePlaceholder(category, subCategory, il)}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <ErrorText msg={showInlineErrors ? errors.title : ""} />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      {t.description}<span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows={7}
                      value={desc}
                      onChange={(e) => { setDesc(e.target.value); recomputeErrorsIfNeeded(); }}
                      placeholder={getDescPlaceholder(category)}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <ErrorText msg={showInlineErrors ? errors.desc : ""} />
                  </div>
                </div>
              )}

              {/* ------------------ STEP 3 ------------------ */}
              {step === 3 && (
                <div className="space-y-6">
                  {isEvent ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border bg-indigo-50 p-4 text-sm text-indigo-900">
                        <b>Etkinlik ilanlarında</b> giriş/çıkış yoktur. Tarih, mekan ve bilet bilgisi yeterlidir.
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-semibold mb-1">
                            Etkinlik Tarihi <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="date"
                            value={eventDate}
                            min={todayStr()}
                            onChange={(e) => { setEventDate(e.target.value); recomputeErrorsIfNeeded(); }}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                          <ErrorText msg={showInlineErrors ? errors.eventDate : ""} />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Başlangıç Saati (opsiyonel)</label>
                          <input
                            type="time"
                            value={eventStartTime}
                            onChange={(e) => { setEventStartTime(e.target.value); recomputeErrorsIfNeeded(); }}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Bitiş Saati (opsiyonel)</label>
                          <input
                            type="time"
                            value={eventEndTime}
                            onChange={(e) => { setEventEndTime(e.target.value); recomputeErrorsIfNeeded(); }}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                          <ErrorText msg={showInlineErrors ? errors.eventEndTime : ""} />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">
                          Mekan Adı <span className="text-red-600">*</span>
                        </label>
                        <input
                          value={venueName}
                          onChange={(e) => { setVenueName(e.target.value); recomputeErrorsIfNeeded(); }}
                          placeholder="Örn: Kültürpark Açıkhava Tiyatrosu"
                          className="w-full border rounded-lg px-3 py-2"
                        />
                        <ErrorText msg={showInlineErrors ? errors.venueName : ""} />
                      </div>

                      {/* Bilet Detayları */}
                      <div className="rounded-2xl border p-4 space-y-4">
                        <div className="font-semibold">🎟️ Bilet Bilgileri</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold mb-1">
                              Bilet Adedi <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={ticketCount}
                              onChange={(e) => { setTicketCount(Math.max(1, Number(e.target.value))); recomputeErrorsIfNeeded(); }}
                              className="w-full border rounded-lg px-3 py-2"
                            />
                            <ErrorText msg={showInlineErrors ? errors.ticketCount : ""} />
                          </div>

                          <div>
                            <label className="block font-semibold mb-1">
                              Bilet Türü <span className="text-red-600">*</span>
                            </label>
                            <input
                              value={ticketType}
                              onChange={(e) => { setTicketType(e.target.value); recomputeErrorsIfNeeded(); }}
                              placeholder="Örn: Genel Giriş / VIP / Sahne Önü"
                              className="w-full border rounded-lg px-3 py-2"
                            />
                            <ErrorText msg={showInlineErrors ? errors.ticketType : ""} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold mb-1">Oturma Bilgisi (opsiyonel)</label>
                            <input
                              value={seatInfo}
                              onChange={(e) => setSeatInfo(e.target.value)}
                              placeholder="Örn: Blok A / Sıra 3 / Koltuk 12-13"
                              className="w-full border rounded-lg px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold mb-1">
                              Teslim / Devir Yöntemi <span className="text-red-600">*</span>
                            </label>
                            <input
                              value={deliveryMethod}
                              onChange={(e) => { setDeliveryMethod(e.target.value); recomputeErrorsIfNeeded(); }}
                              placeholder="Örn: QR kod / isim değişikliği / e-posta transfer"
                              className="w-full border rounded-lg px-3 py-2"
                            />
                            <ErrorText msg={showInlineErrors ? errors.deliveryMethod : ""} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block font-semibold mb-1">
                            Giriş Tarihi <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="date"
                            value={checkIn}
                            min={todayStr()}
                            onChange={(e) => { setCheckIn(e.target.value); recomputeErrorsIfNeeded(); }}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                          <ErrorText msg={showInlineErrors ? errors.checkIn : ""} />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">
                            Çıkış Tarihi <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="date"
                            value={checkOut}
                            min={checkIn || todayStr()}
                            onChange={(e) => { setCheckOut(e.target.value); recomputeErrorsIfNeeded(); }}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                          <ErrorText msg={showInlineErrors ? errors.checkOut : ""} />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Toplam Gece</label>
                          <input readOnly value={nights || ""} className="w-full border rounded-lg px-3 py-2 bg-gray-100" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold mb-1">👤 Yetişkin</label>
                            <input
                              type="number"
                              min={1}
                              value={adults}
                              onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                              className="w-full border rounded-lg px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-1">👶 Çocuk</label>
                            <input
                              type="number"
                              min={0}
                              value={children}
                              onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                              className="w-full border rounded-lg px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Kategoriye özel bilgiler */}
                  {(metaFields.length > 0 || category === "Konaklama") && (
                    <section>
                      <h2 className="text-lg font-semibold mb-2">Kategoriye Özel Bilgiler</h2>

                      {OdaTipiFieldInMeta}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {metaFields
                          .filter((label) => label !== "Oda Tipi")
                          .map((label) => (
                            <div key={label}>
                              <label className="block text-sm font-semibold mb-1">{label}</label>
                              <input
                                value={ozelAlanlar[label] || ""}
                                onChange={(e) => setOzelAlanlar((prev) => ({ ...prev, [label]: e.target.value }))}
                                className="w-full border rounded-lg px-3 py-2"
                              />
                            </div>
                          ))}
                      </div>
                    </section>
                  )}

                  {!isEvent && KonaklamaEkleri}
                </div>
              )}

              {/* ------------------ STEP 4 ------------------ */}
              {step === 4 && (
                <div className="space-y-6">
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-1">Kapak Görseli (opsiyonel)</label>
                      <input type="file" accept="image/*" onChange={(e) => onCoverChange(e.target.files?.[0] || null)} />
                      {coverPreview && (
                        <div className="mt-2 border rounded-lg overflow-hidden w-48 h-32 bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={coverPreview} alt="Önizleme" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {!coverPreview && <p className="text-xs text-gray-500 mt-2">Kapak seçmezsen sistem kategoriye göre otomatik kapak atar.</p>}
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">
                        Ödeme Belgesi (PDF/JPG) — <span className="text-red-600">Zorunlu</span>
                      </label>
                      <input type="file" accept=".pdf,image/*" onChange={(e) => { onReservationChange(e.target.files?.[0] || null); recomputeErrorsIfNeeded(); }} />
                      <p className="text-xs text-gray-500 mt-1">Belgede sağlayıcı, rezervasyon/ödeme onayı ve toplam tutar net görünmelidir.</p>
                      <ErrorText msg={showInlineErrors ? errors.reservationFile : ""} />

                      {reservationPreview && (
                        <div className="mt-2 flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
                          {reservationPreview === "PDF_SELECTED" ? (
                            <div className="text-sm">📄 {reservationFile?.name}</div>
                          ) : (
                            <div className="w-48 h-32 overflow-hidden rounded bg-white">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={reservationPreview} alt="Belge Önizleme" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">
                        Orijinal Fiyat (₺) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatWithComma(orjinalFiyat)}
                        onChange={(e) => { setOrjinalFiyat(onlyNumbers(e.target.value)); recomputeErrorsIfNeeded(); }}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Örn: 15,000"
                      />
                      <ErrorText msg={showInlineErrors ? errors.orjinalFiyat : ""} />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">
                        Satış Fiyatı (₺) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatWithComma(price)}
                        onChange={(e) => { setPrice(onlyNumbers(e.target.value)); recomputeErrorsIfNeeded(); }}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Örn: 10,000"
                      />
                      <ErrorText msg={showInlineErrors ? errors.price : ""} />
                      <p className="text-xs text-gray-500 mt-1">Satış fiyatı, orijinal fiyattan büyük olamaz.</p>
                    </div>
                  </div>

                {/* Ücretli Özellikler */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-3">
  <label className="inline-flex items-center justify-between gap-2 border rounded-lg px-3 py-2 bg-gray-50">
    <div className="flex items-center gap-2 min-w-0">
      <input
        type="checkbox"
        checked={oneCikar}
        onChange={(e) => setOneCikar(e.target.checked)}
      />
      <span className="text-xs md:text-sm font-medium leading-tight break-words">
        {plan.boosts.categoryFeatured.label}
      </span>
    </div>
    <span className="text-xs md:text-sm text-gray-600 font-semibold whitespace-nowrap">
      +{boostCategoryFeatured} ₺
    </span>
  </label>

  <label className="inline-flex items-center justify-between gap-2 border rounded-lg px-3 py-2 bg-gray-50">
    <div className="flex items-center gap-2 min-w-0">
      <input
        type="checkbox"
        checked={vitrin}
        onChange={(e) => setVitrin(e.target.checked)}
      />
      <span className="text-xs md:text-sm font-medium leading-tight break-words">
        {plan.boosts.homeVitrin.label}
      </span>
    </div>
    <span className="text-xs md:text-sm text-gray-600 font-semibold whitespace-nowrap">
      +{boostHomeVitrin} ₺
    </span>
  </label>

  <label className="inline-flex items-center justify-between gap-2 border rounded-lg px-3 py-2 bg-gray-50">
    <div className="flex items-center gap-2 min-w-0">
      <input
        type="checkbox"
        checked={kalinYazi}
        onChange={(e) => setKalinYazi(e.target.checked)}
      />
      <span className="text-xs md:text-sm font-medium leading-tight break-words">
        {plan.boosts.boldTitle.label}
      </span>
    </div>
    <span className="text-xs md:text-sm text-gray-600 font-semibold whitespace-nowrap">
      +{boostBoldTitle} ₺
    </span>
  </label>
</section>
                  {/* KVKK */}
                  <div className="space-y-2">
                    <label className="text-sm inline-flex items-center gap-2">
                      <input type="checkbox" checked={kvkkOnay} onChange={(e) => { setKvkkOnay(e.target.checked); recomputeErrorsIfNeeded(); }} />
                      <span>
                        <button type="button" className="underline text-primary" onClick={() => { setPolicyTab("terms"); setPolicyOpen(true); }}>
                          Kullanım Koşulları
                        </button>{" "}
                        ve{" "}
                        <button type="button" className="underline text-primary" onClick={() => { setPolicyTab("kvkk"); setPolicyOpen(true); }}>
                          KVKK metinlerini
                        </button>{" "}
                        okudum, kabul ediyorum. <span className="text-red-600">*</span>
                      </span>
                    </label>
                    <ErrorText msg={showInlineErrors ? errors.kvkkOnay : ""} />

                    <label className="flex items-start gap-2 text-sm text-gray-600">
                      <input type="checkbox" required />
                      <span>
                        <a href="/odeme-iptal-iade" className="text-primary underline">
                          Ödeme iptali ve iade koşullarını
                        </a>{" "}
                        okudum, kabul ediyorum.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* ------------------ STEP 5 ------------------ */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border bg-gray-50 p-5">
                    <div className="text-lg font-bold mb-2">🔎 İlan Önizleme</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl border p-4">
                        <div className="text-xs text-gray-500 mb-1">Kategori</div>
                        <div className="font-semibold">
                          {category} / {subCategory}
                        </div>

                        <div className="text-xs text-gray-500 mt-3 mb-1">Konum</div>
                        <div className="font-semibold">
                          {il} / {ilce} / {mahalle}
                        </div>

                        <div className="text-xs text-gray-500 mt-3 mb-1">{isEvent ? "Etkinlik" : "Tarih"}</div>
                        {isEvent ? (
                          <div className="font-semibold">
                            {eventDate || "-"}{" "}
                            {(eventStartTime || eventEndTime) ? `(${eventStartTime || "--:--"} - ${eventEndTime || "--:--"})` : ""}
                            <div className="text-sm text-gray-600 mt-1">Mekan: {venueName || "-"}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Bilet: {ticketCount} · {ticketType || "-"}
                              {seatInfo ? ` · ${seatInfo}` : ""}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Teslim: {deliveryMethod || "-"}</div>
                          </div>
                        ) : (
                          <div className="font-semibold">
                            {checkIn} → {checkOut} ({nights} gece)
                            <div className="text-sm text-gray-600 mt-1">
                              {adults} yetişkin, {children} çocuk
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white rounded-xl border p-4">
                        <div className="text-xs text-gray-500 mb-1">Başlık</div>
                        <div className="font-semibold">{title}</div>

                        <div className="text-xs text-gray-500 mt-3 mb-1">Açıklama</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{desc}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-emerald-50 p-4 text-sm text-emerald-900">
                    <b>Bilgilendirme:</b> İlanınız kaydedildikten sonra incelemeye alınır ve admin onayından sonra yayına alınır.
                  </div>
                </div>
              )}

              {/* ------------------ Actions ------------------ */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t">
                <button type="button" onClick={() => router.push("/")} className="px-5 py-2 border rounded-lg">
                  Vazgeç
                </button>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={goBack} className="px-5 py-2 border rounded-lg" disabled={step === 1}>
                    ← {t.back}
                  </button>

                  {step < 5 ? (
                    <button type="button" onClick={goNext} className="px-6 py-2 bg-gray-900 text-white rounded-lg">
                      {t.next}→
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={submitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
                    >
                      {submitting ? "İşleniyor..." : cartTotals.needsPayment ? "💳 Ödeme Adımına Geç" : "✅ İlanı Kaydet"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* SAĞ: Sticky Summary */}
            <StickySummary />
          </div>
        </div>

        <Footer />

        {/* Ekran ortası popup */}
        {popup.show && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative max-w-md w-[92%] bg-red-600 text-white px-5 py-4 rounded-2xl shadow-2xl border border-red-700 text-center">
              <div className="text-base whitespace-pre-line font-medium">{popup.message}</div>
            </div>
          </div>
        )}

        {/* KVKK / Terms Modal */}
        <PolicyModal />
      </main>
    </>
  );
}