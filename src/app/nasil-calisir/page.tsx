"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "../../context/LanguageContext";

export default function NasilCalisirPage() {
  const { lang } = useLanguage();

  const t =
    lang === "en"
      ? {
          title: "Transferring Your Vacation Is Easy!",
          subtitle: "Post your listing in 3 steps and recover your money.",

          step1Title: "Create Your Listing",
          step1Desc:
            "Plans changed and you can’t go on vacation? Create your listing instantly. Select hotel, villa, cruise, tour or event package. Enter reservation details, upload your voucher and publish your listing easily.",

          step2Title: "Boost Your Listing",
          step2Desc:
            "Make your listing more visible: with “Featured” it appears at the top, with “Showcase” it appears on the homepage. Listings with 40–50% discount automatically receive the “Best Deal” badge.",

          step3Title: "Agree with the Buyer",
          step3Desc:
            "Once your listing is live, interested users contact you. Discuss transfer details and complete the agreement. Earn back your money!",

          legal:
            "PassaReserva is a listing platform only. All transfer, payment and reservation processes are solely the responsibility of buyers and sellers.",
        }
      : {
          title: "Transferir sua reserva é muito fácil!",
          subtitle: "Publique seu anúncio em 3 etapas e recupere seu dinheiro.",

          step1Title: "Crie seu anúncio",
          step1Desc:
            "Mudou de planos e não pode viajar? Crie seu anúncio rapidamente. Escolha hotel, villa, cruzeiro, pacote ou evento. Insira os dados da reserva, envie o comprovante e publique.",

          step2Title: "Destaque seu anúncio",
          step2Desc:
            "Torne seu anúncio mais visível: com “Destaque” ele aparece no topo, com “Vitrine” na página inicial. Descontos acima de 40–50% recebem o selo “Melhor Oferta”.",

          step3Title: "Negocie com o comprador",
          step3Desc:
            "Após publicado, usuários interessados entram em contato. Combine os detalhes e finalize a transferência.",

          legal:
            "O PassaReserva é apenas uma plataforma de anúncios. Todos os processos são responsabilidade dos usuários.",
        };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <Header />

      <main className="flex-grow bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-20">
            
            <div className="mb-16 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-6">
                {t.title}
              </h1>
              <p className="text-xl font-medium text-[#FF6B00]/90">
                {t.subtitle}
              </p>
              <div className="h-1.5 w-20 bg-[#00AEEF]/40 mt-8 rounded-full mx-auto md:mx-0"></div>
            </div>

            <div className="grid gap-16">
              
              {/* STEP 1 */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0 w-16 h-16 bg-sky-50 text-[#00AEEF] rounded-3xl flex items-center justify-center font-black text-2xl border border-sky-100 shadow-sm shadow-sky-100">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-4 tracking-tight">
                    {t.step1Title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-lg font-light">
                    {t.step1Desc}
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0 w-16 h-16 bg-orange-50 text-[#FF6B00] rounded-3xl flex items-center justify-center font-black text-2xl border border-orange-100 shadow-sm shadow-orange-100">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-4 tracking-tight">
                    {t.step2Title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-lg font-light">
                    {t.step2Desc}
                  </p>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0 w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center font-black text-2xl border border-emerald-100 shadow-sm shadow-emerald-100">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-4 tracking-tight">
                    {t.step3Title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-lg font-light">
                    {t.step3Desc}
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-20 p-10 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
              <p className="text-sm text-slate-400 italic text-center leading-relaxed">
                <span className="text-orange-600/70 font-bold not-italic mr-1 uppercase tracking-tighter text-xs">
                  {lang === "en" ? "Legal Note:" : "Nota Legal:"}
                </span>
                {t.legal}
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}