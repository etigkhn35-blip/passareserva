"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { isExpired } from "@/lib/ilanStatus";
import { useRouter } from "next/navigation";

import {
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Loader2,
  Archive,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function SuresiDolanIlanlarPage() {
  const [meUid, setMeUid] = useState<string | null>(null);
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { lang } = useLanguage();

  const t = {
    en: {
      title: "EXPIRED LISTINGS",
      subtitle: "Expired and Archived Listings",

      loginRequired: "You must log in to view this page.",
      login: "LOGIN",

      empty: "You do not have any expired listings.",

      sold: "TRANSFERRED",
      expired: "EXPIRED",

      priceLabel: "SERVICE FEE",
      view: "VIEW",
      extend: "EXTEND",

      currency: "₺",
      locale: "en-US",
    },

    pt: {
      title: "ANÚNCIOS EXPIRADOS",
      subtitle: "Anúncios expirados e arquivados",

      loginRequired: "Você precisa fazer login para visualizar esta página.",
      login: "ENTRAR",

      empty: "Você não possui anúncios expirados.",

      sold: "TRANSFERIDO",
      expired: "EXPIRADO",

      priceLabel: "TAXA",
      view: "VER",
      extend: "ESTENDER",

      currency: "₺",
      locale: "pt-BR",
    },
  }[lang];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setMeUid(currentUser ? currentUser.uid : null);

      if (currentUser) {
        await fetchIlanlar(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const fetchIlanlar = async (uid: string) => {
    try {
      setLoading(true);

      const q = query(collection(db, "ilanlar"), where("sahipUid", "==", uid));
      const snap = await getDocs(q);

      const data = snap.docs
        .map((d) => {
          const docData = d.data() as any;
          const expireDate = docData.bitisTarihi?.toDate
            ? docData.bitisTarihi.toDate()
            : null;

          return { id: d.id, ...docData, expireDate };
        })
        .filter((ilan) => isExpired(ilan));

      setIlanlar(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
          <div className="flex items-center gap-5 mb-10">
            <Link
              href="/hesabim"
              className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-sky-50 hover:text-[#00AEEF] transition-all group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF]" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight uppercase">
                {t.title}
              </h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[1.5px] mt-1">
                {t.subtitle}
              </p>
            </div>
          </div>

          {!meUid ? (
            <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center shadow-2xl shadow-gray-200/20">
              <p className="text-gray-500 font-semibold mb-6">
                {t.loginRequired}
              </p>
              <Link
                href="/giris"
                className="bg-[#00AEEF] text-white px-8 py-3 rounded-2xl font-semibold text-[11px] uppercase tracking-widest"
              >
                {t.login}
              </Link>
            </div>
          ) : ilanlar.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center shadow-2xl shadow-gray-200/20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Archive className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-gray-500 font-semibold text-[11px] uppercase tracking-widest opacity-60">
                {t.empty}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ilanlar.map((ilan) => (
                <div
                  key={ilan.id}
                  className="group bg-white border border-gray-100 rounded-[35px] shadow-2xl shadow-gray-200/20 overflow-hidden hover:shadow-sky-100 transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ilan.coverUrl || "/defaults/default.jpg"}
                      alt={ilan.baslik}
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute top-5 left-5">
                      {ilan.status === "sold" ? (
                        <span className="bg-green-600/90 backdrop-blur-sm text-white text-[9px] font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> {t.sold}
                        </span>
                      ) : (
                        <span className="bg-gray-800/90 backdrop-blur-sm text-white text-[9px] font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 uppercase tracking-widest">
                          <AlertTriangle className="w-3 h-3" /> {t.expired}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-7">
                    <h3 className="font-semibold text-gray-800 text-[14px] uppercase truncate tracking-tight mb-2">
                      {ilan.baslik}
                    </h3>

                    <p className="text-[11px] text-gray-400 line-clamp-2 font-semibold leading-relaxed mb-6 opacity-70">
                      {ilan.aciklama}
                    </p>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-300 font-semibold uppercase tracking-widest mb-0.5">
                          {t.priceLabel}
                        </span>
                        <span className="text-[#FF6B00] font-semibold text-base opacity-50">
                          {ilan.ucret
                            ? `${ilan.ucret.toLocaleString(t.locale)} ${t.currency}`
                            : "---"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ilan/${ilan.id}`}
                          className="flex items-center gap-2 text-[10px] font-semibold text-[#00AEEF] bg-sky-50 px-5 py-2.5 rounded-xl uppercase tracking-widest hover:bg-[#00AEEF] hover:text-white transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> {t.view}
                        </Link>

                        <button
                          onClick={() =>
                            router.push(`/odeme/ilan-uzatma/${ilan.id}`)
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:bg-blue-700 transition"
                        >
                          {t.extend}
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