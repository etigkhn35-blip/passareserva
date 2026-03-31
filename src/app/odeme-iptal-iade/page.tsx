"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function RefundPolicyPage() {
  const { lang } = useLanguage();

  const t =
    lang === "en"
      ? {
          title: "CANCELLATION & REFUND POLICY",
          subtitle: "Information about Payment, Cancellation and Withdrawal Rights",

          s1: "1. Nature of the Service",
          s1Text:
            "PassaReserva operates as an Intermediary Service Provider under applicable electronic commerce laws. Our platform allows users (Sellers) to publish transferable rights (hotel reservations, tickets, etc.) for other users (Buyers).",

          s2: "2. Payment Scope",
          s2Text:
            "All payments collected through the platform are solely for listing publication or promotional services. PassaReserva does not collect or mediate reservation fees, ticket prices, or transfer payments between users.",

          s3: "3. Cancellation & Refund Terms",
          s3Warn:
            "Instant Services: According to regulations, services delivered instantly in digital environments are not subject to withdrawal rights.",
          s3Items: [
            "Listing publication is an instant service; therefore, no refund or cancellation is possible after activation.",
            "In case of duplicate or incorrect payments, refunds are processed within 7 business days upon request.",
          ],

          s4: "4. Responsibility",
          s4Items: [
            "Accuracy of listing details is solely the responsibility of the Seller.",
            "PassaReserva is not responsible for payments or transfers conducted outside the platform.",
            "The platform is not a party, mediator, or arbitrator in disputes.",
          ],

          s5: "5. Contact",
          s5Text: "For refund requests or questions, contact our support team.",

          back: "← Back to Home",
        }
      : {
          title: "POLÍTICA DE CANCELAMENTO E REEMBOLSO",
          subtitle: "Informações sobre pagamento, cancelamento e direito de desistência",

          s1: "1. Natureza do Serviço",
          s1Text:
            "O PassaReserva atua como um intermediário conforme a legislação aplicável. A plataforma permite que usuários publiquem reservas transferíveis para outros usuários.",

          s2: "2. Escopo do Pagamento",
          s2Text:
            "Os pagamentos referem-se apenas à publicação de anúncios ou serviços promocionais. O PassaReserva não intermedeia pagamentos entre usuários.",

          s3: "3. Cancelamento e Reembolso",
          s3Warn:
            "Serviços instantâneos não possuem direito de desistência.",
          s3Items: [
            "Após a publicação, não há reembolso.",
            "Pagamentos duplicados podem ser reembolsados em até 7 dias úteis.",
          ],

          s4: "4. Responsabilidade",
          s4Items: [
            "A veracidade das informações é responsabilidade do vendedor.",
            "O PassaReserva não é responsável por transações externas.",
            "A plataforma não atua como mediadora de conflitos.",
          ],

          s5: "5. Contato",
          s5Text: "Para suporte, entre em contato conosco.",

          back: "← Voltar",
        };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow bg-slate-50/30">
        
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-4xl mx-auto px-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-medium text-slate-600 tracking-tight uppercase">
              {t.title}
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-light italic">
              {t.subtitle}
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white border rounded-[32px] shadow-sm p-8 md:p-12 text-slate-600">

            <div className="space-y-12">

              <section>
                <h2 className="font-bold mb-4">{t.s1}</h2>
                <p>{t.s1Text}</p>
              </section>

              <section>
                <h2 className="font-bold mb-4">{t.s2}</h2>
                <p>{t.s2Text}</p>
              </section>

              <section>
                <h2 className="font-bold mb-4">{t.s3}</h2>
                <p className="text-orange-500">{t.s3Warn}</p>
                <ul className="list-disc ml-5 mt-3">
                  {t.s3Items.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-bold mb-4">{t.s4}</h2>
                <ul className="list-disc ml-5">
                  {t.s4Items.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-bold mb-2">{t.s5}</h2>
                <p>{t.s5Text}</p>
                <a
                  href="mailto:info@passareserva.com"
                  className="inline-block mt-4 bg-sky-500 text-white px-6 py-3 rounded-xl"
                >
                  info@passareserva.com
                </a>
              </section>

            </div>

            <div className="text-center mt-12">
              <Link href="/" className="text-sky-500 font-bold hover:underline">
                {t.back}
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}