"use client";

import React from "react";
import Link from "next/link";
import { Bell, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MobileTopBar({
  searchForm,
  menuButton,
  ilanVerButton,
  unreadCount = 0,
  notifCount = 0,
}: {
  searchForm: React.ReactNode;
  menuButton: React.ReactNode;
  ilanVerButton: React.ReactNode;
  unreadCount?: number;
  notifCount?: number;
}) {
  const { lang } = useLanguage();

  // 🌍 TRANSLATIONS
  const translations = {
    en: {
      messages: "Messages",
      notifications: "Notifications",
    },
    pt: {
      messages: "Mensagens",
      notifications: "Notificações",
    },
  };

  const t = translations[lang as keyof typeof translations];

  return (
    <div className="md:hidden w-full bg-white border-b border-gray-200 px-3 py-2 sticky top-0 z-[110]">
      
      <div className="flex items-center justify-between gap-2 mb-2">
        
        {/* SOL */}
        <div className="flex items-center gap-2 min-w-0">
          {menuButton}

          <Link
            href="/"
            className="shrink-0 text-[18px] font-black tracking-tighter leading-none"
          >
            <span className="text-[#00AEEF]">passa</span>
            <span className="text-[#FF6B00]">reserva</span>
          </Link>
        </div>

        {/* SAĞ */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* MESAJ */}
          <Link
            href="/hesabim/mesajlar"
            title={t.messages}
            className="relative w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm"
          >
            <Mail className="w-4 h-4" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* BİLDİRİM */}
          <Link
            href="/hesabim/bildirimler"
            title={t.notifications}
            className="relative w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm"
          >
            <Bell className="w-4 h-4" />

            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {notifCount}
              </span>
            )}
          </Link>

          {/* İLAN VER */}
          <div className="shrink-0">{ilanVerButton}</div>
        </div>
      </div>

      {/* SEARCH */}
      <div>{searchForm}</div>
    </div>
  );
}