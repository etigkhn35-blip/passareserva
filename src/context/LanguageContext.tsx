"use client";

import { createContext, useContext, useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */
type Lang = "en" | "pt";

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

/* ---------------- CONTEXT ---------------- */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  // 🔹 İlk yüklemede localStorage'tan al
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "pt") {
      setLang(saved);
    }
  }, []);

  // 🔹 Her değişimde kaydet
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};