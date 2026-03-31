"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import Link from "next/link";
import { MapPin, Loader2, SearchX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AramaClient({ q }: { q: string }) {

  const { lang } = useLanguage();

  const t = {
    en: {
      emptySearch: "Enter a keyword to search.",
      resultsTitle: "results for",
      searching: "Searching...",
      found: "listings found",
      scanning: "Scanning results...",
      noResult: "No matching results found",
      expiredInfo: "Expired listings are automatically removed from results.",
      priceEmpty: "Price not specified"
    },
    pt: {
      emptySearch: "Digite uma palavra para pesquisar.",
      resultsTitle: "resultados para",
      searching: "Pesquisando...",
      found: "anúncios encontrados",
      scanning: "Buscando resultados...",
      noResult: "Nenhum resultado encontrado",
      expiredInfo: "Anúncios expirados são removidos automaticamente.",
      priceEmpty: "Preço não informado"
    }
  }[lang];

  const searchTerm = q.trim().toLowerCase();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);

      try {
        const qy = query(
          collection(db, "ilanlar"),
          orderBy("olusturmaTarihi", "desc"),
          limit(100)
        );

        const snap = await getDocs(qy);
        const simdi = new Date().getTime();
        const gunMilisaniye = 24 * 60 * 60 * 1000;

        const list: any[] = [];

        snap.forEach((d) => {
          const data = d.data();

          const olusturmaTarihi = data.olusturmaTarihi?.toMillis() || simdi;
          const gecenGun = (simdi - olusturmaTarihi) / gunMilisaniye;
          const limitGun = data.isPaid ? 30 : 15;

          if (gecenGun <= limitGun) {
            const title = data.baslik?.toLowerCase() || "";
            const desc = data.aciklama?.toLowerCase() || "";
            const kategori = data.kategori?.toLowerCase() || "";
            const il = data.il?.toLowerCase() || "";
            const ilce = data.ilce?.toLowerCase() || "";

            if (
              title.includes(searchTerm) ||
              desc.includes(searchTerm) ||
              kategori.includes(searchTerm) ||
              il.includes(searchTerm) ||
              ilce.includes(searchTerm)
            ) {
              list.push({ id: d.id, ...data });
            }
          }
        });

        setResults(list);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  if (!searchTerm) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-slate-400 font-medium">
        {t.emptySearch}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            “{q}” {t.resultsTitle}
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            {loading ? t.searching : `${results.length} ${t.found}`}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-400 tracking-wide">
              {t.scanning}
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[32px] border border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <SearchX className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="font-semibold text-slate-800 text-lg italic">
              {t.noResult}
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              {t.expiredInfo}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((ilan) => (
              <Link
                key={ilan.id}
                href={`/ilan/${ilan.id}`}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={ilan.coverUrl || `/defaults/default.jpg`}
                    alt={ilan.baslik}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {ilan.kategori && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/80 backdrop-blur-sm text-[10px] font-semibold px-2.5 py-1 rounded-full text-slate-600 shadow-sm">
                        {ilan.kategori}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-slate-400 mb-2">
                    <MapPin size={12} className="text-primary" />
                    <span className="text-[11px] font-medium truncate">
                      {ilan.il} {ilan.ilce}
                    </span>
                  </div>

                  <h2 className="text-sm font-semibold text-slate-700 line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[40px] leading-snug">
                    {ilan.baslik}
                  </h2>

                  <p className="text-[12px] text-slate-400 line-clamp-2 mb-4 leading-relaxed font-medium">
                    {ilan.aciklama}
                  </p>
                  
                  <div className="mt-auto pt-3 border-t border-slate-50">
                    <p className="text-accent font-bold text-base tracking-tight">
                      {ilan.ucret
                        ? `${ilan.ucret.toLocaleString()}`
                        : t.priceEmpty}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}