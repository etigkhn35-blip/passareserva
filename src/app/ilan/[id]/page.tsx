"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "@/lib/firebaseConfig";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronLeft,
  Hash,
  Info,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Smartphone,
  Tag,
  Ticket,
  User,
  X,
  Flag,
} from "lucide-react";

/* ------------------------------ Helpers ------------------------------ */

function maskLastName(fullName?: string) {
  if (!fullName) return "Kullanıcı";
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length <= 1) return parts[0] || "Kullanıcı";
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first} ${String(last[0] || "").toUpperCase()}.`;
}

function isFirestoreTimestamp(v: any) {
  return v && typeof v === "object" && (typeof v.toDate === "function" || typeof v.toMillis === "function");
}

function toDateSafe(v: any): Date | null {
  try {
    if (!v) return null;
    if (isFirestoreTimestamp(v)) return v.toDate?.() ?? new Date(v.toMillis());
    if (v instanceof Date) return v;
    if (typeof v === "string") {
      // "2026-03-20" gibi ISO ise
      const d = new Date(v);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  } catch {
    return null;
  }
}

function formatDateTR(d: Date) {
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function isMeaningfulValue(v: any) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return false;
    if (s.toLowerCase() === "undefined" || s.toLowerCase() === "null") return false;
    return true;
  }
  if (typeof v === "number") return v !== 0 && !Number.isNaN(v);
  if (typeof v === "boolean") return v === true; // false ise göstermiyoruz
  if (Array.isArray(v)) return v.filter(isMeaningfulValue).length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return true;
}

function niceLabelTR(key: string) {
  const map: Record<string, string> = {
    ilanNo: "İlan No",
    kategori: "Kategori",
    altKategori: "Alt Kategori",
    ustKategori: "Üst Kategori",
    il: "İl",
    ilce: "İlçe",
    aciklama: "Açıklama",
    ucret: "Devir Ücreti",
    orjinalFiyat: "Orijinal Fiyat",
    originalPrice: "Orijinal Fiyat",
    geceSayisi: "Gece Sayısı",
    yetiskinSayisi: "Kişi Sayısı",
    kisiSayisi: "Kişi Sayısı",
    biletAdedi: "Bilet Adedi",
    biletSayisi: "Bilet Adedi",
    etkinlikTarihi: "Etkinlik Tarihi",
    baslangicTarihi: "Başlangıç Tarihi",
    teslimYontemi: "Teslim Yöntemi",
    teslimSekli: "Teslim Yöntemi",
    adres: "Adres",
  };

  if (map[key]) return map[key];

  // snake/camel düzeltme
  const human = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();

  // Türkçe büyük harf
  return human.charAt(0).toUpperCase() + human.slice(1);
}

/* ------------------------------ UI ------------------------------ */

type InfoRowItem = {
  label: string;
  value: string;
  icon: any;
  gray?: boolean;
};

function InfoRow({ label, value, icon: Icon, isGray = false }: any) {
  return (
    <div
      className={`flex items-center justify-between p-5 px-8 border-b border-slate-50 last:border-none ${
        isGray ? "bg-slate-50/30" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon className="w-4 h-4 text-slate-300" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-[11px] font-bold text-slate-700 uppercase text-right">
        {value || "—"}
      </span>
    </div>
  );
}

/* ------------------------------ Main ------------------------------ */

export default function IlanDetayPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ilan, setIlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [isFav, setIsFav] = useState(false);
  const [favoriLoading, setFavoriLoading] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [ownerUid, setOwnerUid] = useState<string | null>(null);

  /* ---------------- Auth + Fav ---------------- */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && id) {
        try {
          const favRef = doc(db, "favoriler", currentUser.uid, "items", String(id));
          const snap = await getDoc(favRef);
          setIsFav(snap.exists());
        } catch {
          setIsFav(false);
        }
      } else {
        setIsFav(false);
      }
    });

    return () => unsub();
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) {
      alert("Favoriye eklemek için giriş yapmalısınız.");
      return;
    }
    if (favoriLoading) return;

    setFavoriLoading(true);
    try {
      const favRef = doc(db, "favoriler", user.uid, "items", String(id));

      if (isFav) {
        await deleteDoc(favRef);
        setIsFav(false);
      } else {
        await setDoc(favRef, {
          ilanId: String(id),
          baslik: ilan?.baslik || "Başlıksız",
          coverUrl: ilan?.coverUrl || ilan?.gorselURL || "/defaults/default.jpg",
          ucret: ilan?.ucret || 0,
          eklenmeTarihi: serverTimestamp(),
        });
        setIsFav(true);
      }
    } catch (e) {
      console.error(e);
      alert("Favori işlemi başarısız oldu.");
    } finally {
      setFavoriLoading(false);
    }
  };

  useEffect(() => {
  const increaseViewCount = async () => {
    if (!id) return;

    try {
      const ilanRef = doc(db, "ilanlar", String(id));
      await updateDoc(ilanRef, {
        viewCount: increment(1),
      });
    } catch (err) {
      console.error("Görüntülenme artırılamadı:", err);
    }
  };

  increaseViewCount();
}, [id]);

 /* ---------------- İlan çek ---------------- */

useEffect(() => {
  const fetchIlan = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const ref = doc(db, "ilanlar", String(id));
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setIlan(null);
        setLoading(false);
        return;
      }

      const data: any = { ...snap.data(), id: snap.id };

      /* ---------------- İlan sahibini bul ---------------- */

      const ownerUid =
        data.sahipUid ||
        data.ownerUid ||
        data.uid ||
        data.userId ||
        null;
setOwnerUid(ownerUid);
      /* ---------------- Kullanıcı telefonunu çek ---------------- */

      if (ownerUid) {
        try {
          const userRef = doc(db, "users", ownerUid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData: any = userSnap.data();

            data.telefon =
              userData.phone ||
              userData.telefon ||
              userData.tel ||
              userData.phoneNumber ||
              "";
          }
        } catch (err) {
          console.error("Telefon çekilemedi:", err);
        }
      }

      setIlan(data);

    } catch (err) {
      console.error("İlan çekme hatası:", err);
      setIlan(null);
    } finally {
      setLoading(false);
    }
  };

  fetchIlan();
}, [id]);

  /* ---------------- Report ---------------- */

  const handleReportSubmit = async () => {
    if (!reportReason) return;
    setIsReporting(true);
    try {
      await addDoc(collection(db, "reports"), {
        adId: String(id),
        adTitle: ilan?.baslik || "",
        reason: reportReason,
        status: "unread",
        createdAt: serverTimestamp(),
      });
      setShowReportModal(false);
      alert("Bildiriminiz iletildi. Teşekkürler!");
    } catch (e) {
      console.error("Rapor gönderme hatası:", e);
      alert("Bildirim gönderilemedi.");
    } finally {
      setIsReporting(false);
    }
  };

  const startConversation = async () => {

  if (!user) {
    alert("Mesaj göndermek için giriş yapmalısınız.");
    router.push("/giris");
    return;
  }

  if (!ownerUid) {
    alert("İlan sahibi bulunamadı.");
    return;
  }

  if (user.uid === ownerUid) {
    alert("Kendi ilanınıza mesaj gönderemezsiniz.");
    return;
  }

  try {

    const conversationId = [user.uid, ownerUid].sort().join("_");

 await setDoc(
  doc(db, "conversations", conversationId),
  {
    users: [user.uid, ownerUid],
    adId: id,
    adTitle: ilan?.baslik || "",
    updatedAt: serverTimestamp(),

    userNames: {
      [user.uid]: user.displayName || user.email?.split("@")[0] || "Kullanıcı",
      [ownerUid]: ilan?.adSoyad || "Kullanıcı",
    },
  },
  { merge: true }
);

router.push("/hesabim/mesajlar");
  } catch (err) {
    console.error(err);
    alert("Mesaj başlatılamadı.");
  }
};


  /* ---------------- Field Rules ---------------- */

  // Kesinlikle gösterilmeyecek alanlar (senin ekran görüntülerindekiler + güvenlik)
  const HIDDEN_KEYS = useMemo(
    () =>
      new Set<string>([
        "id",
        "sahipUid",
        "sahipEmail",
        "ownerUid",
        "uid",
        "email",
        "updatedAt",
        "createdAt",
        "olusturmaTarihi",
        "baslangicTarihi",
        "bitisTarihi",
        "systemExpireDate",
        "status",
        "approved",
        "vitrin",
        "anasayfaVitrin",
        "vitrindeGoster",
        "kalinYazi",
        "kvkkOnay",
        "cover",
        "coverUrl",
        "gorselURL", // görsel zaten üstte var
        "pdfUrl",
        "pdfURL",
        "rezervasyonBelgesi",
        "rezervasyonBelgesiUrl",
        "reservationDoc",
        "reservationPdf",
        "paymentAt",
        "paymentBase",
        "paymentBold",
        "paymentOneCikar",
        "paymentStatus",
        "paymentTotal",
        "paymentVitrin",
        "paymenteAt",
        "paymenteBase",
        "paymenteBold",
        "paymenteOneCikar",
        "paymenteStatus",
        "paymenteTotal",
        "paymenteVitrin",
      ]),
    []
  );

  // Tarih olarak formatlayacağımız “bilinen” alanlar
  const DATE_KEYS = useMemo(
    () =>
      new Set<string>([
        "etkinlikTarihi",
        "girisTarihi",
        "cikisTarihi",
        "baslangic",
        "etkinlikBaslangic",
        "etkinlikBitis",
        "tarih",
        "date",
      ]),
    []
  );

  function formatValue(key: string, v: any): string {
    if (!isMeaningfulValue(v)) return "";

    // bilet / kişi / gece gibi sayısal alanlar asla tarihe dönmesin
    const numericKeys = new Set(["kisiSayisi", "yetiskinSayisi", "biletAdedi", "biletSayisi", "geceSayisi", "ucret", "orjinalFiyat", "originalPrice"]);
    if (numericKeys.has(key)) {
      const n = typeof v === "number" ? v : Number(v);
      if (!Number.isFinite(n) || n === 0) return "";
      if (key === "ucret" || key === "orjinalFiyat" || key === "originalPrice") {
        return `${n.toLocaleString("tr-TR")} ₺`;
      }
      if (key === "geceSayisi") return `${n} Gece`;
      if (key === "biletAdedi" || key === "biletSayisi") return `${n} Adet`;
      return `${n} Kişi`;
    }

    // Tarihler: sadece bilinen alanlarda veya Firestore Timestamp ise
    if (DATE_KEYS.has(key) || isFirestoreTimestamp(v)) {
      const d = toDateSafe(v);
      if (!d) return "";
      // 1970 gibi saçma defaultlar geliyorsa (genelde yanlış veri) gösterme:
      if (d.getFullYear() <= 1971) return "";
      return formatDateTR(d);
    }

    if (typeof v === "boolean") return v ? "Evet" : "";
    if (typeof v === "number") {
      if (v === 0) return "";
      return v.toLocaleString("tr-TR");
    }
    if (typeof v === "string") return v.trim();
    if (Array.isArray(v)) {
      const arr = v.filter(isMeaningfulValue).map(String);
      return arr.length ? arr.join(", ") : "";
    }
    if (typeof v === "object") {
      // obje ise [object Object] basma — düz yazı üret
      const entries = Object.entries(v)
        .filter(([k, val]) => !HIDDEN_KEYS.has(k) && isMeaningfulValue(val))
        .map(([k, val]) => `${niceLabelTR(k)}: ${String(val)}`);
      return entries.length ? entries.join(" • ") : "";
    }

    return String(v);
  }

  /* ---------------- Derived Display ---------------- */

  const kapak =
    ilan?.coverUrl ||
    ilan?.gorselURL ||
    ilan?.cover ||
    "/defaults/default.jpg";

  const ilanBaslik = ilan?.baslik || "İlan";
  const konum = [ilan?.il, ilan?.ilce].filter(Boolean).join(" / ");

  // kişi sayısı: kapasite değil — alıcı bunu görmek ister
  const kisiSayisiRaw =
    ilan?.kisiSayisi ??
    ilan?.yetiskinSayisi ??
    ilan?.kisi ??
    ilan?.adultCount ??
    null;

  // Konaklama sadece varsa
  const geceSayisiRaw = ilan?.geceSayisi ?? null;

  // Etkinlik tarihi sadece varsa
  const etkinlikTarihiRaw = ilan?.etkinlikTarihi ?? ilan?.eventDate ?? null;

  // Bilet adedi
  const biletRaw = ilan?.biletAdedi ?? ilan?.biletSayisi ?? null;

  // Orijinal fiyat + indirim göstermek istersen (alıcı için faydalı)
  const ucret = typeof ilan?.ucret === "number" ? ilan.ucret : Number(ilan?.ucret || 0);
  const orjinal =
    typeof ilan?.orjinalFiyat === "number"
      ? ilan.orjinalFiyat
      : typeof ilan?.originalPrice === "number"
      ? ilan.originalPrice
      : Number(ilan?.orjinalFiyat || ilan?.originalPrice || 0);

  const indirimYuzde =
    orjinal > 0 && ucret > 0 && orjinal > ucret ? Math.round(((orjinal - ucret) / orjinal) * 100) : 0;

  // Telefon: ilandan
  const tel = ilan?.phone || ilan?.telefon || ilan?.iletisimTelefon || "";

  // İlan sahibi adı: ilandan (maskeli)
  const sahipAd = maskLastName(ilan?.adSoyad || ilan?.sahipAdSoyad || "Kullanıcı");

  // Ek alanlar (kategoriye göre kullanıcı ne girdiyse) — ama gizli anahtarlar hariç
  const extraRows: InfoRowItem[] = useMemo(() => {
    if (!ilan) return [];

    const rows: Array<{ key: string; icon: any; gray?: boolean }> = [];

    // Buraya “alıcı için faydalı” temel alanları ekliyoruz.
    // Not: Tarih / sayı formatını formatValue hallediyor.
    rows.push({ key: "ilanNo", icon: Hash });
    rows.push({ key: "kategori", icon: Tag, gray: true });
    rows.push({ key: "altKategori", icon: Info });

    // Etkinlik tarihi alanı varsa otomatik gösterilsin (key’i kesinleştiriyoruz)
    if (isMeaningfulValue(etkinlikTarihiRaw)) rows.push({ key: "etkinlikTarihi", icon: Calendar, gray: true });

    // Konaklama alanı varsa
    if (isMeaningfulValue(geceSayisiRaw)) rows.push({ key: "geceSayisi", icon: Calendar, gray: true });

    // Kişi sayısı varsa
    if (isMeaningfulValue(kisiSayisiRaw)) rows.push({ key: "kisiSayisi", icon: User });

    // Bilet adedi varsa
    if (isMeaningfulValue(biletRaw)) rows.push({ key: "biletAdedi", icon: Ticket, gray: true });

    // İl / ilçe
    rows.push({ key: "il", icon: MapPin });
    rows.push({ key: "ilce", icon: MapPin, gray: true });

    // Teslim yöntemi vs (varsa)
    if (isMeaningfulValue(ilan?.teslimYontemi)) rows.push({ key: "teslimYontemi", icon: Info });
    if (isMeaningfulValue(ilan?.teslimSekli)) rows.push({ key: "teslimSekli", icon: Info });

    // Kullanıcının doldurduğu obje alanları (özel alanlar / donanımlar) — boşsa yok
    // Not: Donanım girilmemişse zaten isMeaningfulValue false dönecek.
    const objectCandidates: string[] = ["ozelAlanlar", "donanimlar", "ekstraAlanlar", "detaylar"];
    objectCandidates.forEach((k) => {
      const v = ilan?.[k];
      if (!isMeaningfulValue(v)) return;
      if (typeof v !== "object") return;

      // object içini satırlara çevir
      Object.entries(v).forEach(([subKey, subVal]) => {
        if (HIDDEN_KEYS.has(subKey)) return;
        if (!isMeaningfulValue(subVal)) return;

        // cover/pdf gibi şeyleri yine de ele
        if (String(subKey).toLowerCase().includes("pdf")) return;
        if (String(subKey).toLowerCase().includes("cover")) return;
        if (String(subKey).toLowerCase().includes("payment")) return;

        // burada key yerine “subKey” kullanıyoruz
        // formatValue objeyi de çözer ama burada direkt değer veririz
        const valueText = formatValue(subKey, subVal);
        if (!valueText) return;

        rows.push({ key: `${k}.${subKey}`, icon: Info });
      });
    });

    // rows -> InfoRowItem
    const out: InfoRowItem[] = [];

    rows.forEach((r, idx) => {
      // nested key ise
      let key = r.key;
      let rawValue: any = "";

      if (key.includes(".")) {
        const [root, child] = key.split(".");
        rawValue = ilan?.[root]?.[child];
        key = child; // label child üzerinden
      } else {
        rawValue = ilan?.[key];
      }

      // bazı alanları manuel bağla
      if (r.key === "kisiSayisi") rawValue = kisiSayisiRaw;
      if (r.key === "biletAdedi") rawValue = biletRaw;
      if (r.key === "etkinlikTarihi") rawValue = etkinlikTarihiRaw;
      if (r.key === "geceSayisi") rawValue = geceSayisiRaw;

      if (HIDDEN_KEYS.has(key)) return;

      const valueText = formatValue(key, rawValue);
      if (!valueText) return;

      out.push({
        label: niceLabelTR(key),
        value: valueText,
        icon: r.icon,
        gray: Boolean(r.gray ?? (idx % 2 === 1)),
      });
    });

    // Aynı label tekrar ettiyse (bazı objeler) benzersiz yap
    const seen = new Set<string>();
    return out.filter((x) => {
      const k = `${x.label}__${x.value}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [
    ilan,
    DATE_KEYS,
    HIDDEN_KEYS,
    etkinlikTarihiRaw,
    geceSayisiRaw,
    kisiSayisiRaw,
    biletRaw,
  ]);

  /* ---------------- Render ---------------- */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-500 w-10 h-10" />
      </div>
    );
  }

  if (!ilan) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
          <AlertTriangle className="w-12 h-12 text-orange-400 mb-4" />
          <div className="text-lg font-bold text-slate-700">İlan bulunamadı</div>
          <div className="text-sm text-slate-500 mt-2">
            Bu ilan kaldırılmış veya erişime kapatılmış olabilir.
          </div>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 rounded-xl bg-sky-600 text-white font-bold text-xs uppercase tracking-widest"
          >
            Ana Sayfaya Dön
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow pt-24 md:pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* ÜST BAR */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-slate-500 font-bold uppercase text-[10px] tracking-wider hover:text-sky-600 transition-colors"
            >
              <ChevronLeft size={18} /> Geri Dön
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFavorite}
                disabled={favoriLoading}
                className={`p-3 rounded-xl transition-all shadow-sm ${
                  isFav
                    ? "bg-red-50 text-red-500 border border-red-100"
                    : "bg-white text-slate-400 border border-slate-100 hover:text-red-500"
                }`}
                aria-label="Favori"
              >
                {favoriLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isFav ? (
                  <BookmarkCheck className="w-6 h-6 fill-current" />
                ) : (
                  <Bookmark className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-10 md:gap-14">
            {/* SOL */}
            <div className="space-y-8">
              <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-[35px] overflow-hidden shadow-md border border-slate-100 bg-white">
                <img
                  src={kapak}
                  className="w-full h-full object-cover"
                  alt={ilanBaslik}
                />
              </div>

              <div className="space-y-4 px-1">
                {konum && (
                  <div className="flex items-center gap-2 text-sky-600 font-bold text-[10px] tracking-[2px] uppercase">
                    <MapPin size={14} /> {konum}
                  </div>
                )}

                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 uppercase leading-tight">
                  {ilanBaslik}
                </h1>

                {/* küçük etiketler */}
                <div className="flex flex-wrap gap-2">
                  {isMeaningfulValue(ilan?.kategori) && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <Tag size={14} className="text-slate-300" />
                      {String(ilan.kategori)}
                    </span>
                  )}

                  {isMeaningfulValue(ilan?.altKategori) && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <Info size={14} className="text-slate-300" />
                      {String(ilan.altKategori)}
                    </span>
                  )}

                  {indirimYuzde > 0 && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-[10px] font-bold uppercase tracking-widest text-orange-700">
                      🔥 %{indirimYuzde} İndirim
                    </span>
                  )}
                </div>
              </div>

              {/* DETAY KARTI */}
              <div className="bg-white border border-slate-100 rounded-[25px] overflow-hidden shadow-sm">
                {extraRows.map((r, idx) => (
                  <InfoRow
                    key={`${r.label}-${idx}`}
                    label={r.label}
                    value={r.value}
                    icon={r.icon}
                    isGray={Boolean(r.gray)}
                  />
                ))}

                {/* Durum: her zaman Türkçe sabit */}
                <InfoRow
                  label="Durum"
                  value="Yayında"
                  icon={ShieldCheck}
                  isGray={extraRows.length % 2 === 1}
                />
              </div>

              {/* AÇIKLAMA */}
              {isMeaningfulValue(ilan?.aciklama) && (
                <div className="pt-4 px-1">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px] mb-5">
                    İlan Açıklaması
                  </h3>
                  <div className="text-slate-700 text-[15px] leading-relaxed bg-slate-50/50 p-8 md:p-10 rounded-[30px] border border-slate-100/50 whitespace-pre-line">
                    {String(ilan.aciklama)}
                  </div>
                </div>
              )}
            </div>

            {/* SAĞ */}
            <div className="relative">
              <div className="lg:sticky lg:top-32 space-y-5">
                <div className="bg-white border border-slate-100 rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-200/40">
                  <div className="text-center mb-10">
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[4px] mb-3">
                      Devir Bedeli
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-slate-800 tracking-tighter">
                        {ucret ? ucret.toLocaleString("tr-TR") : "—"}
                      </span>
                      <span className="text-xl font-bold text-sky-600">₺</span>
                    </div>

                    {orjinal > 0 && orjinal > ucret && (
                      <div className="mt-2 text-[11px] text-slate-400 font-bold">
                        Orijinal:{" "}
                        <span className="line-through">
                          {orjinal.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                   <Button
  onClick={startConversation}
  className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all"
>
                      <MessageSquare size={16} className="mr-3" /> Mesaj Gönder
                    </Button>

                    {/* TELEFON (ilanda varsa) */}
                    <div className="pt-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
                        İletişim
                      </p>

                      {isMeaningfulValue(tel) ? (
                        <a
                          href={`tel:${tel}`}
                          className="flex items-center justify-between w-full bg-slate-50 border border-slate-100 p-4 rounded-xl group transition-colors hover:bg-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm text-emerald-500">
                              <Phone size={16} />
                            </div>
                            <span className="text-[13px] font-bold text-slate-700">
                              {String(tel)}
                            </span>
                          </div>
                          <Smartphone size={16} className="text-slate-300" />
                        </a>
                      ) : (
                        <div className="w-full bg-slate-50/50 border border-dashed border-slate-200 py-4 rounded-xl text-[10px] font-bold text-slate-400 text-center">
                          Telefon belirtilmemiş
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SAHİP (maskeli) */}
                  <div className="mt-10 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-11 h-11 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 font-bold text-sm border border-sky-100">
                        {(sahipAd || "K")[0]}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          İlan Sahibi
                        </p>
                        <p className="text-[11px] font-bold text-slate-700 uppercase">
                          {sahipAd}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-full text-[9px] font-bold text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Flag size={14} /> İlanı Bildir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* RAPOR MODALI */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-[40px] md:rounded-[40px] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">
                İlan Bildirimi
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400"
                aria-label="Kapat"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3 mb-10">
              {["Sahte ilan", "Fiyat hatalı", "Satıldı", "Ulaşılamıyor"].map((r) => (
                <button
                  key={r}
                  onClick={() => setReportReason(r)}
                  className={`w-full p-4 rounded-2xl text-[11px] font-bold uppercase transition-all border ${
                    reportReason === r
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <Button
              onClick={handleReportSubmit}
              disabled={isReporting || !reportReason}
              className="w-full bg-slate-900 text-white h-14 rounded-2xl font-bold text-[11px] uppercase tracking-widest"
            >
              {isReporting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}