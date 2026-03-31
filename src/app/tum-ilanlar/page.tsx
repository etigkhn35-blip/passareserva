"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Search, MapPin, ArrowUpDown, Loader2, 
  ChevronRight, Layers
} from "lucide-react";

/* ---------------- TRANSLATION ---------------- */
const translations = {
  en: {
    explore: "Explore Listings",
    total: "listings found",
    searchPlaceholder: "City or listing...",
    sort: "Sort",
    low: "Lowest Price",
    high: "Highest Price",
    fee: "Transfer Price",
    loading: "Loading Data",
    all: "All",
    categories: ["All", "Accommodation", "Experiences", "Tours", "Events"],
  },
  pt: {
    explore: "Explorar Anúncios",
    total: "anúncios encontrados",
    searchPlaceholder: "Cidade ou anúncio...",
    sort: "Ordenar",
    low: "Menor Preço",
    high: "Maior Preço",
    fee: "Preço de Transferência",
    loading: "Carregando Dados",
    all: "Todos",
    categories: ["Todos", "Acomodações", "Experiências", "Tours", "Eventos"],
  }
};

/* --------------------------------------------------------- */
function ListingCard({ item, t }: { item: any, t: any }) {
  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-sky-100 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col h-full">
      <Link href={`/ilan/${item.id}`} className="flex flex-col h-full">
        
        <div className="relative overflow-hidden aspect-[16/10]">
          <img
            src={item.cover || "/defaults/default.jpg"}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md text-slate-500 text-[10px] font-medium px-3 py-1 rounded-full shadow-sm border border-slate-50 tracking-wide">
              {item.category}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-1.5 text-slate-400 mb-2">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span className="text-[11px] font-light truncate">{item.location}</span>
          </div>

          <h3 className="font-medium text-slate-600 text-[15px] leading-relaxed mb-4 line-clamp-2 min-h-[45px] group-hover:text-sky-500 transition-colors">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 mb-5">
             <div className="flex items-center gap-1 text-[10px] text-slate-300 font-light italic">
                <Layers className="w-3 h-3" />
                <span>#{item.id.slice(0,6)}</span>
             </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5 font-light">{t.fee}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-slate-700 tracking-tight">
                  {item.price.toLocaleString("en-US")}
                </span>
                <span className="text-orange-400 text-xs font-medium">€</span>
              </div>
            </div>
            
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function TumIlanlarPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"artan" | "azalan" | "varsayılan">("varsayılan");
  const [loading, setLoading] = useState(true);

  const [lang, setLang] = useState<"en" | "pt">("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "en" | "pt";
    if (savedLang) setLang(savedLang);
  }, []);

  const t = translations[lang];

  const categories = t.categories;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(query(collection(db, "ilanlar"), orderBy("olusturmaTarihi", "desc")));
        const simdi = new Date().getTime();
        const data = snapshot.docs.map((d) => {
          const docData = d.data();
          const olusturmaTarihi = docData.olusturmaTarihi?.toMillis() || simdi;
          const gecenGun = (simdi - olusturmaTarihi) / (24 * 60 * 60 * 1000);
          return { id: d.id, gecenGun, ...docData };
        });
        const aktifIlanlar = data.filter((x: any) => (x.isPaid ? 30 : 15) >= x.gecenGun);
        setListings(aktifIlanlar.map((x: any) => ({
          id: x.id,
          title: x.baslik,
          location: `${x.il || ""} ${x.ilce || ""}`,
          price: x.ucret || 0,
          category: x.kategori,
          cover: x.coverUrl
        })));
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchListings();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = listings.filter(item => 
      (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || item.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === t.all || item.category === selectedCategory)
    );
    if (sortOrder === "artan") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "azalan") result.sort((a, b) => b.price - a.price);
    return result;
  }, [listings, searchTerm, selectedCategory, sortOrder, t]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow">
        <section className="bg-white border-b border-slate-50 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col gap-10">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-light text-slate-700 tracking-tight">{t.explore}</h1>
                  <p className="text-slate-400 text-sm mt-2 font-light">
                    {filteredAndSorted.length} {t.total}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-light outline-none focus:bg-white focus:ring-1 focus:ring-sky-100 transition-all"
                    />
                  </div>

                  <div className="relative">
                     <select 
                        onChange={(e) => setSortOrder(e.target.value as any)} 
                        className="appearance-none w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-medium text-slate-500 outline-none cursor-pointer pr-12 focus:bg-white transition-all"
                     >
                        <option value="varsayılan">{t.sort}</option>
                        <option value="artan">{t.low}</option>
                        <option value="azalan">{t.high}</option>
                     </select>
                     <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {categories.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 border ${
                      selectedCategory === cat 
                      ? "bg-slate-800 border-slate-800 text-white shadow-sm" 
                      : "bg-white border-slate-100 text-slate-400 hover:bg-sky-500 hover:border-sky-500 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-10 h-10 text-sky-200 animate-spin" />
              <p className="mt-4 text-slate-300 text-xs font-light tracking-widest uppercase">
                {t.loading}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSorted.map((item) => (
                <ListingCard key={item.id} item={item} t={t} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}