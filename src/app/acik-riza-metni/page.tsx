"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AcikRizaMetniPage() {

  const { lang } = useLanguage();

  const t = {
    en: {
      title: "Explicit Consent Text",
      subtitle: "PassaReserva Consent Statement",

      intro: "Within the scope of data protection regulations, there are situations where your explicit consent is required. By becoming a member, you are deemed to have accepted the following conditions.",

      scopeTitle: "Scope of Consent",

      items: [
        "Processing my personal data for service delivery purposes",
        "Recording and storing personal data contained in uploaded documents and images",
        "Analyzing my IP and cookie data",
        "Using my data for advertising, campaigns, notifications, and marketing communications",
        "Sharing with service providers (hosting, cloud, SMS services, etc.)",
        "Sharing with official authorities within legal obligations"
      ],

      consent: "I give my explicit consent.",

      withdrawTitle: "Withdrawal of Consent",

      withdrawDesc: "You can withdraw your consent at any time by contacting kvkk@passareserva.com.",

      withdrawNote: "Withdrawal does not affect past processing and will only apply going forward.",

      back: "Back to Home"
    },

    pt: {
      title: "Termo de Consentimento",
      subtitle: "Declaração de Consentimento PassaReserva",

      intro: "De acordo com a legislação de proteção de dados, há situações em que é necessário obter seu consentimento explícito. Ao se tornar membro, você aceita as condições abaixo.",

      scopeTitle: "Escopo do Consentimento",

      items: [
        "Processamento dos meus dados pessoais para prestação de serviços",
        "Armazenamento de dados pessoais em documentos e imagens enviados",
        "Análise de IP e cookies",
        "Uso para campanhas, marketing e notificações",
        "Compartilhamento com provedores de serviços (hosting, nuvem, SMS, etc.)",
        "Compartilhamento com autoridades legais quando necessário"
      ],

      consent: "Eu dou meu consentimento explícito.",

      withdrawTitle: "Revogação do Consentimento",

      withdrawDesc: "Você pode revogar seu consentimento a qualquer momento entrando em contato com kvkk@passareserva.com.",

      withdrawNote: "A revogação não afeta dados já processados e vale apenas para o futuro.",

      back: "Voltar para a página inicial"
    }
  }[lang];

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t.title}
        </h1>

        <p className="text-gray-700 mb-4 font-semibold">
          {t.subtitle}
        </p>

        <p className="text-gray-700 mb-6">
          {t.intro}
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
          {t.scopeTitle}
        </h2>

        <ul className="list-decimal list-inside text-gray-700 mb-6 space-y-1">
          {t.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <p className="text-gray-700 mb-6">
          {t.consent}
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
          {t.withdrawTitle}
        </h2>

        <p className="text-gray-700 mb-4">
          {t.withdrawDesc}
        </p>

        <p className="text-gray-700 mb-8">
          {t.withdrawNote}
        </p>

        <div className="text-sm text-gray-500 text-center">
          {t.back} →{" "}
          <Link href="/" className="text-primary hover:underline">
            {lang === "pt" ? "Início" : "Home"}
          </Link>
        </div>

      </div>
    </main>
  );
}