"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { Search } from "lucide-react";

import { auth } from "../../../lib/firebaseConfig"; 
import MobileTopbar from "../../../components/MobileTopBar"; 
import { useLanguage } from "@/context/LanguageContext";

const CookiePopup = () => null; 

export default function CerezlerPage() {

  const { lang } = useLanguage();

  const t = {
    en: {
      search: "Search listing...",
      login: "Login",
      register: "Sign Up",
      welcome: "Welcome",
      postAd: "Post Listing",
      logout: "Logout",

      title: "COOKIE POLICY",
      subtitle: "PassaReserva Cookie Policy",

      intro: "This Cookie Policy explains the use of cookies and user preferences.",

      s1: "1. What is a Cookie?",
      s1a: "Cookies are small text files stored on your device.",
      s1b: "They are used to improve site functionality and experience.",

      s2: "2. Types of Cookies",
      required: "Required Cookies",
      requiredDesc: "Login, security and navigation.",
      perf: "Performance Cookies",
      perfDesc: "Track visited pages and errors.",
      func: "Functional Cookies",
      funcDesc: "Remember preferences.",
      ads: "Marketing Cookies",
      adsDesc: "Content personalization and ads.",

      s3: "3. Purpose of Use",
      s3a: "Ensure proper operation.",
      s3b: "Security and fraud detection.",
      s3c: "Analytics and traffic measurement.",
      s3d: "Advertising campaigns.",

      s4: "4. Managing Cookies",
      s4desc: "You can disable cookies from browser settings.",
      warning: "Important: Disabling cookies may break some features.",

      back: "← Back to Homepage",

      footer1: "QUICK LINKS",
      footer2: "LEGAL",
      footer3: "CONTACT",
      footer4: "FOLLOW US",

      rights: "All rights reserved.",
      disclaimer: "All content responsibility belongs to users."
    },

    pt: {
      search: "Pesquisar anúncio...",
      login: "Entrar",
      register: "Criar Conta",
      welcome: "Bem-vindo",
      postAd: "Publicar Anúncio",
      logout: "Sair",

      title: "POLÍTICA DE COOKIES",
      subtitle: "Política de Cookies PassaReserva",

      intro: "Esta política explica o uso de cookies e preferências.",

      s1: "1. O que é um Cookie?",
      s1a: "Cookies são pequenos arquivos de texto.",
      s1b: "Melhoram a experiência do site.",

      s2: "2. Tipos de Cookies",
      required: "Cookies Necessários",
      requiredDesc: "Login, segurança e navegação.",
      perf: "Cookies de Desempenho",
      perfDesc: "Monitoram páginas visitadas.",
      func: "Cookies Funcionais",
      funcDesc: "Lembram preferências.",
      ads: "Cookies de Marketing",
      adsDesc: "Personalização e anúncios.",

      s3: "3. Finalidade",
      s3a: "Funcionamento do site.",
      s3b: "Segurança.",
      s3c: "Análise de tráfego.",
      s3d: "Campanhas publicitárias.",

      s4: "4. Gerenciamento",
      s4desc: "Você pode desativar cookies no navegador.",
      warning: "Importante: pode afetar funcionalidades.",

      back: "← Voltar para página inicial",

      footer1: "LINKS RÁPIDOS",
      footer2: "INFORMAÇÕES LEGAIS",
      footer3: "CONTATO",
      footer4: "SIGA-NOS",

      rights: "Todos os direitos reservados.",
      disclaimer: "Responsabilidade do conteúdo pertence ao usuário."
    }
  }[lang];

  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.displayName || user.email?.split("@")[0] || "User";
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[14px]">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          <Link href="/" className="text-2xl font-semibold">
            passa<span style={{ color: "#00AEEF" }}>reserva</span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center px-6">
            <form className="flex items-center w-full max-w-2xl">
              <input
                placeholder={t.search}
                className="w-full border px-3 py-2"
              />
              <button>
                <Search />
              </button>
            </form>
          </div>

          {!user ? (
            <>
              <Link href="/giris">{t.login}</Link>
              <Link href="/kayit">{t.register}</Link>
            </>
          ) : (
            <>
              {t.welcome}, {displayName}
              <Link href="/ilan-ver">{t.postAd}</Link>
              <button onClick={handleLogout}>{t.logout}</button>
            </>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-grow p-10">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <p>{t.intro}</p>
      </main>

      <footer className="p-10 text-center text-gray-400">
        {t.rights}
      </footer>

      <MobileTopbar searchForm={undefined} menuButton={undefined} ilanVerButton={undefined} />
    </div>
  );
}