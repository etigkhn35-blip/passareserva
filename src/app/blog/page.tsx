"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Calendar, Clock, ArrowRight } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { lang } = useLanguage();

  const t = {
    en: {
      title: "Travel Guide & Blog",
      subtitle: "Exclusive content to help you discover travel opportunities and experiences.",
      read: "READ MORE",
      min: "MIN"
    },
    pt: {
      title: "Guia de Viagem & Blog",
      subtitle: "Conteúdos exclusivos para você descobrir oportunidades e experiências de viagem.",
      read: "LER MAIS",
      min: "MIN"
    }
  }[lang];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] font-sans">
      
      <Header />

      <main className="flex-grow py-16 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Başlık */}
          <div className="mb-14 text-center md:text-left">
            <h1 className="text-3xl font-semibold text-gray-600 tracking-tight">
              {t.title}
            </h1>
            <p className="text-gray-400 mt-2 text-[15px] font-medium max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          {/* Blog List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.id}`}
                className="group flex flex-col bg-white border border-gray-100 rounded-[28px] overflow-hidden hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500"
              >
                
                <div className="relative h-52 w-full overflow-hidden">
                  <img 
                    src={p.img} 
                    alt={p.title?.[lang] || p.title.en}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} strokeWidth={2.5} /> 2026
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} strokeWidth={2.5} /> 5 {t.min}
                    </span>
                  </div>
                  
                  <h2 className="text-[17px] font-semibold text-gray-600 group-hover:text-[#00AEEF] transition-colors line-clamp-2 leading-snug mb-3">
                    {p.title?.[lang] || p.title.en}
                  </h2>
                  
                  <p className="text-[13.5px] text-gray-500 line-clamp-3 leading-relaxed mb-6 font-medium">
                    {p.desc?.[lang] || p.desc.en}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-[#00AEEF] font-semibold text-[11px] uppercase tracking-wider">
                    {t.read}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      
    </div>
  );
}