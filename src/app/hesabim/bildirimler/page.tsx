"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bell, MessageCircle, Tag, LifeBuoy, ChevronLeft, 
  CheckCheck, Clock, ChevronRight, Loader2
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function BildirimlerPage() {

  const { lang } = useLanguage();

  const t = {
    en: {
      title: "NOTIFICATIONS",
      newCount: "NEW NOTIFICATIONS",

      loading: "Loading...",
      emptyTitle: "ALL UP TO DATE!",
      emptyDesc: "You have not received any notifications yet.",

      new: "New",
      secure: "Secure Notification System Active"
    },

    pt: {
      title: "NOTIFICAÇÕES",
      newCount: "NOVAS NOTIFICAÇÕES",

      loading: "Carregando...",
      emptyTitle: "TUDO ATUALIZADO!",
      emptyDesc: "Você ainda não recebeu nenhuma notificação.",

      new: "Novo",
      secure: "Sistema de Notificações Seguro Ativo"
    }
  }[lang];

  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("toUserUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(list);
      setLoading(false);
    });
  }, [user]);

  const handleClick = async (notif: any) => {
    await updateDoc(doc(db, "notifications", notif.id), { read: true });

    if (notif.type === "destek" || notif.type === "message" || notif.type === "offer") {
      router.push("/hesabim/mesajlar");
      return;
    }

    if (notif.type === "ilan" && notif.ilanId) {
      router.push(`/ilan/${notif.ilanId}`);
      return;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageCircle className="w-5 h-5 text-[#00AEEF]" />;
      case "ilan": return <Tag className="w-5 h-5 text-[#FF6B00]" />;
      case "destek": return <LifeBuoy className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading && !user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
      <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
          
          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-sky-50 transition group">
                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF]" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight uppercase">
                  {t.title}
                </h1>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[1.5px] mt-1">
                  {notifications.filter(n => !n.read).length} {t.newCount}
                </p>
              </div>
            </div>

            <div className="hidden md:flex p-4 bg-white rounded-2xl border border-gray-50 shadow-sm relative">
              <Bell className="w-6 h-6 text-[#00AEEF]" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#FF6B00] border-2 border-white rounded-full animate-pulse" />
              )}
            </div>
          </div>

          {/* LIST */}
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden min-h-[400px]">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin mb-4" />
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                  {t.loading}
                </p>
              </div>

            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                <div className="bg-gray-50 w-20 h-20 rounded-[30px] flex items-center justify-center mb-6">
                  <CheckCheck className="w-8 h-8 text-gray-200" />
                </div>

                <h3 className="text-sm font-semibold text-gray-800 mb-1 uppercase tracking-tight">
                  {t.emptyTitle}
                </h3>

                <p className="text-xs text-gray-400 italic">
                  {t.emptyDesc}
                </p>
              </div>

            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`relative flex items-center gap-6 p-8 cursor-pointer group ${
                      n.read ? "opacity-60" : ""
                    }`}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00AEEF]" />
                    )}

                    <div className="w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 bg-white shadow">
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-[13px] font-semibold uppercase">
                        {n.title}
                      </h3>

                      <p className="text-[13px]">
                        {n.message}
                      </p>
                    </div>

                    <div className="text-[10px] text-gray-400">
                      {n.createdAt?.toDate
                        ? new Date(n.createdAt.toDate()).toLocaleTimeString()
                        : t.new}
                    </div>

                    <ChevronRight />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOT */}
          <div className="mt-10 text-center text-xs text-gray-400">
            {t.secure}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}