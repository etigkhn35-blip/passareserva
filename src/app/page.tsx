"use client";

import Header from "../components/Header";
import { useLanguage } from "@/context/LanguageContext";
import CookiePopup from "../components/CookiePopup";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
type Lang = "en" | "pt";

const translations = {
  en: {
    vitrin: "Featured Listings",
    tumunuGor: "View all listings",
    yukleniyor: "Loading listings...",
    blog: "Blog",
    blogHepsi: "View all posts",
    categoriesTitle: "Categories",

    ipucu: "Tip",
    ipucuText: "Listings with higher discounts sell faster...",
    ucretsiz: "Post for Free",
    nasil: "How it works",

    categories: "Categories",
    featured: "Featured",
    expired: "Expired",
    daysLeft: "days left",
    highlighted: "Featured",
    highlightBoost: "Highlight",
homepageShowcase: "Homepage Showcase",
tipSuffix: "options to boost your listing.",
efsane: "🔥 Top Deals",
harika: "✨ Best Picks",

    footer: {
      quickLinks: "Quick Links",
      home: "Home",
      postAd: "Post Listing",
      allListings: "All Listings",
      howItWorks: "How it works",
      faq: "FAQ",
      contact: "Contact",

      legal: "Legal",
      membership: "Membership Agreement",
      distance: "Distance Sales Agreement",
      kvkk: "Privacy Policy",
      cookies: "Cookie Policy",
      rules: "Listing Rules",
      refund: "Refund Policy",

      contactTitle: "Contact",
      office: "Head Office",
      hotline: "Customer Line",
      email: "Email",

      follow: "Follow Us",
      disclaimer: "This platform is not a travel agency.",
      rights: "All rights reserved."
    },

    // ✅ EN BLOG (9 ADET)
    blogPosts: [
      { title: "What is PassaReserva? How does it work?", desc: "Turn unused holidays into money with ease." },
      { title: "How to transfer hotel reservations?", desc: "Save your money by transferring your booking." },
      { title: "Yacht holidays & blue cruise transfer", desc: "Transfer your yacht booking if you can't go." },
      { title: "Can Airbnb or villa bookings be transferred?", desc: "Don't lose your money, transfer instead." },
      { title: "Tour packages transfer guide", desc: "Recover most of your payment easily." },
      { title: "Concert & festival ticket transfer", desc: "Sell your ticket instead of wasting it." },
      { title: "Workshop & training transfer", desc: "Don't lose your spot, transfer it." },
      { title: "Last-minute strategies", desc: "Boost your listing and sell faster." },
      { title: "Is it safe?", desc: "Guide to safe transfer process." }
    ]
  },

  pt: {
    vitrin: "Anúncios em destaque",
    tumunuGor: "Ver todos os anúncios",
    yukleniyor: "Carregando anúncios...",
    blog: "Blog",
    blogHepsi: "Ver todos os artigos",

    ipucu: "Dica",
    ipucuText: "Anúncios com maiores descontos vendem mais rápido...",
    ucretsiz: "Publicar grátis",
    nasil: "Como funciona",

    categoriesTitle: "Categorias",
    categories: "Categorias",
    featured: "Destaque",
    expired: "Expirado",
    daysLeft: "dias restantes",
    highlighted: "Destacado",
    highlightBoost: "Destacar",
homepageShowcase: "Vitrine da página inicial",
tipSuffix: "opções para fortalecer seu anúncio.",
efsane: "🔥 Ofertas incríveis",
harika: "✨ Melhores escolhas",

    footer: {
      quickLinks: "Links rápidos",
      home: "Início",
      postAd: "Publicar anúncio",
      allListings: "Todos os anúncios",
      howItWorks: "Como funciona",
      faq: "FAQ",
      contact: "Contato",

      legal: "Legal",
      membership: "Contrato de adesão",
      distance: "Contrato de venda à distância",
      kvkk: "Política de privacidade",
      cookies: "Política de cookies",
      rules: "Regras de anúncios",
      refund: "Política de reembolso",

      contactTitle: "Contato",
      office: "Escritório",
      hotline: "Atendimento",
      email: "E-mail",

      follow: "Siga-nos",
      disclaimer: "Esta plataforma não é uma agência de viagens.",
      rights: "Todos os direitos reservados."
    },

    // ✅ PT BLOG (9 ADET)
    blogPosts: [
      { title: "O que é PassaReserva?", desc: "Transforme férias não utilizadas em dinheiro." },
      { title: "Como transferir reservas de hotel?", desc: "Recupere seu dinheiro facilmente." },
      { title: "Férias de iate e cruzeiro", desc: "Transfira sua reserva se não puder ir." },
      { title: "Airbnb ou villa pode ser transferido?", desc: "Não perca dinheiro." },
      { title: "Pacotes de viagem", desc: "Recupere grande parte do valor." },
      { title: "Ingressos de eventos", desc: "Venda seu ingresso." },
      { title: "Workshops e treinamentos", desc: "Não perca sua vaga." },
      { title: "Última hora", desc: "Destaque seu anúncio." },
      { title: "É seguro?", desc: "Guia de segurança." }
    ]
  }
};

/* ----------------------------- TİP TANIMLARI ---------------------------- */
type Card = {
  id: string;
  title: string;
  location: string;
  price: number;
  cover?: string;
  category?: string;
  isFake?: boolean;
  bitisTarihi?: any;

  // ✅ Yeni alanlar
  indirim?: number;
  anasayfaVitrin?: boolean;
  kategorideOneCikar?: boolean;

  systemExpire?: Date | null;
  olusturmaTarihi?: any;
};



/* ----------------------------- DEFAULT GÖRSELLER ---------------------------- */
const DEFAULT_IMAGES: Record<string, string> = {
  Otel: "/defaults/konaklama-otel.jpg",
  "Villa / Yazlık": "/defaults/konaklama-villa.jpg",
  "Global Konaklama İlanları": "/defaults/konaklama-airbnb.jpg",
  "Bungalow / Tiny House": "/defaults/konaklama-bungalow.jpg",
  "Dağ / Yayla Evi": "/defaults/konaklama-yayla.jpg",
  "Tatil Köyü": "/defaults/konaklama-tatilkoyu.jpg",
  "Apart / Rezidans": "/defaults/konaklama-apart.jpg",

  "Tekne / Yat Tatili": "/defaults/deneyim-tekne.jpg",
  "Cruise (Gemi Turu)": "/defaults/deneyim-gemi.jpg",
  "Kamp / Glamping": "/defaults/deneyim-kamp.jpg",
  "Wellness & Spa Tatili": "/defaults/deneyim-spa.jpg",
  "Yoga / Retreat": "/defaults/deneyim-yoga.jpg",
  "Gastronomi Tatili": "/defaults/deneyim-gastronomi.jpg",

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
  "Stand-up": "/defaults/etkinlik-stand-up.jpg",
  "Gösteriler": "/defaults/etkinlik-gosteri.jpg",

  "Dalış / Yelken Eğitimi": "/defaults/etkinlik-dalis-yelken.jpg",
  "Gastronomi Deneyimi": "/defaults/etkinlik-gastronomi-deneyim.jpg",
  "Şarap Tadımı": "/defaults/etkinlik-sarap-tadimi.jpg",
  "Şehir Turları": "/defaults/etkinlik-sehir-turu.jpg",
  "Atölye Deneyimleri": "/defaults/etkinlik-atolye-deneyimi.jpg",

  "Çocuk Festivalleri": "/defaults/etkinlik-cocuk-festivali.jpg",
  "Atölyeler": "/defaults/etkinlik-cocuk-atolye.jpg",
  "Tema Park Biletleri": "/defaults/etkinlik-tema-park.jpg",
  "Oyun Alanları": "/defaults/etkinlik-oyun-alani.jpg",
  "Çocuk Gösterileri": "/defaults/etkinlik-cocuk-gosteri.jpg",

  "Konferans": "/defaults/etkinlik-konferans.jpg",
  "Zirve": "/defaults/etkinlik-zirve.jpg",
  "Fuar Girişleri": "/defaults/etkinlik-fuar.jpg",
  "Networking Event": "/defaults/etkinlik-networking.jpg",
  "Startup Etkinlikleri": "/defaults/etkinlik-startup.jpg",

  Genel: "/defaults/default.jpg",
};

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  // 🏨 ACCOMMODATION
  "Hotels": "/defaults/konaklama-otel.jpg",
  "Villas & Holiday Homes": "/defaults/konaklama-villa.jpg",
  "Apartments & Holiday Rentals": "/defaults/konaklama-apart.jpg",
  "Beach Houses": "/defaults/konaklama-yazlik.jpg",
  "Resorts": "/defaults/konaklama-tatilkoyu.jpg",
  "Cabins & Chalets": "/defaults/konaklama-yayla.jpg",
  "Tiny Houses & Bungalows": "/defaults/konaklama-bungalow.jpg",

  // 🌿 EXPERIENCE
  "Yacht & Sailing Holidays": "/defaults/deneyim-tekne.jpg",
  "Cruise Holidays": "/defaults/deneyim-gemi.jpg",
  "Camping & Glamping Trips": "/defaults/deneyim-kamp.jpg",
  "Ski & Snow Holidays": "/defaults/tur-kayak.jpg",
  "Surf & Adventure Camps": "/defaults/etkinlik-extreme-sports.jpg",
  "Wellness & Spa Retreats": "/defaults/deneyim-spa.jpg",
  "Yoga & Meditation Retreats": "/defaults/deneyim-yoga.jpg",
  "Wine & Gastronomy Trips": "/defaults/deneyim-gastronomi.jpg",

  // 🚌 TOURS
  "Cultural Tours": "/defaults/tur-kultur.jpg",
  "Nature & Hiking Tours": "/defaults/tur-doga.jpg",
  "City Break Tours": "/defaults/etkinlik-sehir-turu.jpg",
  "Ski Tours": "/defaults/tur-kayak.jpg",
  "Honeymoon Packages": "/defaults/tur-balay.jpg",
  "Photography Tours": "/defaults/etkinlik-fotograf-video.jpg",
  "Day Trips & Excursions": "/defaults/tur-gunubirlik.jpg",

  // 🎟️ EVENTS MAIN
  "Festivals & Concerts": "/defaults/etkinlik-festival.jpg",
  "Workshops & Training": "/defaults/etkinlik-workshop.jpg",
  "Sports Events": "/defaults/etkinlik-spor.jpg",
  "Performing Arts & Shows": "/defaults/etkinlik-kultur.jpg",
  "Experiences & Activities": "/defaults/etkinlik-atolye-deneyimi.jpg",
  "Family & Kids Events": "/defaults/etkinlik-cocuk-festivali.jpg",
  "Business & Networking Events": "/defaults/etkinlik-networking.jpg",
  "Food & Wine Events": "/defaults/etkinlik-gastronomi-deneyim.jpg",

  // 🎯 EVENT SUBS
  "Music Festivals": "/defaults/etkinlik-muzik-festivalleri.jpg",
  "Concerts": "/defaults/etkinlik-konserler.jpg",
  "Art": "/defaults/etkinlik-sanat-tasarim.jpg",
  "Photography": "/defaults/etkinlik-fotograf-video.jpg",
  "Football": "/defaults/etkinlik-futbol.jpg",
  "Basketball": "/defaults/etkinlik-basketbol.jpg",
  "Theatre": "/defaults/etkinlik-tiyatro.jpg",
  "Stand-up": "/defaults/etkinlik-stand-up.jpg",
  "Wine tasting": "/defaults/etkinlik-sarap-tadimi.jpg",
  "City tours": "/defaults/etkinlik-sehir-turu.jpg",
  "Kids festivals": "/defaults/etkinlik-cocuk-festivali.jpg",
  "Conferences": "/defaults/etkinlik-konferans.jpg",

  // 🎫 TICKETS
  "Museum & Attraction Tickets": "/defaults/etkinlik-muze.jpg",
  "Theme Park Tickets": "/defaults/etkinlik-tema-park.jpg",
  "Train & Transport Passes": "/defaults/default.jpg",
  "Guided Tour Tickets": "/defaults/etkinlik-sehir-turu.jpg",
  "City Passes": "/defaults/default.jpg",
};

const EVENT_SUBCATEGORIES: Record<string, string[]> = {
  "Festivals & Concerts": ["Music Festivals", "Concerts"],
  "Workshops & Training": ["Art", "Photography"],
  "Sports Events": ["Football", "Basketball"],
  "Performing Arts & Shows": ["Theatre", "Stand-up"],
  "Experiences & Activities": ["Wine tasting", "City tours"],
  "Family & Kids Events": ["Kids festivals"],
  "Business & Networking Events": ["Conferences"],
  "Food & Wine Events": ["Wine tasting"],
};


const CATEGORY_TRANSLATION_MAP: Record<string, string> = {
  "Hotels": "Otel",
  "Villas & Holiday Homes": "Villa / Yazlık",
  "Apartments & Holiday Rentals": "Apart / Rezidans",
  "Yacht & Sailing Holidays": "Tekne / Yat Tatili",
  "Cruise Holidays": "Cruise (Gemi Turu)",
  "Cultural Tours": "Kültür Turları",
  "Festivals & Concerts": "Festival + Konaklama",
};

/* ----------------------------- KATEGORİLER ------------------------------ */
const CATEGORIES = [
  {
    title: {
      en: "Accommodation Listings",
      pt: "Acomodações",
    },
    icon: "🏨",
    subs: [
      { en: "Hotels", pt: "Hotéis" },
      { en: "Apartments & Holiday Rentals", pt: "Apartamentos e Aluguéis" },
      { en: "Villas & Holiday Homes", pt: "Vilas e Casas de Férias" },
      { en: "Resorts", pt: "Resorts" },
      { en: "Cabins & Chalets", pt: "Cabines e Chalés" },
      { en: "Tiny Houses & Bungalows", pt: "Tiny Houses e Bangalôs" },
      { en: "Beach Houses", pt: "Casas de Praia" },
    ],
  },
  {
    title: {
      en: "Experience Holidays",
      pt: "Experiências",
    },
    icon: "🌿",
    subs: [
      { en: "Yacht & Sailing Holidays", pt: "Férias de Iate e Vela" },
      { en: "Cruise Holidays", pt: "Cruzeiros" },
      { en: "Camping & Glamping Trips", pt: "Camping e Glamping" },
      { en: "Ski & Snow Holidays", pt: "Férias de Esqui e Neve" },
      { en: "Surf & Adventure Camps", pt: "Surf e Campos de Aventura" },
      { en: "Wellness & Spa Retreats", pt: "Retiros de Spa e Bem-estar" },
      { en: "Yoga & Meditation Retreats", pt: "Retiros de Yoga e Meditação" },
      { en: "Wine & Gastronomy Trips", pt: "Viagens de Vinho e Gastronomia" },
    ],
  },
  {
    title: {
      en: "Tour Packages",
      pt: "Pacotes de viagem",
    },
    icon: "🚌",
    subs: [
      { en: "Cultural Tours", pt: "Tours Culturais" },
      { en: "Nature & Hiking Tours", pt: "Tours de Natureza e Trilhas" },
      { en: "City Break Tours", pt: "Viagens Curtas Urbanas" },
      { en: "Ski Tours", pt: "Tours de Esqui" },
      { en: "Honeymoon Packages", pt: "Pacotes de Lua de Mel" },
      { en: "Photography Tours", pt: "Tours de Fotografia" },
      { en: "Day Trips & Excursions", pt: "Passeios de Um Dia" },
    ],
  },
  {
    title: {
      en: "Events",
      pt: "Eventos",
    },
    icon: "🎟️",
    subs: [
      { en: "Festivals & Concerts", pt: "Festivais e Concertos" },
      { en: "Workshops & Training", pt: "Workshops e Treinamentos" },
      { en: "Sports Events", pt: "Eventos Esportivos" },
      { en: "Performing Arts & Shows", pt: "Artes Cênicas e Shows" },
      { en: "Experiences & Activities", pt: "Experiências e Atividades" },
      { en: "Family & Kids Events", pt: "Eventos para Família e Crianças" },
      { en: "Business & Networking Events", pt: "Eventos de Networking" },
      { en: "Food & Wine Events", pt: "Eventos de Gastronomia e Vinho" },
    ],
  },
  {
    title: {
      en: "Travel Tickets & Passes",
      pt: "Bilhetes e passes",
    },
    icon: "🎫",
    subs: [
      { en: "Museum & Attraction Tickets", pt: "Ingressos de Museus e Atrações" },
      { en: "Theme Park Tickets", pt: "Ingressos de Parques Temáticos" },
      { en: "Train & Transport Passes", pt: "Passes de Transporte" },
      { en: "Guided Tour Tickets", pt: "Ingressos para Tours Guiados" },
      { en: "City Passes", pt: "City Passes" },
    ],
  },
];

/* -------------------------- KART KOMPONENTİ ------------------------- */
function VitrinCard({
  item,
  t,
  lang,
}: {
  item: Card;
  t: any;
  lang: "en" | "pt";
}) {
  const imageSrc =
    item.cover ||
    DEFAULT_IMAGES[item.category || "Genel"] ||
    DEFAULT_IMAGES["Genel"];

  const formatPrice = (price: number, lang: "en" | "pt") => {
    if (lang === "en") return `$${(price / 32).toFixed(0)}`;
    if (lang === "pt") return `€${(price / 35).toFixed(0)}`;
    return `${price.toLocaleString("tr-TR")} ₺`;
  };

  const indirim = Number((item as any).indirim || 0);
  const isEfsane = indirim >= 40;
  const isHarika = indirim >= 30 && indirim < 40;

  return (
    <a
      href={`/ilan/${item.id}`}
      className={`
        group block rounded-xl overflow-hidden bg-white transition
        active:scale-[0.97] sm:active:scale-100
        ${isEfsane ? "ring-1 ring-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.35)]" : ""}
        ${isHarika ? "border-2 border-green-400 shadow-md" : "border border-gray-200"}
      `}
    >
      {/* GÖRSEL */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100">
        <img src={imageSrc} alt={item.title} className="w-full h-full object-cover" />

        {/* SÜRE */}
        {!item.isFake && (item as any).bitisTarihi && (
          <div className="absolute top-1.5 left-1.5 z-20">
            <div className="bg-green-600 text-white text-[9px] px-2 py-0.5 rounded-md shadow">
              {(() => {
                const raw = (item as any).bitisTarihi;
                const end = raw?.toDate ? raw.toDate() : raw ? new Date(raw) : null;
                if (!end) return null;

                const diffDays = Math.ceil(
                  (end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );

                if (diffDays <= 0) return t.expired;
                return diffDays <= 2 ? `Son ${diffDays}g` : `${diffDays} ${t.daysLeft}`;
              })()}
            </div>
          </div>
        )}

        {/* İNDİRİM */}
        {indirim > 0 && !item.isFake && (
          <div className="absolute top-1.5 right-1.5 z-20">
            <div className="bg-green-600 text-white text-[9px] px-2 py-0.5 rounded-md shadow">
              %{indirim}
            </div>
          </div>
        )}

        {/* ÖNE ÇIKAR */}
        {!item.isFake && (item as any).kategorideOneCikar && (
          <div className="absolute bottom-2 left-2 z-20">
            <div className="bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-md shadow">
              {t.highlighted}
            </div>
          </div>
        )}

        {/* DEVREDİLDİ */}
        {item.isFake && (
          <div className="absolute top-1.5 left-1.5 z-20">
            <div className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-md shadow">
              Transferred
            </div>
          </div>
        )}
      </div>

      {/* METİN */}
      <div className="p-2">
        <div className="text-[11px] text-gray-500 line-clamp-1">
          {item.location}
        </div>

        <div className="font-semibold text-gray-900 mt-0.5 line-clamp-1 text-[12.5px]">
          {item.title}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-primary font-bold text-[12.5px]">
            {formatPrice(item.price, lang)}
          </span>

          {indirim >= 30 && !item.isFake && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm border border-gray-100 text-[10px]">
              {isEfsane ? "🏅" : "🥈"}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

/* ----------------------------- KATEGORİ MENÜ (HEPSİ AÇIK) ----------------------------- */
function CategoryAccordion({ t, lang }: { t: any; lang: Lang }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openEventMain, setOpenEventMain] = useState<string | null>(null);

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-4">

        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {t.categories || "Categories"}
        </h2>

        <div className="space-y-2">
          {CATEGORIES.map((c, idx) => {
            const isOpen = openIndex === idx;
            const isEventPack = c.title.en === "Events";

            return (
              <div
                key={c.title.en}
                className="border border-gray-200 rounded-xl bg-white overflow-hidden"
              >
                <button
                  onClick={() => {
                    setOpenIndex(isOpen ? null : idx);
                    if (isOpen && isEventPack) setOpenEventMain(null);
                  }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 font-semibold text-gray-900"
                >
                  <span>
                    <span className="mr-2">{c.icon}</span>
                    {c.title[lang]}
                  </span>

                  <span className="lg:hidden">{isOpen ? "−" : "+"}</span>
                </button>

                <div
                  className={`px-4 pb-3 text-sm ${
                    isOpen ? "block" : "hidden"
                  } lg:block`}
                >
                  {!isEventPack && (
                    <ul className="space-y-2">
                      {c.subs.map((s) => (
                        <li key={s.en}>
                          <a
                            href={`/kategori/${encodeURIComponent(
                              s.en.toLowerCase().replace(/ /g, "-")
                            )}`}
                            className="block text-gray-700 hover:text-primary"
                          >
                            {s[lang]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {isEventPack && (
                    <div className="space-y-2">
                      {c.subs.map((eventMain) => {
                        const isEventMainOpen =
                          openEventMain === eventMain.en;

                        const eventSubs =
                          EVENT_SUBCATEGORIES[eventMain.en] || [];

                        return (
                          <div
                            key={eventMain.en}
                            className="border border-gray-100 rounded-lg overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenEventMain(
                                  isEventMainOpen ? null : eventMain.en
                                )
                              }
                              className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:text-primary"
                            >
                              <span>{eventMain[lang]}</span>
                              <span className="text-gray-500">
                                {isEventMainOpen ? "−" : "+"}
                              </span>
                            </button>

                            {isEventMainOpen && (
                              <ul className="px-3 pb-2 space-y-1">
                                {eventSubs.map((sub) => (
                                  <li key={sub}>
                                    <a
                                      href={`/kategori/${encodeURIComponent(
                                        sub.toLowerCase().replace(/ /g, "-")
                                      )}`}
                                      className="block text-gray-600 hover:text-primary text-[13px]"
                                    >
                                      • {sub}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      {/* ✅ TEK VE DOĞRU İPUCU KUTUSU */}
<div className="hidden lg:block mt-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-white p-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-white border border-orange-200 flex items-center justify-center shadow-sm">
      <span className="text-lg">💡</span>
    </div>

    <div className="min-w-0">
      <div className="text-sm font-bold text-gray-900">
        {t.ipucu}
      </div>

      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
        {t.ipucuText}{" "}
        <span className="font-semibold text-gray-900">
          {t.highlightBoost}
        </span>{" "}
        veya{" "}
        <span className="font-semibold text-gray-900">
          {t.homepageShowcase}
        </span>{" "}
        {t.tipSuffix}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href="/ilan-ver"
          className="text-xs font-semibold px-3 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
        >
          {t.ucretsiz}
        </a>

        <a
          href="/nasil-calisir"
          className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
          {t.nasil}
        </a>
      </div>
    </div>
  </div>
</div>

      </div>
    </aside>
  );
}
/* ----------------------------- FAKE İLANLAR ----------------------------- */
const SUBCAT_TO_MAIN: Record<string, string> = (() => {
  const acc: Record<string, string> = {};

  // normal kategoriler
  CATEGORIES.forEach((cat) => {
   cat.subs.forEach((sub) => {
  acc[sub.en] = cat.title.en;
});
  });

  // etkinlik alt-alt kategoriler
  Object.entries(EVENT_SUBCATEGORIES).forEach(([main, subs]) => {
    subs.forEach((sub) => {
      acc[sub] = "Events";
    });
  });

  return acc;
})();
function buildFakeListings(): Card[] {
  const cities = [
  // 🇬🇧 UNITED KINGDOM
  "London / Westminster",
  "London / Camden",
  "London / Kensington",
  "Manchester / City Centre",
  "Manchester / Salford",
  "Birmingham / Edgbaston",
  "Birmingham / Digbeth",
  "Liverpool / Central",
  "Liverpool / Anfield",
  "Leeds / City Centre",
  "Bristol / Clifton",
  "Bristol / Redland",
  "Oxford / Headington",
  "Cambridge / Chesterton",
  "Nottingham / West Bridgford",
  "Sheffield / Hillsborough",
  "Brighton / Hove",
  "Newcastle / Jesmond",
  "Leicester / Evington",

  // 🇵🇹 PORTUGAL
  "Lisbon / Alfama",
  "Lisbon / Bairro Alto",
  "Lisbon / Belém",
  "Lisbon / Chiado",
  "Porto / Ribeira",
  "Porto / Boavista",
  "Porto / Foz do Douro",
  "Braga / Centro",
  "Coimbra / Baixa",
  "Faro / Centro",
  "Faro / Praia de Faro",
  "Albufeira / Old Town",
  "Albufeira / Oura",
  "Lagos / Marina",
  "Lagos / Meia Praia",
  "Cascais / Centro",
  "Sintra / Historic Center",
  "Aveiro / Canal District",
  "Évora / Centro Histórico",
];

  const listings: Card[] = [];
  let i = 0;

  Object.keys(SUBCAT_TO_MAIN).forEach((sub) => {
    const main = SUBCAT_TO_MAIN[sub] || "Genel";
    const city = cities[i % cities.length];
    const price = 3000 + (i % 9) * 450;

    const niceTitles = [
      `${sub} için fırsat ilanı`,
      `${sub} devren uygun fiyat`,
      `${sub} erken rezervasyon fırsatı`,
      `${sub} son dakika fırsatı`,
      `${sub} avantajlı paket`,
    ];

    listings.push({
      id: `fake-${i}`,
      title: niceTitles[i % niceTitles.length],
      location: city,
      price,
      category: sub,
      cover:
  CATEGORY_IMAGE_MAP[sub] ||
  DEFAULT_IMAGES[sub] ||
  DEFAULT_IMAGES[main] ||
  DEFAULT_IMAGES["Genel"],
      isFake: true,
    });

    i++;
  });

  return listings;
}

/* ----------------------------- BLOG SLIDER ----------------------------- */
type BlogPost = { title: string; desc: string; href: string; img: string };
function BlogSection({ t }: { t: any }) {
  
  const posts: BlogPost[] = t.blogPosts.map((p: any, i: number) => ({
  title: p.title,
  desc: p.desc,
  href: `/blog/${i + 1}`,
  img: `/images/blog-${i + 1}.jpg`,
}));

  const pages = useMemo(() => {
    const chunked: BlogPost[][] = [];
    for (let i = 0; i < posts.length; i += 3) chunked.push(posts.slice(i, i + 3));
    return chunked;
  }, [posts]);

  const [page, setPage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPage((p) => (p + 1) % pages.length);
    }, 10000);
    return () => clearInterval(t);
  }, [pages.length]);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-3">
  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
    <span className="text-xl">📰</span>
    {t.blog}
  </h2>

  <Link href="/blog" className="text-sm text-primary hover:underline">
    {t.blogHepsi}
  </Link>
</div>

      <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {pages.map((group, idx) => (
              <div key={idx} className="min-w-full p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {group.map((p) => (
                    <Link
                      key={p.title}
                      href={p.href}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition block"
                    >
                      <div className="relative h-36 sm:h-40 md:h-40 w-full overflow-hidden bg-white">
                        <Image
                          src={p.img}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="
                            object-contain md:object-cover bg-white
                            scale-[1.03] -translate-y-0.5
                            md:scale-100 md:translate-y-0
                          "
                        />
                      </div>

                      <div className="p-3">
                        <div className="font-semibold text-gray-900 line-clamp-2 text-sm">
                          {p.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {p.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* nokta göstergesi */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  i === page
                    ? "w-8 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Blog sayfa ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- ANA SAYFA ----------------------------- */
export default function HomePage() {
  
  const { lang } = useLanguage();


  const bannerSrc =
  lang === "en"
    ? "/images/banner-en.jpg"
    : "/images/banner-pt.jpg";

  
  const [vitrin, setVitrin] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [efsane, setEfsane] = useState<Card[]>([]);
  const [muhteşem, setMuhteşem] = useState<Card[]>([]);
const bannerText = {
  en: "Plans change – Transfer your holiday easily",
  pt: "Os planos mudam – Transfira suas férias facilmente",
  
};
 
const t = translations[lang];
const f = translations[lang].footer;
const CATEGORY_TRANSLATION_MAP: Record<string, string> = {
  // 🏨 ACCOMMODATION
  "Hotels": "Otel",
  "Villas & Holiday Homes": "Villa / Yazlık",
  "Apartments & Holiday Rentals": "Apart / Rezidans",
  "Beach Houses": "Villa / Yazlık",
  "Resorts": "Tatil Köyü",
  "Cabins & Chalets": "Dağ / Yayla Evi",
  "Tiny Houses & Bungalows": "Bungalow / Tiny House",

  // 🌿 EXPERIENCE
  "Yacht & Sailing Holidays": "Tekne / Yat Tatili",
  "Cruise Holidays": "Cruise (Gemi Turu)",
  "Camping & Glamping Trips": "Kamp / Glamping",
  "Ski & Snow Holidays": "Kayak Tatili",
  "Surf & Adventure Camps": "Macera & Surf Kampı",
  "Wellness & Spa Retreats": "Wellness & Spa Tatili",
  "Yoga & Meditation Retreats": "Yoga / Retreat",
  "Wine & Gastronomy Trips": "Gastronomi Tatili",

  // 🚌 TOURS
  "Cultural Tours": "Kültür Turları",
  "Nature & Hiking Tours": "Doğa & Trekking Turları",
  "City Break Tours": "Şehir Turları",
  "Ski Tours": "Kayak Turları",
  "Honeymoon Packages": "Balayı Turları",
  "Photography Tours": "Fotoğraf Turları",
  "Day Trips & Excursions": "Günübirlik Turlar",

  // 🎟️ EVENTS MAIN
  "Festivals & Concerts": "Festival + Konaklama",
  "Workshops & Training": "Workshop + Eğitim",
  "Sports Events": "Spor Etkinlikleri",
  "Performing Arts & Shows": "Sahne & Gösteri Sanatları",
  "Experiences & Activities": "Deneyim & Aktivite",
  "Family & Kids Events": "Aile & Çocuk Etkinlikleri",
  "Business & Networking Events": "Business & Networking",
  "Food & Wine Events": "Gastronomi Etkinlikleri",

  // 🎯 EVENT SUBS
  "Music Festivals": "Müzik Festivalleri",
  "Concerts": "Konserler",
  "Art": "Sanat & Tasarım",
  "Photography": "Fotoğraf & Video",
  "Football": "Futbol Maçları",
  "Basketball": "Basketbol / Voleybol",
  "Theatre": "Tiyatro",
  "Stand-up": "Stand-up",
  "Wine tasting": "Şarap Tadımı",
  "City tours": "Şehir Turları",
  "Kids festivals": "Çocuk Festivalleri",
  "Conferences": "Konferans",

  // 🎫 TICKETS
  "Museum & Attraction Tickets": "Müze & Attraction Biletleri",
  "Theme Park Tickets": "Tema Park Biletleri",
  "Train & Transport Passes": "Ulaşım Kartları",
  "Guided Tour Tickets": "Rehberli Tur Biletleri",
  "City Passes": "City Pass",
};

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "ilanlar"),
          where("status", "==", "approved"),
          orderBy("olusturmaTarihi", "desc")
        );

        const snap = await getDocs(q);

        const data = snap.docs
          .map((d) => {
            const doc = d.data() as any;

            const ucret = doc.ucret || 0;
            const orjinal = doc.orjinalFiyat || doc.originalPrice || ucret;
            const indirim =
              orjinal > 0 ? Math.round(((orjinal - ucret) / orjinal) * 100) : 0;

            const kategori = (doc.altKategori || doc.kategori || "Genel")
              .toString()
              .trim();

            // ✅ bitiş tarihi (yeni + eski uyum)
            let systemExpire: Date | null = null;
            if (doc.bitisTarihi) {
              systemExpire = doc.bitisTarihi.toDate
                ? doc.bitisTarihi.toDate()
                : new Date(doc.bitisTarihi);
            } else if (doc.systemExpireDate) {
              systemExpire = doc.systemExpireDate.toDate
                ? doc.systemExpireDate.toDate()
                : new Date(doc.systemExpireDate);
            }

             return {
  id: d.id,
  title: doc.baslik || "İsimsiz İlan",
  location: `${doc.il || ""} ${doc.ilce || ""}`.trim(),
  price: ucret,

  cover: (() => {
    const mappedCategory =
      CATEGORY_TRANSLATION_MAP[kategori] || kategori;

    return (
      doc.coverUrl ||
      doc.cover ||
      (Array.isArray(doc.images) && doc.images.length > 0
        ? doc.images[0]
        : null) ||
      DEFAULT_IMAGES[mappedCategory] ||
      DEFAULT_IMAGES["Genel"]
    );
  })(),

  category: kategori,

  indirim,
  anasayfaVitrin: Boolean(doc.anasayfaVitrin),

              // ✅ KATEGORİDE ÖNE ÇIKAR (yeni + eski uyum)
              kategorideOneCikar: Boolean(doc.kategorideOneCikar || doc.oneCikar),

              bitisTarihi: doc.bitisTarihi || doc.systemExpireDate || null,
              systemExpire,
              olusturmaTarihi: doc.olusturmaTarihi,
            } as Card;
          })
          .filter((item) => {
            const simdi = new Date();
            let finalExpireDate = item.systemExpire;

            if (!finalExpireDate && item.olusturmaTarihi) {
              const createdAt = item.olusturmaTarihi.toDate
                ? item.olusturmaTarihi.toDate()
                : new Date(item.olusturmaTarihi);
              finalExpireDate = new Date(createdAt);
              finalExpireDate.setDate(finalExpireDate.getDate() + 15);
            }

            if (finalExpireDate && finalExpireDate < simdi) return false;
            return true;
          });

        /* 🔥 EFSANE (%40+) */
        setEfsane(data.filter((i) => (i.indirim || 0) >= 40).slice(0, 12));

        /* ✨ HARİKA (%30–39) */
        setMuhteşem(
          data.filter((i) => (i.indirim || 0) >= 30 && (i.indirim || 0) < 40).slice(0, 12)
        );

        /* 🧠 ANASAYFA VİTRİN KURALI */
        const vitrineGirecekGercekIlanlar = data.filter((i) => {
          if ((i.indirim || 0) < 30) return true;
          if ((i.indirim || 0) >= 30 && i.anasayfaVitrin) return true;
          return false;
        });

        /* ✅ SIRALAMA: KATEGORİDE ÖNE ÇIKAR > İNDİRİM > YENİLİK */
        const sorted = [...vitrineGirecekGercekIlanlar].sort((a: any, b: any) => {
          const aBoost = a.kategorideOneCikar ? 1 : 0;
          const bBoost = b.kategorideOneCikar ? 1 : 0;
          if (bBoost !== aBoost) return bBoost - aBoost;

          if ((b.indirim || 0) !== (a.indirim || 0)) return (b.indirim || 0) - (a.indirim || 0);

          const aTime = a.olusturmaTarihi?.toDate ? a.olusturmaTarihi.toDate().getTime() : 0;
          const bTime = b.olusturmaTarihi?.toDate ? b.olusturmaTarihi.toDate().getTime() : 0;
          return bTime - aTime;
        });

        /* 🧱 FAKE İLANLAR */
        const fakeListings: Card[] = buildFakeListings();

        /* 🎯 HER ZAMAN 24 KART */
        const VITRIN_TARGET = 24;
        let vitrinFinal: Card[] = [...sorted];

        if (vitrinFinal.length < VITRIN_TARGET) {
          const need = VITRIN_TARGET - vitrinFinal.length;
          vitrinFinal = [...vitrinFinal, ...fakeListings.slice(0, need)];
        }

        setVitrin(vitrinFinal.slice(0, VITRIN_TARGET));
      } catch (err) {
        console.error("❌ Firestore veri çekme hatası:", err);
        setVitrin(buildFakeListings().slice(0, 24));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const VITRIN_LIMIT = 24;
  const vitrinView: Card[] = vitrin.slice(0, VITRIN_LIMIT);

  return (
    <>
      <Header />


      {/* BANNER */}
      
      <section className="bg-white border-b border-gray-200">
  <div className="max-w-[1200px] mx-auto px-0 md:px-4 py-0 md:py-4">
    <div className="relative">
 
          <img
        src={bannerSrc}
        alt="PassaReserva Banner"
        className="w-full h-auto rounded-none md:rounded-lg"
      />

            {/* CTA */}
            <a
              href="/ilan-ver"
              className="
                absolute
                bg-white
                text-orange-500
                font-semibold
                shadow-lg
                hover:bg-orange-50
                transition-all
                duration-200
                px-6 py-3 text-base rounded-full
                max-md:px-3 max-md:py-1 max-md:text-[11px] max-md:rounded-xl
                hidden md:inline-flex
              "
              style={{
                top: "76.4%",
                left: "62.5%",
                transform: "translate(-50%, 0)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  animation: "textPulse 1.8s ease-in-out infinite",
                }}
              >
                {t.ucretsiz}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* İçerik */}
      <main className="min-h-screen bg-white">
        <section className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-6">
      <CategoryAccordion t={t} lang={lang} />

            {/* Orta Alan */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
{t.vitrin}                </h2>
                <a href="/tum-ilanlar" className="text-sm text-primary hover:underline">
{t.tumunuGor}                </a>
              </div>

              {loading ? (
                <p className="text-center text-gray-500 py-6">{t.yukleniyor}</p>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {vitrinView.map((v) => (
                     <VitrinCard key={v.id} item={v} t={t} lang={lang} />
                    ))}
                  </div>
                </AnimatePresence>
              )}

              {/* Sponsor Reklam */}
              <section className="max-w-[800px] mx-auto px-0 py-6">
                <img
                  src="/images/ad-wide.jpg"
                  alt="Sponsorlu Reklam"
                  className="w-full h-auto rounded-xl border border-gray-200"
                />
              </section>

              {/* Efsane */}
              {efsane.length > 0 && (
                <div className="mt-2 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
  <span className="text-xl"></span>
  {t.efsane}
</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {efsane.map((v) => (
                 <VitrinCard key={v.id} item={v} t={t} lang={lang} />
                    ))}
                  </div>
                </div>
              )}

              {/* Harika */}
              {muhteşem.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
  <span className="text-xl"></span>
  {t.harika}
</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {muhteşem.map((v) => (
                    <VitrinCard key={v.id} item={v} t={t} lang={lang} />
                    ))}
                  </div>
                </div>
              )}

              {/* 📱 MOBİL İPUCU */}
<div className="lg:hidden mt-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-white p-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-white border border-orange-200 flex items-center justify-center shadow-sm">
      <span className="text-lg">💡</span>
    </div>

    <div className="min-w-0">
      <div className="text-sm font-bold text-gray-900">{t.ipucu}</div>

      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
        {t.ipucuText}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href="/ilan-ver"
          className="text-xs font-semibold px-3 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
        >
          {t.ucretsiz}
        </a>

        <a
          href="/nasil-calisir"
          className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
          {t.nasil}
        </a>
      </div>
    </div>
  </div>
</div>

              <BlogSection t={t} />
            </section>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white text-gray-600 mt-12 border-t border-gray-200 pt-12 pb-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left text-sm">
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-600 mb-5 text-base tracking-tight uppercase">
                {f.quickLinks}
              </h3>
              <ul className="space-y-3 text-[13px]">
                <li>
                  <Link href="/" className="hover:text-orange-500 transition-colors">
                    {f.home}
                  </Link>
                </li>
                <li>
                  <Link href="/ilan-ver" className="hover:text-orange-500 transition-colors">
                    {f.postAd}
                  </Link>
                </li>
                <li>
                  <Link href="/tum-ilanlar" className="hover:text-orange-500 transition-colors">
                    {f.allListings}
                  </Link>
                </li>
                <li>
                  <Link href="/nasil-calisir" className="hover:text-orange-500 transition-colors">
                    {f.howItWorks}
                  </Link>
                </li>
                <li>
                  <Link href="/sss" className="hover:text-orange-500 transition-colors">
                    {f.faq}
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="hover:text-orange-500 transition-colors">
             {f.contactTitle}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold text-gray-600 mb-5 text-base tracking-tight uppercase">
                {f.legal}
              </h3>
              <ul className="space-y-3 text-[13px]">
                <li>
                  <Link
                    href="/bireysel-uyelik-sozlesmesi"
                    className="hover:text-orange-500 transition-colors"
                  >
                    {f.membership}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mesafeli-satis-sozlesmesi"
                    className="hover:text-orange-500 transition-colors"
                  >
                    {f.distance}
                  </Link>
                </li>
                <li>
                  <Link href="/kvkk" className="hover:text-orange-500 transition-colors">
                    {f.kvkk}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cerez-politikasi"
                    className="hover:text-orange-500 transition-colors"
                  >
                    {f.cookies}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ilan-verme-kurallari"
                    className="hover:text-orange-500 transition-colors"
                  >
                    {f.rules}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/odeme-iptal-iade"
                    className="hover:text-orange-500 transition-colors"
                  >
                    {f.refund}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold text-gray-600 mb-5 text-base tracking-tight uppercase">
                {f.contact}
              </h3>
              <div className="space-y-3 text-[13px]">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    {f.office}
                  </span>
                  <p className="text-gray-700 text-[13px]">
                    Dikilitaş Mah. Emirhan Cad. Barbaros Sok. No:2 D:3 Beşiktaş / İstanbul
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    {f.hotline}
                  </span>
                  <p className="text-gray-700 text-[13px] hover:text-orange-500 transition-colors">
                    +90 (850) 304 84 01
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    {f.email}
                  </span>
                  <a
                    href="mailto:info@passareserva.com"
                    className="text-gray-700 text-[13px] hover:text-orange-500 transition-colors "
                  >
                    info @ passareserva.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold text-gray-600 mb-5 text-base tracking-tight uppercase">
                {f.follow}
              </h3>
              <div className="flex flex-col space-y-3 text-[13px]">
                {[
                  { name: "Instagram", url: "https://instagram.com/passareserva" },
                  { name: "LinkedIn", url: "https://linkedin.com/company/passareserva" },
                  { name: "X (Twitter)", url: "https://x.com/passareserva" },
                  { name: "Facebook", url: "https://facebook.com/passareserva" },
                  { name: "YouTube", url: "https://youtube.com/@passareserva" },
                  { name: "TikTok", url: "https://tiktok.com/@passareserva" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="text-gray-600 hover:text-orange-500 flex items-center gap-2 group transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gray-50 border border-gray-100 p-5 rounded text-[11px] text-gray-500 leading-relaxed italic text-justify">
            {f.disclaimer}
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/images/visa.svg" alt="Visa" className="h-5 md:h-7 w-auto object-contain transform scale-110" />
            <img src="/images/MasterCard_Logo.png" alt="Mastercard" className="h-6 md:h-8 w-auto object-contain" />
            <img src="/images/troy.png" alt="Troy" className="h-4 md:h-5 w-auto object-contain" />

            <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 border border-gray-200 px-2.5 py-1 rounded bg-white shadow-sm cursor-default">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-gray-500 tracking-tighter uppercase font-sans">
                  SSL Secured
                </span>
              </div>

              <div className="flex items-center gap-1.5 border border-gray-200 px-2.5 py-1 rounded bg-white shadow-sm cursor-default">
                <div className="bg-blue-600 text-white text-[8px] px-1 rounded font-bold font-sans">3D</div>
                <span className="text-[10px] font-bold text-gray-500 tracking-tighter uppercase font-sans">
                  3D Secure
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[12px] text-gray-400 tracking-tight">
              © {new Date().getFullYear()}{" "}
              <span className="font-bold">
                <span className="text-sky-500">passa</span>
                <span className="text-orange-500">reserva</span>
                <span className="text-gray-600">.com</span>
              </span>{" "}
              – All rights reserved.
            </div>

            

            <div className="flex items-center gap-4">
              <div className="text-[10px] border border-gray-200 text-gray-400 px-3 py-1 rounded-sm font-medium tracking-widest uppercase shadow-sm">
                ETBİS
              </div>
              <div className="text-[10px] border border-gray-200 text-blue-500 px-3 py-1 rounded-sm font-bold tracking-widest uppercase shadow-sm">
                TRGO
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CookiePopup />
    </>
  );
}