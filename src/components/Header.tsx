"use client";

import MobileTopbar from "./MobileTopBar";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "../lib/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  doc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import Link from "next/link";
import { Bell, Mail, Menu, X, Search, LogOut, User as UserIcon, PlusCircle, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ---------------- LANGUAGE ---------------- */
const translations = {
  en: {
    search: "Search listings...",
    login: "Login",
    register: "Sign Up",
    post: "Post Listing",
    welcome: "Welcome",
    advanced: "Advanced Search",
    profile: "My Profile",
    messages: "Messages",
    logout: "Logout",
    noNotif: "No notifications yet",
    notif: "Notifications",
    new: "New",
  },
  pt: {
    search: "Pesquisar anúncios...",
    login: "Entrar",
    register: "Criar conta",
    post: "Publicar anúncio",
    welcome: "Bem-vindo",
    advanced: "Busca avançada",
    profile: "Perfil",
    messages: "Mensagens",
    logout: "Sair",
    noNotif: "Nenhuma notificação",
    notif: "Notificações",
    new: "Novo",
  },
};

interface NotificationDoc extends DocumentData {
  id: string;
  read?: boolean;
  title?: string;
  message?: string;
  createdAt?: any;
  type?: string;
  toUserUid?: string;
  ilanId?: string;
  path?: string;
}

export default function Header() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifCount, setNotifCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationDoc[]>([]);
  const [openNotif, setOpenNotif] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const firstLoadRef = useRef(true);
  const prevUnreadRef = useRef(0);
  const unlockedRef = useRef(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    window.location.href = `/arama?q=${encodeURIComponent(q)}`;
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/notification.mp3");
      audioRef.current.preload = "auto";
    }

    const markInteraction = () => {
      unlockedRef.current = true;
    };

    window.addEventListener("click", markInteraction, { once: true });
    window.addEventListener("touchstart", markInteraction, { once: true });

    return () => {
      window.removeEventListener("click", markInteraction);
      window.removeEventListener("touchstart", markInteraction);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubConversations = onSnapshot(
      query(collection(db, "conversations"), where("users", "array-contains", user.uid)),
      (snap) => {
        let unread = 0;

        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const updatedAtMs = data.updatedAt?.toMillis?.() || 0;
          const lastReadMs = data.lastRead?.[user.uid]?.toMillis?.() || 0;
          const lastSenderId = data.lastSenderId || null;

          if (lastSenderId && lastSenderId !== user.uid && updatedAtMs > lastReadMs) {
            unread += 1;
          }
        });

        setUnreadCount(unread);
      }
    );

    return () => unsubConversations();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "notifications"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: NotificationDoc[] = snap.docs.map((d) => ({
        ...(d.data() as NotificationDoc),
        id: d.id,
      }));

      setNotifications(list);

      const unread = list.filter((n) => !n.read).length;
      setNotifCount(unread);

      if (firstLoadRef.current) {
        firstLoadRef.current = false;
        prevUnreadRef.current = unread;
        return;
      }

      if (
        unread > prevUnreadRef.current &&
        audioRef.current &&
        unlockedRef.current &&
        document.visibilityState === "visible"
      ) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      prevUnreadRef.current = unread;
    });

    return () => unsub();
  }, [user]);

  const handleOpenNotifications = async () => {
    setOpenNotif((prev) => !prev);

    if (!user) return;

    const unreadNotifications = notifications.filter((n) => !n.read);

    if (unreadNotifications.length === 0) return;

    await Promise.all(
      unreadNotifications.map((n) =>
        updateDoc(doc(db, "users", user.uid, "notifications", n.id), {
          read: true,
        })
      )
    );
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.displayName || user.email?.split("@")[0] || "User";
  }, [user]);

  const searchForm = (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t.search}
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-12 py-2.5 text-sm"
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#00AEEF] text-white rounded-xl">
        <Search className="w-4 h-4" />
      </button>
    </form>
  );

  const ilanVerButton = (
    <Link href="/ilan-ver" className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2.5 rounded-2xl text-[13px] font-bold">
      <PlusCircle className="w-4 h-4" />
      {t.post}
    </Link>
  );

  return (
    <>
      <MobileTopbar searchForm={searchForm} menuButton={<button onClick={() => setMobileMenu(true)}><Menu /></button>} ilanVerButton={ilanVerButton} />

      <header className="hidden md:block bg-white border-b border-gray-100 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">

          {/* LOGO */}
          <Link href="/" className="text-3xl font-black tracking-tighter">
            <span className="text-[#00AEEF]">passa</span>
            <span className="text-[#FF6B00]">reserva</span>
          </Link>

          {/* SEARCH */}
          <div className="flex-1 max-w-xl">{searchForm}</div>

        {/* RIGHT */}
<div className="flex items-center gap-4">

  {/* LANGUAGE */}
  <div className="flex bg-gray-100 rounded-full p-1 text-xs mr-2">
    <button
      onClick={() => setLang("en")}
      className={`px-3 py-1 rounded-full transition ${
        lang === "en"
          ? "bg-white text-[#00AEEF] shadow"
          : "text-gray-500"
      }`}
    >
      EN
    </button>
    <button
      onClick={() => setLang("pt")}
      className={`px-3 py-1 rounded-full transition ${
        lang === "pt"
          ? "bg-white text-[#FF6B00] shadow"
          : "text-gray-500"
      }`}
    >
      PT
    </button>
  </div>

  {!user ? (
    <div className="flex items-center gap-3">
      <Link href="/giris" className="text-[13px] font-bold text-gray-600 hover:text-[#00AEEF]">
        {t.login}
      </Link>
      <Link
        href="/kayit"
        className="text-[13px] font-bold bg-[#00AEEF] text-white px-5 py-2.5 rounded-2xl hover:opacity-90 transition"
      >
        {t.register}
      </Link>
    </div>
  ) : (
    <div className="flex items-center gap-4">

      {/* MAIL */}
      <Link href="/hesabim/mesajlar" className="relative p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100">
        <Mail className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </Link>

      {/* BELL */}
      <button onClick={handleOpenNotifications} className="p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100">
        <Bell className="w-5 h-5 text-gray-600" />
      </button>

      {/* PROFILE LETTER */}
      <Link href="/hesabim">
        <div className="w-10 h-10 bg-[#00AEEF] rounded-xl flex items-center justify-center text-white font-bold text-sm">
          {displayName[0].toUpperCase()}
        </div>
      </Link>

      {/* POST */}
      {ilanVerButton}

      {/* LOGOUT */}
      <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  )}
</div>
        </div>
      </header>
    </>
  );
}