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
import { Bell, Mail, Menu, X, Search } from "lucide-react";

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

  // 🔒 Admin sayfalarında header render edilmez
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [notifCount, setNotifCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationDoc[]>([]);
  const [openNotif, setOpenNotif] = useState<boolean>(false);

  const [mobileMenu, setMobileMenu] = useState(false);

  // 🔊 Bildirim sesi
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const firstLoadRef = useRef(true);
  const prevUnreadRef = useRef(0);
  const unlockedRef = useRef(false);

  // 🔍 Arama
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    window.location.href = `/arama?q=${encodeURIComponent(q)}`;
  };

  // 👤 Auth
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return () => unsubAuth();
  }, []);

  
  useEffect(() => {
  if (!audioRef.current) {
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.preload = "auto";
  }

  const unlock = async () => {
    if (unlockedRef.current) return;

    try {
      await audioRef.current?.play();
      audioRef.current?.pause();
      audioRef.current!.currentTime = 0;

      unlockedRef.current = true;
      console.log("🔓 Ses unlock oldu");
    } catch (e) {
      console.log("🔒 Ses hala kilitli (kullanıcı tıklaması lazım)");
    }
  };

  window.addEventListener("click", unlock, { once: true });
  return () => window.removeEventListener("click", unlock);
}, []);


// 🔔 Bildirim dinle + SES ÇAL
useEffect(() => {
  if (!user) return;

  if (!audioRef.current) {
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.preload = "auto";
  }

  const q = query(
    collection(db, "notifications"),
    where("toUserUid", "==", user.uid),
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

    // ilk açılışta ses çalma
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      prevUnreadRef.current = unread;
      return;
    }

    // yeni bildirim geldiyse ses çal
    if (unread > prevUnreadRef.current) {
      const audio = audioRef.current;

      if (audio && unlockedRef.current) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.log("🔇 Ses çalamadı:", err));
      } else {
        console.log("🔒 Ses unlock edilmediği için çalmadı");
      }
    }

    prevUnreadRef.current = unread;
  });

  return () => unsub();
}, [user]);


const handleNotificationClick = async (n: NotificationDoc) => {
  if (!user) return;

  try {
    if (!n.id) return;

    // ✅ 1) Okundu işaretle (önce users/{uid}/notifications dene)
    try {
      await updateDoc(doc(db, "users", user.uid, "notifications", n.id), {
        read: true,
      });
    } catch (err) {
      // 🔁 Eğer orada yoksa ana koleksiyonda dene
      try {
        await updateDoc(doc(db, "notifications", n.id), {
          read: true,
        });
      } catch (err2) {
        console.warn("Bildirim okundu işaretlenemedi:", err2);
      }
    }

    // ✅ 2) Destek yanıtı → Geri Bildirim sayfası
    if (n.type === "support_reply" || n.type === "destek") {
      window.location.href = "/hesabim/geri-bildirim";
      return;
    }

    // ✅ 3) Mesaj bildirimi → Mesajlarım
    if (n.type === "message") {
      window.location.href = "/hesabim/mesajlar";
      return;
    }

    // ✅ 4) İlan bildirimleri → ilan sayfası
    if (n.type === "ilan" || n.type?.startsWith("ilan_")) {
      window.location.href = n.ilanId
        ? `/ilan/${encodeURIComponent(n.ilanId)}`
        : "/hesabim";
      return;
    }

    // ✅ 5) Bildirimde path varsa oraya git
    if (n.path) {
      window.location.href = n.path;
      return;
    }

    // fallback
    window.location.href = "/hesabim";
  } catch (e) {
    console.error("Bildirim tıklama hatası:", e);
  } finally {
    setOpenNotif(false);
    setMobileMenu(false);
  }
};

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.displayName || user.email?.split("@")[0] || "Kullanıcı";
  }, [user]);

  // ✅ Aynı arama formu
  const searchForm = (
    <form onSubmit={handleSearch} className="flex items-center w-full max-w-2xl">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tatil, otel, villa ara..."
        className="w-full border border-gray-300 rounded-l-lg px-3 py-2 text-[13px] focus:ring-2 focus:ring-[color:#00AEEF] outline-none"
      />
      <button
        type="submit"
        className="bg-[color:#00AEEF] text-white px-3 py-2 rounded-r-lg hover:opacity-90 transition"
        aria-label="Ara"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );

  const menuButton = (
    <button
      onClick={() => setMobileMenu((v) => !v)}
      className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-gray-700"
      aria-label="Menü"
    >
      {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );

  const ilanVerButton = (
    <Link
      href="/ilan-ver"
      className="bg-[color:#FF6B00] text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap hover:opacity-90 transition"
    >
      İlan Ver
    </Link>
  );

  return (
    <>
      <MobileTopbar
        searchForm={searchForm}
        menuButton={menuButton}
        ilanVerButton={ilanVerButton}
      />

      <header className="bg-white border-b border-gray-200 shadow-sm md:sticky md:top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 justify-center md:justify-between">
            <Link href="/" className="text-2xl font-semibold whitespace-nowrap">
              <span style={{ color: "#00AEEF" }}>tatilini</span>
              <span style={{ color: "#FF6B00" }}>devret</span>
            </Link>

            <div className="hidden md:flex flex-1 justify-center px-6">
              {searchForm}
            </div>

            <div className="hidden md:flex items-center gap-4 text-[13.5px]">
              {!user ? (
                <>
                  <Link href="/giris" className="hover:text-[color:#00AEEF]">
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="bg-[color:#00AEEF] text-white px-3 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Hesap Aç
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-gray-700 hidden lg:inline">
                    Hoş geldin, <strong>{displayName}</strong>
                  </span>

                  <Link href="/hesabim" className="hover:text-[color:#00AEEF]">
                    Hesabım
                  </Link>

                  <Link
                    href="/hesabim/mesajlar"
                    className="relative hover:text-[color:#00AEEF]"
                  >
                    <Mail className="inline w-5 h-5 mr-1" />
                    Mesajlarım
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 shadow">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Bildirim */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenNotif((v) => !v)}
                      className="relative text-gray-800 hover:text-[color:#00AEEF]"
                      aria-label="Bildirimler"
                    >
                      <Bell className="w-5 h-5" />
                      {notifCount > 0 && (
                        <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 shadow">
                          {notifCount}
                        </span>
                      )}
                    </button>

                    {openNotif && (
                      <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                        <div className="p-3 border-b font-medium text-gray-700 text-[13px]">
                          Bildirimler
                        </div>

                        {notifications.length === 0 ? (
                          <p className="p-4 text-[12.5px] text-gray-500 text-center">
                            Henüz bildiriminiz yok.
                          </p>
                        ) : (
                          <ul className="max-h-60 overflow-y-auto">
                            {notifications.map((n) => (
                              <li
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`px-4 py-2 text-[12.5px] border-b cursor-pointer transition ${
                                  !n.read
                                    ? "bg-gray-100 hover:bg-gray-50"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <p className="font-medium text-gray-800">
                                  {n.title || "Yeni bildirim"}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {n.message || ""}
                                </p>
                                <span className="text-[11px] text-gray-400 block mt-1">
                                  {n.createdAt?.toDate
                                    ? new Date(
                                        n.createdAt.toDate()
                                      ).toLocaleString("tr-TR")
                                    : ""}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:underline"
                  >
                    Çıkış
                  </button>

                  <Link
                    href="/ilan-ver"
                    className="bg-[color:#FF6B00] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    İlan Ver
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MOBİL MENÜ */}
          {mobileMenu && (
            <div className="md:hidden mt-3 border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="p-3 flex flex-col gap-2 text-sm">
                <Link
                  href="/detayli-arama"
                  className="px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  Detaylı Arama
                </Link>

                {!user ? (
                  <>
                    <Link
                      href="/giris"
                      className="px-3 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/kayit"
                      className="px-3 py-2 rounded-lg bg-[color:#00AEEF] text-white text-center"
                    >
                      Hesap Aç
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 text-gray-700">
                      Hoş geldin, <strong>{displayName}</strong>
                    </div>

                    <Link
                      href="/hesabim"
                      className="px-3 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Hesabım
                    </Link>

                    <Link
                      href="/hesabim/mesajlar"
                      className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Mesajlarım
                      </span>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
                          {unreadCount}
                        </span>
                      )}
                    </Link>

                    <button
                      onClick={() => setOpenNotif((v) => !v)}
                      className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Bildirimler
                      </span>
                      {notifCount > 0 && (
                        <span className="bg-red-500 text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
                          {notifCount}
                        </span>
                      )}
                    </button>

                    {openNotif && (
                      <div className="border border-gray-200 rounded-xl overflow-hidden mt-1">
                        {notifications.length === 0 ? (
                          <div className="p-3 text-gray-500 text-[12.5px] text-center">
                            Henüz bildiriminiz yok.
                          </div>
                        ) : (
                          <ul className="max-h-56 overflow-y-auto">
                            {notifications.map((n) => (
                              <li
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`px-3 py-2 text-[12.5px] border-b cursor-pointer ${
                                  !n.read ? "bg-gray-100" : ""
                                }`}
                              >
                                <div className="font-medium text-gray-900">
                                  {n.title || "Yeni bildirim"}
                                </div>
                                <div className="text-gray-600">
                                  {n.message || ""}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <Link
                      href="/ilan-ver"
                      className="px-3 py-2 rounded-lg bg-[color:#FF6B00] text-white text-center"
                      onClick={() => setMobileMenu(false)}
                    >
                      İlan Ver
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-lg border border-red-200 text-red-600"
                    >
                      Çıkış
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
