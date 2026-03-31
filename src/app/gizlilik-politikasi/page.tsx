"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { lang } = useLanguage();

  const t =
    lang === "en"
      ? {
          title: "Privacy Policy",
          p1: "At passareserva.com, we value your privacy.",
          p2: "Basic information such as name, email, and phone number is collected during registration.",
          p3: "This information is used only for account verification, listing publication, and communication.",
          p4: "User data is not shared or sold to third parties.",
          p5: "It may be shared with authorities only when legally required.",
          p6: "Cookies are used to improve user experience and collect statistics.",
          p7: "Users can delete their account and request data deletion at any time.",
          back: "Back to Home",
        }
      : {
          title: "Política de Privacidade",
          p1: "Na passareserva.com, valorizamos a sua privacidade.",
          p2: "Informações básicas como nome, e-mail e telefone são coletadas durante o registro.",
          p3: "Essas informações são usadas apenas para verificação de conta, publicação de anúncios e comunicação.",
          p4: "Os dados dos usuários não são compartilhados ou vendidos a terceiros.",
          p5: "Podem ser compartilhados com autoridades apenas quando exigido por lei.",
          p6: "Cookies são usados para melhorar a experiência do usuário e coletar estatísticas.",
          p7: "Os usuários podem excluir sua conta e solicitar a exclusão dos dados a qualquer momento.",
          back: "Voltar para a página inicial",
        };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t.title}
        </h1>

        <p className="text-gray-700 mb-4">{t.p1}</p>
        <p className="text-gray-700 mb-4">{t.p2}</p>
        <p className="text-gray-700 mb-4">{t.p3}</p>
        <p className="text-gray-700 mb-4">{t.p4}</p>
        <p className="text-gray-700 mb-4">{t.p5}</p>
        <p className="text-gray-700 mb-4">{t.p6}</p>
        <p className="text-gray-700 mb-4">{t.p7}</p>

        <div className="text-sm text-gray-500 mt-8 text-center">
          <Link href="/" className="text-primary hover:underline">
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  );
}