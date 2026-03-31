"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CookiePopup() {
  const { lang } = useLanguage();

  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = (choice: string | typeof preferences) => {
    const valueToStore =
      typeof choice === "string" ? choice : JSON.stringify(choice);

    localStorage.setItem("cookie-consent", valueToStore);
    setVisible(false);
  };

  // 🌍 TRANSLATIONS
  const translations = {
    en: {
      text: `We use cookies to ensure our website works properly, perform analytics, and personalize your experience. With your consent, we may also use cookies for marketing purposes.`,
      link: "Cookie Policy",
      reject: "Reject All",
      manage: "Manage Preferences",
      accept: "Accept All",

      manageTitle: "Your Cookie Preferences",
      essential: "Essential",
      essentialDesc: "Required for the site to function.",
      active: "ACTIVE",

      analytics: "Analytics",
      analyticsDesc: "Used to measure visitors.",

      marketing: "Marketing",
      marketingDesc: "Shows personalized listings.",

      cancel: "Cancel",
      save: "Save Preferences",
    },

    pt: {
      text: `Utilizamos cookies para garantir o funcionamento do site, realizar análises e personalizar sua experiência. Com o seu consentimento, também podemos usar cookies para marketing.`,
      link: "Política de Cookies",
      reject: "Rejeitar tudo",
      manage: "Gerenciar preferências",
      accept: "Aceitar tudo",

      manageTitle: "Preferências de Cookies",
      essential: "Essenciais",
      essentialDesc: "Necessários para o funcionamento do site.",
      active: "ATIVO",

      analytics: "Analítica",
      analyticsDesc: "Usado para medir visitantes.",

      marketing: "Marketing",
      marketingDesc: "Mostra anúncios personalizados.",

      cancel: "Cancelar",
      save: "Salvar preferências",
    },
  };

  const t = translations[lang as keyof typeof translations];

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-black/90 text-white border-t border-gray-700 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-5 py-6">
        {!showManage ? (
          /* ANA POPUP */
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-[13px] leading-relaxed md:w-2/3 opacity-90">
              {t.text}{" "}
              <Link href="/cerez-politikasi" className="underline text-blue-300">
                {t.link}
              </Link>
            </p>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => handleSave("reject_all")}
                className="px-4 py-2 border border-gray-500 rounded text-xs font-medium hover:bg-gray-800 transition"
              >
                {t.reject}
              </button>

              <button
                onClick={() => setShowManage(true)}
                className="px-4 py-2 border border-gray-500 rounded text-xs font-medium hover:bg-gray-800 transition"
              >
                {t.manage}
              </button>

              <button
                onClick={() => handleSave("accept_all")}
                className="px-4 py-2 bg-white text-black rounded text-xs font-bold hover:bg-gray-200 transition shadow-lg"
              >
                {t.accept}
              </button>
            </div>
          </div>
        ) : (
          /* YÖNETİM PANELİ */
          <div className="animate-in fade-in duration-300">
            <h3 className="text-sm font-bold mb-4 border-b border-gray-700 pb-2">
              {t.manageTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* ESSENTIAL */}
              <div className="bg-white/5 p-3 rounded border border-gray-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold">{t.essential}</span>
                  <span className="text-[10px] text-blue-400">
                    {t.active}
                  </span>
                </div>
                <p className="text-[10px] opacity-60">
                  {t.essentialDesc}
                </p>
              </div>

              {/* ANALYTICS */}
              <div
                onClick={() =>
                  setPreferences((p) => ({
                    ...p,
                    analytics: !p.analytics,
                  }))
                }
                className={`p-3 rounded border cursor-pointer transition ${
                  preferences.analytics
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-800 bg-white/5"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold">{t.analytics}</span>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    readOnly
                    className="accent-blue-500"
                  />
                </div>
                <p className="text-[10px] opacity-60">
                  {t.analyticsDesc}
                </p>
              </div>

              {/* MARKETING */}
              <div
                onClick={() =>
                  setPreferences((p) => ({
                    ...p,
                    marketing: !p.marketing,
                  }))
                }
                className={`p-3 rounded border cursor-pointer transition ${
                  preferences.marketing
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-800 bg-white/5"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold">{t.marketing}</span>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    readOnly
                    className="accent-blue-500"
                  />
                </div>
                <p className="text-[10px] opacity-60">
                  {t.marketingDesc}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowManage(false)}
                className="text-xs opacity-60 hover:opacity-100 transition"
              >
                {t.cancel}
              </button>

              <button
                onClick={() => handleSave(preferences)}
                className="px-6 py-2 bg-white text-black rounded text-xs font-bold hover:bg-gray-200"
              >
                {t.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}