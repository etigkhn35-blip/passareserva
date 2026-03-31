"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, ChevronLeft, ChevronDown, 
  HelpCircle, MessageCircle, Info, ShieldCheck, Zap,
  AlertCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function YardimPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { lang } = useLanguage();

  const t = {
    en: {
      title: "HELP CENTER",
      subtitle: "ANSWERS TO ALL YOUR QUESTIONS",
      search: "How can we help you?",

      card1Title: "How to Post a Listing?",
      card1Desc: "Create your listing in just 2 minutes with your reservation document.",

      card2Title: "Secure Transfer",
      card2Desc: "Do not make payments without name change and transfer approval.",

      card3Title: "Listing Approval",
      card3Desc: "All listings are manually verified by our team.",

      faqTitle: "Frequently Asked Questions",

      supportTitle: "DO YOU HAVE ANOTHER QUESTION?",
      supportDesc: "Our customer experience team is ready to assist you.",
      supportBtn: "OPEN SUPPORT REQUEST",

      warning:
        "Important Reminder: passareserva is a listing platform. Before making any payment, it is critical for your safety to verify reservation details directly with the facility.",
    },

    pt: {
      title: "CENTRO DE AJUDA",
      subtitle: "RESPOSTAS PARA TODAS AS SUAS PERGUNTAS",
      search: "Como podemos ajudar?",

      card1Title: "Como publicar um anúncio?",
      card1Desc: "Crie seu anúncio em apenas 2 minutos com seu documento de reserva.",

      card2Title: "Transferência segura",
      card2Desc: "Não faça pagamentos sem confirmação de transferência.",

      card3Title: "Aprovação de anúncios",
      card3Desc: "Todos os anúncios são verificados manualmente pela nossa equipe.",

      faqTitle: "Perguntas Frequentes",

      supportTitle: "TEM OUTRA PERGUNTA?",
      supportDesc: "Nossa equipe está pronta para ajudar.",
      supportBtn: "ABRIR SOLICITAÇÃO",

      warning:
        "Lembrete importante: passareserva é uma plataforma de anúncios. Antes de pagar, verifique os detalhes diretamente com o estabelecimento.",
    },
  }[lang];

  const toggleFAQ = (i: number) =>
    setFaqOpen((prev) => (prev === i ? null : i));

 const faqs = {
  en: [
    {
      q: "What is passareserva?",
      a: "passareserva is a platform where users can transfer unused holiday reservations.",
    },
    {
      q: "Which holidays can be transferred?",
      a: "Hotels, villas, Airbnb, cruises and event packages.",
    },
    {
      q: "Can I transfer flight tickets?",
      a: "No, only accommodation-based reservations are accepted.",
    },
    {
      q: "Is posting a listing paid?",
      a: "Your first listing is free for 15 days.",
    },
    {
      q: "How is my listing approved?",
      a: "All listings are manually reviewed within 2 hours.",
    },
    {
      q: "Do I receive payment via passareserva?",
      a: "No, payments are handled between buyer and seller.",
    },
    {
      q: "What if I see a fake listing?",
      a: "Use the report button on the listing page.",
    },
    {
      q: "What happens when my listing expires?",
      a: "Your listing becomes passive.",
    },
    {
      q: "Is there a corporate membership?",
      a: "Yes, special packages are available.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, your data is protected with SSL security.",
    },
  ],

  pt: [
    {
      q: "O que é a passareserva?",
      a: "A passareserva é uma plataforma onde usuários podem transferir reservas de férias não utilizadas.",
    },
    {
      q: "Quais férias podem ser transferidas?",
      a: "Hotéis, villas, Airbnb, cruzeiros e pacotes de eventos.",
    },
    {
      q: "Posso transferir passagens aéreas?",
      a: "Não, apenas reservas de hospedagem são aceitas.",
    },
    {
      q: "Publicar um anúncio é pago?",
      a: "Seu primeiro anúncio é gratuito por 15 dias.",
    },
    {
      q: "Como meu anúncio é aprovado?",
      a: "Todos os anúncios são revisados manualmente em até 2 horas.",
    },
    {
      q: "Recebo pagamento pela passareserva?",
      a: "Não, o pagamento é feito entre comprador e vendedor.",
    },
    {
      q: "E se eu vir um anúncio falso?",
      a: "Use o botão de denúncia na página do anúncio.",
    },
    {
      q: "O que acontece quando expira?",
      a: "O anúncio se torna inativo.",
    },
    {
      q: "Existe plano corporativo?",
      a: "Sim, existem pacotes especiais.",
    },
    {
      q: "Meus dados estão seguros?",
      a: "Sim, seus dados são protegidos com SSL.",
    },
  ],
}[lang];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div className="flex items-center gap-5">
              <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-sky-50 transition-all group">
                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF]" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">{t.title}</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[2px] mt-1">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="relative group w-full md:w-80">
              <input 
                type="text" 
                placeholder={t.search} 
                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-sm" 
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#00AEEF] transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[ 
              { icon: Info, color: 'text-[#00AEEF]', bg: 'bg-sky-50', title: t.card1Title, desc: t.card1Desc },
              { icon: Zap, color: 'text-[#FF6B00]', bg: 'bg-orange-50', title: t.card2Title, desc: t.card2Desc },
              { icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50', title: t.card3Title, desc: t.card3Desc }
            ].map((card, i) => (
              <div key={i} className="bg-white border border-gray-50 p-10 rounded-[40px] shadow-xl shadow-gray-200/20 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h3 className="font-bold text-[14px] text-gray-900 uppercase tracking-wide mb-3">{card.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>

          <section className="bg-white border border-gray-50 rounded-[45px] shadow-2xl shadow-gray-200/30 overflow-hidden mb-16">
            <div className="p-10 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-gray-900" />
              </div>
              <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[2px]">{t.faqTitle}</h2>
            </div>
            
            <div className="p-6 md:p-10 space-y-3">
             {faqs.map((faq, i) => (
  <div 
    key={i} 
    className={`transition-all duration-300 rounded-[30px] border ${
      faqOpen === i
        ? 'bg-sky-50/30 border-sky-100'
        : 'bg-white border-transparent hover:bg-gray-50/50'
    }`}
  >
    <button
      onClick={() => toggleFAQ(i)}
      className="w-full text-left px-8 py-6 flex justify-between items-center group"
    >
      <span
        className={`text-[14px] font-bold transition-colors ${
          faqOpen === i ? 'text-[#00AEEF]' : 'text-gray-800'
        }`}
      >
        {faq.q}
      </span>

      <div
        className={`transition-transform duration-500 ${
          faqOpen === i
            ? 'rotate-180 text-[#00AEEF]'
            : 'text-gray-400'
        }`}
      >
        <ChevronDown className="w-5 h-5" />
      </div>
    </button>

    {faqOpen === i && (
      <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="h-px w-full bg-sky-100 mb-6" />
        <p className="text-[13px] text-gray-600 leading-relaxed font-medium whitespace-pre-line">
          {faq.a}
        </p>
      </div>
    )}
  </div>
))}
            </div>
          </section>

          <div className="bg-gray-900 rounded-[45px] p-12">
            <h3 className="text-white">{t.supportTitle}</h3>
            <p className="text-gray-400">{t.supportDesc}</p>
            <Link
  href="/hesabim/geri-bildirim"
  className="flex items-center gap-4 bg-[#FF6B00] hover:bg-[#e66000] text-white px-10 py-5 rounded-2xl font-bold text-[13px] uppercase tracking-[2px] transition-all shadow-xl shadow-orange-900/20 active:scale-95 whitespace-nowrap"
>
  <MessageCircle className="w-5 h-5" />
  {t.supportBtn}
</Link>
          </div>

          <div className="mt-12 flex items-start gap-4 px-8 py-6 bg-amber-50 rounded-[30px] border border-amber-100">
  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
  <p className="text-[11px] text-amber-800 font-bold leading-relaxed uppercase tracking-wider">
    {t.warning}
  </p>
</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}