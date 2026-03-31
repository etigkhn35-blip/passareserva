"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function BireyselUyelikSozlesmesiPage() {

  const { lang } = useLanguage();

  const t = {
    en: {
      title: "Individual Membership Agreement",
      version: "Latest Version – 2025",

      intro1: "This Individual Membership Agreement (“Agreement”) has been concluded electronically between the Company and the real person user (“Member”) who registers to benefit from the services provided via www.passareserva.com.",
      intro2: "By approving this Agreement electronically, the Member declares that they have read, understood, and accepted all terms without reservation.",

      d1: "Definitions",
      d2: "Site: PassaReserva website and all mobile applications.",
      d3: "Member: A registered user.",
      d4: "Visitor: A user accessing the site without registration.",
      d5: "Service: Listing, search, filtering, and messaging services.",
      d6: "Content: All listings, images, and messages uploaded to the site.",

      s1: "Subject and Scope",
      s2: "PassaReserva is only a listing platform. It is not an intermediary, broker, or travel agency. It does not guarantee transactions between users and is not a party to them.",

      m1: "Membership Conditions",
      m2: "The Member declares that the information provided is accurate. Multiple account creation is prohibited. Account security is the sole responsibility of the Member.",

      r1: "Role of PassaReserva",
      r2: "The platform only provides listing display services. The legality of listings is the responsibility of the listing owner. Financial processes between buyer and seller belong to the parties.",

      l1: "Listing Rules",
      l2: "The Member is obliged not to share misleading or false content. The Company reserves the right to remove listings without justification.",

      p1: "Pricing and Service Fees",
      p2: "PassaReserva reserves the right to offer its services free or paid. The platform does not charge commission on direct transactions between users.",

      b1: "User Behavior Rules",
      b2: "The Member agrees to comply with applicable laws. Harassment of other users or compromising system security is prohibited.",

      k1: "Personal Data Protection",
      k2: "User data is processed in accordance with applicable laws. The Privacy Notice is considered an integral part of this agreement.",

      f1: "Intellectual Property Rights",
      f2: "All rights to the platform’s logo, design, and software belong to the Company. Unauthorized copying or commercial use is prohibited.",

      end: "This agreement consists of 9 articles and is deemed to enter into force upon completion of membership.",
      back: "Back to Home"
    },

    pt: {
      title: "Contrato de Associação Individual",
      version: "Versão Atual – 2025",

      intro1: "Este contrato foi celebrado eletronicamente entre a empresa e o usuário (“Membro”) através da plataforma www.passareserva.com.",
      intro2: "Ao aceitar este contrato, o usuário declara que leu, compreendeu e concorda com todos os termos.",

      d1: "Definições",
      d2: "Site: Plataforma PassaReserva e aplicações móveis.",
      d3: "Membro: Usuário registrado.",
      d4: "Visitante: Usuário não registrado.",
      d5: "Serviço: Serviços de anúncio, busca e mensagens.",
      d6: "Conteúdo: Todos os dados enviados.",

      s1: "Objeto e Escopo",
      s2: "PassaReserva é apenas uma plataforma de anúncios. Não é intermediária nem agência e não garante transações.",

      m1: "Condições de Associação",
      m2: "O usuário declara que suas informações são corretas. É proibido criar múltiplas contas.",

      r1: "Função da Plataforma",
      r2: "A plataforma apenas exibe anúncios. Toda responsabilidade pertence ao anunciante.",

      l1: "Regras de Anúncio",
      l2: "O usuário não deve compartilhar conteúdo falso. A plataforma pode remover anúncios.",

      p1: "Preço",
      p2: "Os serviços podem ser pagos ou gratuitos.",

      b1: "Comportamento",
      b2: "O usuário deve seguir a lei e não prejudicar outros.",

      k1: "Proteção de Dados",
      k2: "Os dados são protegidos por lei.",

      f1: "Direitos Autorais",
      f2: "Todos os direitos pertencem à empresa.",

      end: "Este contrato entra em vigor após o registro.",
      back: "Voltar para a página inicial"
    }
  }[lang];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow bg-slate-50/30">
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-4xl mx-auto px-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-medium text-slate-600 tracking-tight">
              {t.title}
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-light">
              {t.version}
            </p>
          </div>
        </section>
{/* Sözleşme Metni - 9 Madde */}
<section className="max-w-4xl mx-auto px-6 py-12">
  <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm p-8 md:p-12">
    
    {/* Giriş Metni */}
    <div className="text-slate-500 text-sm leading-relaxed mb-10 pb-8 border-b border-slate-50">
      <p className="mb-4">
        {lang === "pt"
          ? <>Este contrato foi celebrado eletronicamente entre o usuário (“Membro”) e a empresa através da plataforma <strong>www.passareserva.com</strong>.</>
          : <>This Individual Membership Agreement (“Agreement”) has been concluded electronically between the Company and the user (“Member”) via <strong>www.passareserva.com</strong>.</>}
      </p>
      <p>
        {lang === "pt"
          ? "Ao aceitar este contrato, o usuário declara que leu, compreendeu e concorda com todos os termos."
          : "By accepting this Agreement, the Member declares that they have read, understood, and accepted all terms without reservation."}
      </p>
    </div>

    <div className="space-y-12">

      {/* 1 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center text-xs">1</span>
          {lang === "pt" ? "Definições" : "Definitions"}
        </h2>
        <div className="grid grid-cols-1 gap-3 pl-11 text-[14px] text-slate-600">
          <p><strong>{lang === "pt" ? "Plataforma:" : "Site:"}</strong> {lang === "pt" ? "PassaReserva e aplicações móveis." : "PassaReserva website and all mobile applications."}</p>
          <p><strong>{lang === "pt" ? "Usuário:" : "Member:"}</strong> {lang === "pt" ? "Usuário registrado." : "Registered user."}</p>
          <p><strong>{lang === "pt" ? "Visitante:" : "Visitor:"}</strong> {lang === "pt" ? "Usuário não registrado." : "User without registration."}</p>
          <p><strong>{lang === "pt" ? "Serviço:" : "Service:"}</strong> {lang === "pt" ? "Serviços de anúncio e mensagens." : "Listing, search, filtering and messaging services."}</p>
          <p><strong>{lang === "pt" ? "Conteúdo:" : "Content:"}</strong> {lang === "pt" ? "Conteúdo enviado." : "All uploaded listings, images and messages."}</p>
        </div>
      </article>

      {/* 2 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center text-xs">2</span>
          {lang === "pt" ? "Objeto e Escopo" : "Subject and Scope"}
        </h2>
        <p className="pl-11 text-[14px]">
          {lang === "pt"
            ? "PassaReserva é apenas uma plataforma de anúncios. Não é agência nem intermediária."
            : "PassaReserva is only a listing platform. It is not an agency or intermediary."}
        </p>
      </article>

      {/* 3 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center text-xs">3</span>
          {lang === "pt" ? "Condições de Associação" : "Membership Conditions"}
        </h2>
        <p className="pl-11 text-[14px]">
          {lang === "pt"
            ? "O usuário declara que suas informações são corretas. Contas múltiplas são proibidas."
            : "The Member declares that all information provided is accurate. Multiple accounts are prohibited."}
        </p>
      </article>

      {/* 4 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center text-xs">4</span>
          {lang === "pt" ? "Função da Plataforma" : "Role of PassaReserva"}
        </h2>
        <p className="pl-11 text-[14px]">
          {lang === "pt"
            ? "A plataforma apenas exibe anúncios."
            : "The platform only provides listing display services."}
        </p>
      </article>

      {/* 5 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center text-xs">5</span>
          {lang === "pt" ? "Regras de Anúncio" : "Listing Rules"}
        </h2>
        <p className="pl-11 text-[14px]">
          {lang === "pt"
            ? "Conteúdo enganoso é proibido."
            : "Misleading or false content is prohibited."}
        </p>
      </article>

      {/* 6 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center text-xs">6</span>
          {lang === "pt" ? "Preço" : "Pricing"}
        </h2>
        <p className="pl-11 text-[14px]">
          {lang === "pt"
            ? "Os serviços podem ser pagos ou gratuitos."
            : "Services may be free or paid."}
        </p>
      </article>

      {/* 7 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center text-xs">7</span>
          {lang === "pt" ? "Comportamento do Usuário" : "User Behavior Rules"}
        </h2>
        <p className="pl-11 text-[14px]">
          {lang === "pt"
            ? "O usuário deve seguir a lei."
            : "Users must comply with laws."}
        </p>
      </article>

      {/* 8 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center text-xs">8</span>
          {lang === "pt" ? "Proteção de Dados" : "Personal Data Protection"}
        </h2>
        <p className="pl-11 text-[14px]">
          {lang === "pt"
            ? "Os dados são protegidos por lei."
            : "User data is processed under applicable laws."}
        </p>
      </article>

      {/* 9 */}
      <article>
        <h2 className="text-slate-700 font-bold mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center text-xs">9</span>
          {lang === "pt" ? "Direitos Autorais" : "Intellectual Property Rights"}
        </h2>
        <p className="pl-11 text-[14px]">
          {lang === "pt"
            ? "Todos os direitos pertencem à empresa."
            : "All rights belong to the company."}
        </p>
      </article>

    </div>

    {/* Kapanış */}
    <div className="mt-16 pt-10 border-t border-slate-50 text-center">
      <p className="text-[12px] text-slate-400 italic mb-8">
        {lang === "pt"
          ? "Este contrato entra em vigor após o registro."
          : "This agreement enters into force upon membership."}
      </p>
      <Link href="/" className="inline-flex items-center justify-center px-10 py-3.5 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-sky-50 hover:text-[#00AEEF] transition-all">
        {lang === "pt" ? "Voltar" : "Back to Home"}
      </Link>
    </div>

  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}
