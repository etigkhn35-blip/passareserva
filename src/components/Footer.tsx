"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { lang } = useLanguage();

  const t = {
    en: {
      quick: "QUICK LINKS",
      home: "Home",
      post: "Post Listing",
      all: "All Listings",
      how: "How it works",
      faq: "FAQ",
      contact: "Contact",

      legal: "LEGAL",
      membership: "Membership Agreement",
      distance: "Distance Sales Agreement",
      privacy: "Privacy Policy",
      cookie: "Cookie Policy",
      rules: "Listing Rules",
      refund: "Refund Policy",

      contactTitle: "CONTACT",
      office: "HEAD OFFICE",
      hotline: "CUSTOMER LINE",
      email: "EMAIL",

      follow: "FOLLOW US",

      disclaimer: "This platform is not a travel agency.",

      rights: "All rights reserved.",
    },
    pt: {
      quick: "LINKS RÁPIDOS",
      home: "Início",
      post: "Publicar anúncio",
      all: "Todos anúncios",
      how: "Como funciona",
      faq: "Perguntas frequentes",
      contact: "Contato",

      legal: "LEGAL",
      membership: "Contrato de adesão",
      distance: "Contrato de venda à distância",
      privacy: "Política de privacidade",
      cookie: "Política de cookies",
      rules: "Regras de anúncios",
      refund: "Política de reembolso",

      contactTitle: "CONTATO",
      office: "SEDE",
      hotline: "SUPORTE",
      email: "EMAIL",

      follow: "SIGA-NOS",

      disclaimer: "Esta plataforma não é uma agência de viagens.",

      rights: "Todos os direitos reservados.",
    },
  }[lang];

  const socialLinks = [
    { name: "Instagram", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "X (Twitter)", url: "#" },
    { name: "Facebook", url: "#" },
    { name: "YouTube", url: "#" },
    { name: "TikTok", url: "#" },
  ];

  return (
    <footer className="bg-white text-gray-600 mt-12 border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-[1200px] mx-auto px-4">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left text-sm">

          {/* QUICK */}
          <div>
            <h3 className="font-bold mb-5 uppercase">{t.quick}</h3>
            <ul className="space-y-3 text-[13px]">
              <li><Link href="/">{t.home}</Link></li>
              <li><Link href="/ilan-ver">{t.post}</Link></li>
              <li><Link href="/tum-ilanlar">{t.all}</Link></li>
              <li><Link href="/nasil-calisir">{t.how}</Link></li>
              <li><Link href="/sss">{t.faq}</Link></li>
              <li><Link href="/iletisim">{t.contact}</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="font-bold mb-5 uppercase">{t.legal}</h3>
            <ul className="space-y-3 text-[13px]">
              <li><Link href="/bireysel-uyelik-sozlesmesi">{t.membership}</Link></li>
              <li><Link href="/mesafeli-satis-sozlesmesi">{t.distance}</Link></li>
              <li><Link href="/kvkk">{t.privacy}</Link></li>
              <li><Link href="/cerez-politikasi">{t.cookie}</Link></li>
              <li><Link href="/ilan-verme-kurallari">{t.rules}</Link></li>
              <li><Link href="/odeme-iptal-iade">{t.refund}</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-bold mb-5 uppercase">{t.contactTitle}</h3>

            <div className="space-y-3 text-[13px]">
              <div>
                <span className="text-[11px] text-gray-400 uppercase block mb-1">
                  {t.office}
                </span>
                <p>Dikilitaş / İstanbul</p>
              </div>

              <div>
                <span className="text-[11px] text-gray-400 uppercase block mb-1">
                  {t.hotline}
                </span>
                <p>+90 (850) 304 84 01</p>
              </div>

              <div>
                <span className="text-[11px] text-gray-400 uppercase block mb-1">
                  {t.email}
                </span>
                <p>info@passareserva.com</p>
              </div>
            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="font-bold mb-5 uppercase">{t.follow}</h3>
            <div className="space-y-3 text-[13px]">
              {socialLinks.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-12 bg-gray-50 border p-5 rounded-2xl text-xs italic">
          {t.disclaimer}
        </div>

        {/* PAYMENT + SECURITY */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 opacity-70">
          <img src="/images/visa.svg" className="h-5" />
          <img src="/images/MasterCard_Logo.png" className="h-6" />
          <img src="/images/troy.png" className="h-5" />

          <div className="flex items-center gap-3">
            <div className="border px-3 py-1 text-xs rounded">SSL SECURED</div>
            <div className="border px-3 py-1 text-xs rounded">3D SECURE</div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>
            © {currentYear} <b>passareserva.com</b> – {t.rights}
          </div>

          <div className="flex gap-3">
            <div className="border px-3 py-1 rounded">ETBİS</div>
            <div className="border px-3 py-1 rounded text-blue-500">TRGO</div>
          </div>
        </div>

      </div>
    </footer>
  );
}