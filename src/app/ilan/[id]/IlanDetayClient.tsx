"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db, auth } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Timestamp } from "firebase/firestore";
import {
  MapPin,
  Calendar,
  Tag,
  MessageCircle,
  AlertTriangle,
  Clock,
  Share2,
  ShieldCheck,
  ChevronLeft,
  Info,
  Heart,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = { id: string };

function toDateSafe(val: any): Date | null {
  if (!val) return null;
  if (val?.toDate) return val.toDate();
  if (val instanceof Date) return val;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d;
}

function isExpired(ilan:any){
  if(!ilan?.bitisTarihi) return false;

  const now = new Date();
  const end = ilan.bitisTarihi.toDate();

  return end < now;
}


function formatDateTR(val: any) {
  const d = toDateSafe(val);
  if (!d) return "—";
  return d.toLocaleDateString("tr-TR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function formatDateTimeTR(val: any) {
  const d = toDateSafe(val);
  if (!d) return "—";
  return d.toLocaleString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeValue(v: any) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (typeof v === "number") return v.toLocaleString("tr-TR");
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";

  // Timestamp / date object
  const d = toDateSafe(v);
  if (d) return formatDateTR(d);

  if (typeof v === "object") {
    // objeyi olduğu gibi basmak yerine sadeleştir
    try {
      return JSON.stringify(v);
    } catch {
      return "—";
    }
  }
  return String(v);
}

function prettyKeyTR(key: string) {
  const map: Record<string, string> = {
    baslik: "Başlık",
    aciklama: "Açıklama",
    kategori: "Kategori",
    altKategori: "Alt Kategori",
    il: "İl",
    ilce: "İlçe",
    ucret: "Devir Ücreti",
    orjinalFiyat: "Orijinal Fiyat",
    indirim: "İndirim (%)",
    kisiSayisi: "Kişi Sayısı",
    yetiskinSayisi: "Yetişkin Sayısı",
    cocukSayisi: "Çocuk Sayısı",
    geceSayisi: "Gece Sayısı",
    girisTarihi: "Giriş Tarihi",
    cikisTarihi: "Çıkış Tarihi",
    etkinlikTarihi: "Etkinlik Tarihi",
    ilanNo: "İlan No",
    olusturmaTarihi: "Oluşturma Tarihi",
    createdAt: "Oluşturma Tarihi",
    bitisTarihi: "Bitiş Tarihi",
    systemExpireDate: "Bitiş Tarihi",
    isPaid: "Öne Çıkar",
    anasayfaVitrin: "Anasayfa Vitrin",
    kalinBaslik: "Kalın Başlık",
    kategorideOneCikar: "Kategoride Öne Çıkar",
  };

  if (map[key]) return map[key];

  // camelCase -> Kelime kelime
  const spaced = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// UI’da göstermeye gerek olmayan teknik alanlar
const HIDE_KEYS = new Set([
  "id",
  "status",
  "sahipUid",
  "uid",
  "userId",
  "coverUrl",
  "cover",
  "gorselURL",
  "images",
  "galeri",
]);

export default function IlanDetayClient({ id }: Props) {
  const [ilan, setIlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriLoading, setFavoriLoading] = useState(false);

  const gorselHaritasi: Record<string, string> = {
    Otel: "/defaults/konaklama-otel.jpg",
    Villa: "/defaults/konaklama-villa.jpg",
    "Airbnb & Bungalow": "/defaults/konaklama-bungalow.jpg",
    Apart: "/defaults/konaklama-apart.jpg",
    "Tatil Köyü": "/defaults/konaklama-tatilkoyu.jpg",
    Varsayilan: "/defaults/konaklama-otel.jpg",
  };

  // Auth durumu + favori kontrolü
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) checkIfFavorite(user.uid);
      else setIsFavorite(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // İlan verisini çek (TÜM DETAY)
  useEffect(() => {
    const fetchIlan = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "ilanlar", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setIlan(null);
          setIsExpired(false);
          return;
        }

        const data = snap.data();
        const merged = { id: snap.id, ...data };
        setIlan(merged);

        // ✅ Süre hesabı: önce bitişTarihi varsa ona göre
        const now = Date.now();
        const bitis =
          toDateSafe(data.bitisTarihi) ||
          toDateSafe(data.systemExpireDate) ||
          null;

        if (bitis) {
          setIsExpired(bitis.getTime() < now);
        } else {
          // ✅ fallback: oluşturma tarihine göre (15/30 gün)
          const created =
            toDateSafe(data.olusturmaTarihi) ||
            toDateSafe(data.createdAt) ||
            null;

          const createdMs = created ? created.getTime() : now;
          const elapsedDays = (now - createdMs) / (1000 * 60 * 60 * 24);
          const limit = data.isPaid ? 30 : 15;
          setIsExpired(elapsedDays > limit);
        }
      } catch (e) {
        console.error("İlan detay hatası:", e);
        setIlan(null);
        setIsExpired(false);
      } finally {
        setLoading(false);
      }
    };

    fetchIlan();
  }, [id]);

  // Favoride mi kontrol et
  const checkIfFavorite = async (uid: string) => {
    try {
      const favRef = doc(db, "favoriler", uid, "items", id);
      const snap = await getDoc(favRef);
      setIsFavorite(snap.exists());
    } catch (err) {
      console.error("Favori kontrol hatası:", err);
    }
  };

  // Favoriye ekle / kaldır
  const toggleFavorite = async () => {
    if (!currentUser) {
      alert("Favoriye eklemek için giriş yapmalısınız.");
      return;
    }
    if (favoriLoading) return;

    setFavoriLoading(true);
    try {
      const favRef = doc(db, "favoriler", currentUser.uid, "items", id);

      if (isFavorite) {
        await deleteDoc(favRef);
        setIsFavorite(false);
      } else {
        const cover =
          ilan?.gorselURL ||
          ilan?.coverUrl ||
          gorselHaritasi[ilan?.altKategori] ||
          gorselHaritasi[ilan?.kategori] ||
          gorselHaritasi["Varsayilan"];

        await setDoc(favRef, {
          ilanId: id,
          baslik: ilan?.baslik || "Başlıksız",
          coverUrl: cover,
          ucret: ilan?.ucret || 0,
          eklenmeTarihi: serverTimestamp(),
        });

        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
      alert("İşlem başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setFavoriLoading(false);
    }
  };

  // ✅ “Bütün detaylar” listesi
  const detailRows = useMemo(() => {
    if (!ilan) return [];

    const entries = Object.entries(ilan)
      .filter(([k, v]) => !HIDE_KEYS.has(k))
      .filter(([_, v]) => v !== undefined && v !== null && v !== "");

    // İstersen burada sıralama önceliği verebilirsin
    return entries;
  }, [ilan]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-100 border-t-[#00AEEF] rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            İlan Yükleniyor...
          </span>
        </div>
      </div>
    );
  }

  if (!ilan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-[#FDFDFD]">
        <AlertTriangle className="w-12 h-12 text-orange-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 uppercase">İlan Bulunamadı</h2>
        <p className="text-sm text-gray-500 mt-2 mb-8">
          Bu ilan yayından kaldırılmış veya süresi dolmuş olabilir.
        </p>
        <Link
          href="/"
          className="bg-[#00AEEF] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-sky-100"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const kapak =
    ilan.gorselURL ||
    ilan.coverUrl ||
    gorselHaritasi[ilan.altKategori] ||
    gorselHaritasi[ilan.kategori] ||
    gorselHaritasi["Varsayilan"];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Üst Navigasyon */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-[#00AEEF] transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Geri Dön</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleFavorite}
                disabled={favoriLoading}
                className={`p-3 rounded-2xl transition-all ${
                  isFavorite ? "bg-red-50 text-red-500" : "bg-white text-gray-500 hover:text-red-500"
                } border border-gray-100 shadow-sm hover:shadow-md active:scale-95`}
              >
                {favoriLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                )}
              </button>

              <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-12">
            {/* SOL KOLON */}
            <div className="space-y-10">
              {/* Görsel */}
              <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-[40px] shadow-2xl shadow-gray-200/50">
                <Image
                  src={kapak}
                  alt={ilan.baslik || "İlan"}
                  fill
                  className={`object-cover ${isExpired ? "grayscale opacity-60" : ""}`}
                  priority
                />
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black text-gray-800 uppercase tracking-widest shadow-xl">
                    {ilan.kategori || "Kategori"}
                  </span>

                  {/* Öne çıkar label */}
                  {(ilan.isPaid || ilan.oneCikar || ilan.kategorideOneCikar || ilan.anasayfaVitrin) && (
                    <span className="bg-[#FF6B00] px-5 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                      ÖNE ÇIKAN
                    </span>
                  )}

                  {/* Süresi doldu */}
                  {isExpired && (
                    <span className="bg-gray-900/80 px-5 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                      SÜRESİ DOLDU
                    </span>
                  )}
                </div>
              </div>

              {/* Başlık ve Lokasyon */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00AEEF]">
                  <MapPin size={18} className="fill-sky-50" />
                  <span className="text-xs font-bold tracking-[2px] uppercase">
                    {ilan.il || "—"} / {ilan.ilce || "—"}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  {ilan.baslik || "Başlıksız İlan"}
                </h1>

                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
                    <Tag size={14} className="text-gray-400" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase">
                      KOD: {id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase">
                      {ilan.altKategori || "Genel"}
                    </span>
                  </div>

                  {/* Oluşturma tarihi göster */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase">
                      {formatDateTimeTR(ilan.olusturmaTarihi || ilan.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />

              {/* Açıklama */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[3px] flex items-center gap-3">
                  <Info size={18} className="text-[#00AEEF]" /> İLAN DETAYLARI
                </h3>

                {/* Açıklama */}
                {ilan.aciklama && (
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg font-medium whitespace-pre-line">
                    {ilan.aciklama}
                  </p>
                )}

                {/* ✅ Firestore’daki tüm alanları otomatik göster */}
                <div className="bg-white border border-gray-100 rounded-[30px] overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/40">
                    <div className="text-[11px] font-black text-gray-800 uppercase tracking-widest">
                      Firestore Detayları
                    </div>
                    <div className="text-[12px] text-gray-500 mt-1">
                      Bu bölüm ilan-ver’de girilen tüm alanları otomatik listeler.
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {detailRows.map(([k, v]) => (
                      <div key={k} className="px-6 py-4 flex items-start justify-between gap-6">
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0">
                          {prettyKeyTR(k)}
                        </div>
                        <div className="text-[13px] font-semibold text-gray-800 text-right break-words">
                          {normalizeValue(v)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Güvenlik Notu */}
              <div className="bg-sky-50/50 border border-sky-100 rounded-[30px] p-8 flex gap-6 items-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <ShieldCheck className="w-8 h-8 text-[#00AEEF]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Güvenli Tatil Devri
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Ödeme yapmadan önce rezervasyon bilgilerini tesisten teyit etmeyi unutmayın.
                    İsim değişikliği onayı almadan transfer gerçekleştirmeyin.
                  </p>
                </div>
              </div>
            </div>

            {/* SAĞ KOLON: Fiyat + Aksiyon */}
            <div className="relative">
              <div className="sticky top-32 space-y-6">
                <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[3px] mb-2">
                    DEVİR ÜCRETİ
                  </p>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">
                      {ilan.ucret ? ilan.ucret.toLocaleString("tr-TR") : "---"}
                    </span>
                    <span className="text-xl font-bold text-[#00AEEF]">₺</span>
                  </div>

                  <div className="space-y-4">
                    {!isExpired ? (
                      <Link href={`/mesaj/${ilan.id}`}>
                        <Button className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-2xl py-8 font-bold text-sm uppercase tracking-widest shadow-xl shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-3">
                          <MessageCircle size={20} /> MESAJ GÖNDER
                        </Button>
                      </Link>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-400 rounded-2xl py-8 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed">
                        <Clock size={20} /> SÜRESİ DOLDU
                      </div>
                    )}

                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                      Kullanıcı ile doğrudan görüşün
                    </p>
                  </div>
                </div>

                {isExpired && (
                  <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex items-start gap-4">
                    <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                    <p className="text-[11px] text-orange-800 font-bold leading-relaxed uppercase tracking-wider">
                      Bu ilanın yayın süresi dolduğu için yeni mesaj gönderimine kapatılmıştır.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}