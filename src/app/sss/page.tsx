"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function FAQPage() {
  const { lang } = useLanguage();

  const content =
    lang === "en"
      ? {
          title: "Frequently Asked Questions",
          subtitle:
            "Find quick answers about PassaReserva.",
          contactTitle: "Still need help?",
          contactDesc:
            "If you couldn't find your answer, our support team is ready to help.",
          contactBtn: "Contact Us",
          faqs: [
            {
              q: "What is PassaReserva?",
              a: "It is a marketplace where users can transfer unused travel reservations to others.",
            },
            {
              q: "What types of vacations can be transferred?",
              a: "Hotel bookings, villas, Airbnb reservations, cruises, tour packages, and event packages.",
            },
            {
              q: "Can I transfer flight tickets?",
              a: "No. Currently, only non-flight reservations are supported.",
            },
            {
              q: "Is posting a listing paid?",
              a: "The first listing is free for 15 days. After that, a monthly fee applies.",
            },
            {
              q: "How are listings approved?",
              a: "Listings are reviewed and approved after verifying uploaded reservation documents.",
            },
            {
              q: "Does the platform handle payments?",
              a: "No. Payments are handled directly between users.",
            },
            {
              q: "What if I see a fake listing?",
              a: "You can report it using the report button on the listing page.",
            },
            {
              q: "What happens when my listing expires?",
              a: "It is removed from listing. You can renew it anytime.",
            },
            {
              q: "Is there a business membership?",
              a: "Yes. Special packages are available for agencies and property owners.",
            },
            {
              q: "Is my data secure?",
              a: "Yes. Your data is protected and never shared with third parties.",
            },
          ],
        }
      : {
          title: "Perguntas Frequentes",
          subtitle:
            "Encontre respostas rápidas sobre o PassaReserva.",
          contactTitle: "Precisa de ajuda?",
          contactDesc:
            "Se não encontrou sua resposta, nossa equipe está pronta para ajudar.",
          contactBtn: "Fale Conosco",
          faqs: [
            {
              q: "O que é PassaReserva?",
              a: "É uma plataforma onde usuários transferem reservas de viagem não utilizadas.",
            },
            {
              q: "Quais tipos de férias podem ser transferidos?",
              a: "Hotéis, vilas, Airbnb, cruzeiros, pacotes turísticos e eventos.",
            },
            {
              q: "Posso transferir passagens aéreas?",
              a: "Não. Apenas reservas sem voo são suportadas.",
            },
            {
              q: "Publicar anúncio é pago?",
              a: "O primeiro anúncio é gratuito por 15 dias.",
            },
            {
              q: "Como os anúncios são aprovados?",
              a: "Após verificação dos documentos enviados.",
            },
            {
              q: "A plataforma processa pagamentos?",
              a: "Não. Pagamentos são entre usuários.",
            },
            {
              q: "E se eu vir anúncio falso?",
              a: "Use o botão de denúncia.",
            },
            {
              q: "O que acontece quando expira?",
              a: "O anúncio sai do ar.",
            },
            {
              q: "Existe plano empresarial?",
              a: "Sim, para empresas e proprietários.",
            },
            {
              q: "Meus dados estão seguros?",
              a: "Sim, protegidos e não compartilhados.",
            },
          ],
        };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow bg-[#F8FAFC]">
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              {content.title}
            </h1>
            <p className="mt-4 text-slate-500 font-light text-lg">
              {content.subtitle}
            </p>
            <div className="h-1 w-16 bg-sky-400/50 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {content.faqs.map((item, i) => (
              <details
                key={i}
                className="group rounded-3xl border bg-white p-6 md:p-8"
              >
                <summary className="flex cursor-pointer justify-between">
                  <span className="text-lg font-bold">
                    {item.q}
                  </span>
                  <span>+</span>
                </summary>
                <div className="mt-6 text-slate-500">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-xl font-bold">
              {content.contactTitle}
            </h3>
            <p className="text-gray-500 mt-2">
              {content.contactDesc}
            </p>
            <Link
              href="/iletisim"
              className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl"
            >
              {content.contactBtn}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}