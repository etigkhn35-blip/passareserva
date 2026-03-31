"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { lang } = useLanguage();

  const t =
    lang === "en"
      ? {
          title: "About Us",
          p1: "PassaReserva is a platform that allows users to safely and easily transfer unused travel and vacation reservations to others.",
          p2: "Our goal is to help users avoid losses when their travel plans change, while also providing affordable opportunities for those looking for great vacation deals.",
        }
      : {
          title: "Sobre Nós",
          p1: "PassaReserva é uma plataforma que permite aos usuários transferir reservas de viagem e férias não utilizadas de forma segura e fácil.",
          p2: "Nosso objetivo é ajudar os usuários a evitar perdas quando seus planos de viagem mudam, ao mesmo tempo em que oferecemos oportunidades acessíveis para quem busca boas ofertas de férias.",
        };

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 text-gray-800 bg-white">
      <h1 className="text-3xl font-bold text-[#00AEEF] mb-4">
        {t.title}
      </h1>

      <p className="leading-relaxed">{t.p1}</p>

      <p className="mt-4">{t.p2}</p>
    </main>
  );
}