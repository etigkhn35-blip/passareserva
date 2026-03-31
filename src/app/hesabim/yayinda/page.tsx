"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import {
  Trash2,
  Edit3,
  Pause,
  ChevronLeft,
  Loader2,
  Info,
  Search,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

/* ---------------- FIX (isExpired) ---------------- */
const isExpired = (ilan: any) => {
  if (!ilan?.bitisTarihi) return false;
  const end =
    ilan.bitisTarihi?.toDate?.() || new Date(ilan.bitisTarihi);
  return end < new Date();
};

/* ---------------- LANGUAGE ---------------- */
const translations = {
  en: {
    title: "ACTIVE LISTINGS",
    subtitle: "Your listings visible to all users",

    loginRequired: "You must log in to view this page.",
    login: "Login",

    empty: "You have no active listings.",
    create: "Create Listing",

    days: "days left",
    price: "LISTING PRICE",
    offer: "Get Offer",

    active: "ACTIVE",

    pause: "Pause",
    edit: "Edit",
    delete: "Delete",

    confirmPause: "Do you want to pause this listing?",
    confirmDelete: "Are you sure you want to delete this listing?",
    error: "An error occurred.",
  },
  pt: {
    title: "ANÚNCIOS ATIVOS",
    subtitle: "Seus anúncios ativos visíveis para todos",

    loginRequired: "Você precisa fazer login.",
    login: "Entrar",

    empty: "Você não tem anúncios ativos.",
    create: "Criar anúncio",

    days: "dias restantes",
    price: "PREÇO",
    offer: "Receber oferta",

    active: "ATIVO",

    pause: "Pausar",
    edit: "Editar",
    delete: "Excluir",

    confirmPause: "Deseja pausar este anúncio?",
    confirmDelete: "Tem certeza que deseja excluir?",
    error: "Erro ocorrido.",
  },
};

export default function YayindaOlanlarPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const currencySymbol = lang === "pt" ? "R$" : "$";

  const [meUid, setMeUid] = useState<string | null>(null);
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const yayindaIlanlar = ilanlar.filter(
    (i) => i.status === "approved" && !isExpired(i)
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setMeUid(user ? user.uid : null);
      if (user) {
        await fetchIlanlar(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const fetchIlanlar = async (uid: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "ilanlar"),
        where("sahipUid", "==", uid),
        where("status", "==", "approved")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setIlanlar(data);
    } catch (err) {
      console.error("İlanlar alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async (id: string) => {
    if (!confirm(t.confirmPause)) return;
    try {
      await updateDoc(doc(db, "ilanlar", id), { status: "paused" });
      setIlanlar((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      alert(t.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      await deleteDoc(doc(db, "ilanlar", id));
      setIlanlar((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">

          {/* Üst Başlık */}
          <div className="flex items-center gap-5 mb-10">
            <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-sky-50 hover:text-[#00AEEF] transition-all group">
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF]" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight uppercase">{t.title}</h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[1.5px] mt-1">{t.subtitle}</p>
            </div>
          </div>

          {!meUid ? (
            <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center shadow-2xl shadow-gray-200/20">
              <Info className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold mb-6">{t.loginRequired}</p>
              <Link href="/giris" className="bg-[#00AEEF] text-white px-8 py-3 rounded-2xl font-semibold text-[11px] uppercase tracking-widest">
                {t.login}
              </Link>
            </div>
          ) : yayindaIlanlar.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center shadow-2xl shadow-gray-200/20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-gray-500 font-semibold text-[13px] uppercase tracking-wide">{t.empty}</p>
              <Link href="/ilan-ver" className="inline-block mt-6 bg-[#00AEEF] text-white px-10 py-4 rounded-2xl font-semibold text-[11px] uppercase tracking-widest shadow-xl shadow-sky-100 hover:translate-y-[-2px] transition-all">
                {t.create}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {yayindaIlanlar.map((ilan) => (
                <div key={ilan.id} className="group bg-white border border-gray-100 rounded-[35px] shadow-2xl shadow-gray-200/20 overflow-hidden hover:shadow-sky-100 transition-all duration-500">
                  
                  <div className="relative h-52 overflow-hidden">
                    <Link href={`/ilan/${ilan.id}`}>
                      <img
                        src={ilan.coverUrl || "/defaults/default.jpg"}
                        alt={ilan.baslik}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </Link>

                    <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                      <span className="text-[9px] font-semibold text-[#00AEEF] uppercase tracking-widest">
                        {t.active}
                      </span>
                    </div>
                  </div>

                  <div className="p-7">
                    <h3 className="font-semibold text-gray-900 text-[14px] uppercase truncate tracking-tight mb-2">
                      {ilan.baslik}
                    </h3>

                    <p className="text-[11px] text-gray-400 line-clamp-2 font-semibold leading-relaxed mb-6 opacity-70">
                      {ilan.aciklama}
                    </p>

                    <div className="text-xs text-gray-400 mb-4">
                      ⏳{" "}
                      {ilan.bitisTarihi?.toDate
                        ? Math.ceil(
                            (ilan.bitisTarihi.toDate().getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : "-"}{" "}
                      {t.days}
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-300 font-semibold uppercase tracking-widest mb-0.5">
                          {t.price}
                        </span>
                        <span className="text-[#FF6B00] font-semibold text-base">
                          {ilan.ucret
                            ? `${ilan.ucret.toLocaleString(locale)} ${currencySymbol}`
                            : t.offer}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handlePause(ilan.id)} className="p-3 text-yellow-500 bg-yellow-50/50 hover:bg-yellow-50 rounded-2xl transition-all">
                          <Pause className="w-4 h-4 fill-current" />
                        </button>

                        <Link href={`/ilan-duzenle/${ilan.id}`} className="p-3 text-blue-500 bg-blue-50/50 hover:bg-blue-50 rounded-2xl transition-all">
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button onClick={() => handleDelete(ilan.id)} className="p-3 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-2xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}