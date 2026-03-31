"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogDetailPage() {
  const { id } = useParams();
  const { lang } = useLanguage(); // ✅ BURAYA ALDIK

  const t = {
    en: {
      notFound: "Blog post not found.",
      backList: "Back to blog list",
      allPosts: "ALL POSTS",
      read: "MIN READ",
      footerInfo: "This content is for informational purposes as a travel guide.",
      other: "Read Other Articles"
    },
    pt: {
      notFound: "Post não encontrado.",
      backList: "Voltar para o blog",
      allPosts: "TODOS OS ARTIGOS",
      read: "MIN LEITURA",
      footerInfo: "Este conteúdo é apenas informativo como guia de viagem.",
      other: "Ler outros artigos"
    }
  }[lang];

  const post = blogPosts.find((p) => p.id === String(id));

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-4 uppercase tracking-tight">
              {t.notFound}
            </h2>
            <Link href="/blog" className="text-[#00AEEF] font-medium hover:underline text-sm uppercase tracking-widest">
              {t.backList}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />

      <main className="flex-grow bg-[#F8FAFC]/50 py-12 md:py-20">
        <div className="max-w-[800px] mx-auto px-6">
          
          {/* Geri */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[11px] font-semibold text-gray-400 hover:text-[#00AEEF] transition-colors mb-8 group uppercase tracking-[0.15em]"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            {t.allPosts}
          </Link>

          {/* Başlık */}
          <header className="mb-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-600 leading-tight mb-6 tracking-tight">
              {post.title?.[lang] || post.title.en}
            </h1>
            
            <div className="flex items-center gap-6 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-300" strokeWidth={2.5} /> 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-gray-300" strokeWidth={2.5} /> 5 {t.read}
              </span>
            </div>
          </header>

          {/* Görsel */}
          <div className="relative h-[300px] md:h-[450px] w-full rounded-[24px] overflow-hidden shadow-sm border border-gray-100 mb-12">
            <img
              src={post.img}
              alt={post.title?.[lang] || post.title.en}
              className="w-full h-full object-cover"
            />
          </div>

          {/* İçerik */}
          <article className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-14 shadow-sm">
            <div
              className="prose prose-gray max-w-none 
                text-gray-500 leading-[1.9] 
                prose-headings:text-gray-600 prose-headings:font-semibold 
                prose-p:mb-6 prose-strong:text-gray-700 prose-strong:font-semibold"
              dangerouslySetInnerHTML={{
                __html: post.content?.[lang] || post.content.en,
              }}
            />
          </article>

          {/* Alt */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-[12px] text-gray-400 font-medium italic">
               {t.footerInfo}
             </p>
             <Link href="/blog" className="text-[11px] font-semibold text-[#00AEEF] hover:opacity-80 transition uppercase tracking-wider">
               {t.other} →
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}