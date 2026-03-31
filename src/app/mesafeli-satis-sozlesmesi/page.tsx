"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function MesafeliSatisSozlesmesiPage() {
  const { lang } = useLanguage();

  const t = {
    en: {
      title: "DISTANCE SALES AGREEMENT",
      subtitle: "(Digital Service Sale – Listing & Brokerage Service)",
      provider: "SERVICE PROVIDER",
      buyer: "BUYER",
      buyerDesc:
        'Users who create an account and/or purchase services via the PassaReserva platform ("BUYER").',
      subjectTitle: "SUBJECT OF THE AGREEMENT",
      subjectDesc:
        "This agreement regulates the rights and obligations regarding the digital services purchased via PassaReserva:",
      services: [
        "Listing publication service",
        "Listing promotion (Boost) service",
        "Secure payment service",
      ],
      natureTitle: "NATURE OF THE SERVICE",
      nature: [
        "PassaReserva is an intermediary service provider.",
        "The platform connects users through listings.",
        "The service sold is not the holiday/event itself but a digital listing and brokerage service.",
      ],
      paymentTitle: "SERVICE FEE AND PAYMENT",
      paymentDesc:
        "The BUYER pays the selected service fee via credit card or available payment methods. The service becomes active after payment.",
      withdrawalTitle: "RIGHT OF WITHDRAWAL",
      withdrawalDesc:
        "According to consumer law, digital services that are instantly delivered cannot be refunded once activated with user consent.",
      refundTitle: "REFUND POLICY",
      refund: [
        "No refunds after listing is activated",
        "Boost services are non-refundable",
        "No refunds except technical issues",
      ],
      liabilityTitle: "LIMITATION OF LIABILITY",
      liability: [
        "Platform is only a marketplace",
        "Listing owner is responsible for content",
        "Service provider is not a party in user agreements",
      ],
      disputeTitle: "DISPUTE",
      disputeDesc: "Istanbul Courts and Enforcement Offices are authorized.",
      validityTitle: "VALIDITY",
      validityDesc:
        "By completing payment, the BUYER accepts all terms of this agreement.",
      back: "← Back to Home",
    },

    pt: {
      title: "CONTRATO DE VENDA À DISTÂNCIA",
      subtitle: "(Serviço Digital – Publicação de Anúncios e Intermediação)",
      provider: "PRESTADOR DE SERVIÇO",
      buyer: "COMPRADOR",
      buyerDesc:
        'Usuários que criam conta e/ou compram serviços na plataforma PassaReserva ("COMPRADOR").',
      subjectTitle: "OBJETO DO CONTRATO",
      subjectDesc:
        "Este contrato regula os direitos e obrigações dos serviços digitais adquiridos na PassaReserva:",
      services: [
        "Publicação de anúncios",
        "Destaque de anúncios (Boost)",
        "Pagamento seguro",
      ],
      natureTitle: "NATUREZA DO SERVIÇO",
      nature: [
        "PassaReserva é um intermediador",
        "A plataforma conecta usuários por anúncios",
        "O serviço não é a viagem/evento, mas sim intermediação digital",
      ],
      paymentTitle: "PAGAMENTO",
      paymentDesc:
        "O COMPRADOR paga via cartão ou métodos disponíveis. O serviço ativa após pagamento.",
      withdrawalTitle: "DIREITO DE ARREPENDIMENTO",
      withdrawalDesc:
        "Serviços digitais ativados imediatamente não podem ser cancelados após consentimento.",
      refundTitle: "POLÍTICA DE REEMBOLSO",
      refund: [
        "Sem reembolso após ativação",
        "Boost não é reembolsável",
        "Sem reembolso exceto erro técnico",
      ],
      liabilityTitle: "RESPONSABILIDADE",
      liability: [
        "A plataforma é apenas marketplace",
        "O anunciante é responsável",
        "A plataforma não é parte da transação",
      ],
      disputeTitle: "DISPUTAS",
      disputeDesc: "Tribunais de Istambul são competentes.",
      validityTitle: "VALIDADE",
      validityDesc:
        "Ao pagar, o COMPRADOR aceita todos os termos.",
      back: "← Voltar à Página Inicial",
    },
  };

  const tr = t[lang] || t.en;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow bg-slate-50/30">

        {/* BAŞLIK */}
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-4xl mx-auto px-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-medium text-slate-600 tracking-tight uppercase">
              {tr.title}
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-light italic">
              {tr.subtitle}
            </p>
          </div>
        </section>

        {/* İÇERİK */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm p-8 md:p-12 text-slate-600 leading-relaxed">

            <div className="space-y-12">

              {/* 1 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wide">
                  1. {tr.provider} / {tr.buyer}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border">
                    <span className="font-bold text-sky-600 text-xs uppercase">
                      {tr.provider}
                    </span>
                    <p className="text-sm mt-3">PassaReserva</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border">
                    <span className="font-bold text-orange-500 text-xs uppercase">
                      {tr.buyer}
                    </span>
                    <p className="text-sm mt-3">{tr.buyerDesc}</p>
                  </div>
                </div>
              </section>

              {/* 2 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase">
                  2. {tr.subjectTitle}
                </h2>
                <p>{tr.subjectDesc}</p>
                <ul className="list-disc pl-5 mt-3">
                  {tr.services.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </section>

              {/* 3 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase">
                  3. {tr.natureTitle}
                </h2>
                {tr.nature.map((n, i) => (
                  <p key={i}>• {n}</p>
                ))}
              </section>

              {/* 4 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase">
                  4. {tr.paymentTitle}
                </h2>
                <p>{tr.paymentDesc}</p>
              </section>

              {/* 5 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase">
                  5. {tr.withdrawalTitle}
                </h2>
                <p>{tr.withdrawalDesc}</p>
              </section>

              {/* 6 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase">
                  6. {tr.refundTitle}
                </h2>
                <ul>
                  {tr.refund.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </section>

              {/* 7 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase">
                  7. {tr.liabilityTitle}
                </h2>
                {tr.liability.map((l, i) => (
                  <p key={i}>• {l}</p>
                ))}
              </section>

              {/* 8 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase">
                  8. {tr.disputeTitle}
                </h2>
                <p>{tr.disputeDesc}</p>
              </section>

              {/* 9 */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase">
                  9. {tr.validityTitle}
                </h2>
                <p className="font-bold">{tr.validityDesc}</p>
              </section>

            </div>

            <div className="text-center pt-12 mt-12 border-t">
              <Link href="/" className="text-sky-500 font-bold hover:underline">
                {tr.back}
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}