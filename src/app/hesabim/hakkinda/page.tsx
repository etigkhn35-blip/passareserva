"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function HakkindaPage() {

  const { lang } = useLanguage();

  const t = {
    en: {
      title: "ℹ️ About",

      p1: "passareserva.com is a listing platform that allows users to safely transfer unused vacation reservations. Users whose travel plans have changed can easily transfer hotel, villa, or event reservations to others.",

      p2: "Our goal is to provide a solution for people who cannot cancel their reservations and to create opportunities for those looking for affordable vacations.",

      p3: "passareserva.com is not a travel agency or hotel operator; it is only a platform that connects users.",

      p4: "Share your plans, transfer them, turn them into opportunities! 🌴"
    },

    pt: {
      title: "ℹ️ Sobre",

      p1: "passareserva.com é uma plataforma de anúncios que permite transferir reservas de férias não utilizadas com segurança. Usuários com planos alterados podem transferir facilmente reservas de hotéis, villas ou eventos.",

      p2: "Nosso objetivo é oferecer uma solução para quem não pode cancelar sua reserva e criar oportunidades para quem busca férias mais acessíveis.",

      p3: "passareserva.com não é uma agência de turismo nem um hotel; é apenas uma plataforma que conecta usuários.",

      p4: "Compartilhe seus planos, transfira e transforme em oportunidade! 🌴"
    }
  }[lang];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[900px] mx-auto px-4 py-10">

        <h1 className="text-2xl font-bold mb-4">
          {t.title}
        </h1>

        <div className="bg-white p-6 rounded-xl border shadow-sm leading-relaxed text-gray-700 text-sm">
          
          <p>
            <b>passareserva.com</b>, {t.p1}
          </p>

          <p className="mt-4">
            {t.p2}
          </p>

          <p className="mt-4">
            {t.p3}
          </p>

          <p className="mt-4 font-semibold">
            {t.p4}
          </p>

        </div>
      </div>
    </main>
  );
}