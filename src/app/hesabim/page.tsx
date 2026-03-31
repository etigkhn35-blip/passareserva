"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebaseConfig";

import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { useLanguage } from "@/context/LanguageContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc, addDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import {
  HeartOff,
  Camera,
  ChevronRight,
  CheckCircle,
  Clock,
  ShieldAlert,
  MessageSquare,
  Bell,
  User,
  Settings,
  HelpCircle,
  AlertTriangle,
  LogOut,
  Plus,
  Eye,
  LayoutDashboard,
  Loader2,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";


const DEFAULT_AVATAR = "/defaults/avatar.png";
const DEFAULT_COVER = "/defaults/default.jpg";

const translations = {
  en: {
    errorTitle: "An error occurred",
    retry: "Try Again",
    loginRequired: "You need to log in.",
    login: "Login",
    newListing: "POST NEW LISTING",
    logout: "Logout",

    listingManagement: "LISTING MANAGEMENT",
    activeListings: "Active Listings",
    inactiveListings: "Inactive Listings",
    expiredListings: "Expired Listings",

    communication: "COMMUNICATION",
    messages: "Messages",
    notifications: "Notifications",
    support: "Support / Feedback",

    accountSettings: "ACCOUNT SETTINGS",
    profile: "Profile",
    settings: "Settings",
    help: "Help Center",

    statsActive: "Active Listings",
    statsMessages: "New Messages",
    statsViews: "Views",

    favorites: "Favorites",
    activity: "Activity",
    noFavorites: "No favorites yet",
    review: "View →",

    noActivity: "No activity found",
    noActivityDesc: "There is no activity yet.",

    approved: "Live",
    pending: "Pending",
    rejected: "Rejected",
    expiredStatus: "Expired",
  },
  pt: {
    errorTitle: "Ocorreu um erro",
    retry: "Tentar novamente",
    loginRequired: "Você precisa fazer login.",
    login: "Entrar",
    newListing: "NOVO ANÚNCIO",
    logout: "Sair",

    listingManagement: "GERENCIAR ANÚNCIOS",
    activeListings: "Ativos",
    inactiveListings: "Inativos",
    expiredListings: "Expirados",

    communication: "COMUNICAÇÃO",
    messages: "Mensagens",
    notifications: "Notificações",
    support: "Suporte",

    accountSettings: "CONFIGURAÇÕES",
    profile: "Perfil",
    settings: "Configurações",
    help: "Ajuda",

    statsActive: "Anúncios Ativos",
    statsMessages: "Novas Mensagens",
    statsViews: "Visualizações",

    favorites: "Favoritos",
    activity: "Atividade",
    noFavorites: "Nenhum favorito",
    review: "Ver →",

    noActivity: "Nenhuma atividade",
    noActivityDesc: "Ainda não há atividade.",

    approved: "Ativo",
    pending: "Aguardando",
    rejected: "Rejeitado",
    expiredStatus: "Expirado",
  },
};

export default function HesabimPage() {
 
  const { lang } = useLanguage();
  
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const currencySymbol = lang === "pt" ? "R$" : "$";

  const t = translations[lang];
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"favoriler" | "aktivite">("favoriler");
  const [favoriler, setFavoriler] = useState<any[]>([]);
  const [aktifIlanSayisi, setAktifIlanSayisi] = useState(0);
  const [toplamGoruntulenme, setToplamGoruntulenme] = useState(0);
  const [yeniMesajSayisi, setYeniMesajSayisi] = useState(0);
  const [yeniBildirimVar, setYeniBildirimVar] = useState(false);
  const [yeniDestekVar, setYeniDestekVar] = useState(false);
  const [aktiviteler, setAktiviteler] = useState<any[]>([]);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  

  // 1. Auth durumu takibi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setDisplayName(currentUser.displayName || "Kullanıcı");
      setEmail(currentUser.email || "");
      setPhoto(currentUser.photoURL || DEFAULT_AVATAR);

      loadUserData(currentUser.uid);
    });

    return () => unsubscribe();
  }, []);

  // 2. Kullanıcı verilerini yükle
  const loadUserData = async (uid: string) => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
  fetchFavoriler(uid),
  fetchStats(uid),
  fetchActivities(uid),
]);
    } catch (err: any) {
      console.error("Veri yükleme hatası:", err);
      setError("Veriler yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Bildirim ve mesajları realtime dinle
useEffect(() => {
  if (!user?.uid) return;

  const q = query(
    collection(db, "users", user.uid, "notifications"),
    where("read", "==", false)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    let bildirimVar = false;
    let destekVar = false;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data?.type === "support_reply" || data?.type === "destek") {
        destekVar = true;
      } else if (data?.type !== "message") {
        bildirimVar = true;
      }
    });

    setYeniBildirimVar(bildirimVar);
    setYeniDestekVar(destekVar);
  });

  return () => unsubscribe();
}, [user?.uid]);

useEffect(() => {
  if (!user?.uid) return;

  const q = query(
    collection(db, "conversations"),
    where("users", "array-contains", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    let unreadCount = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const updatedAtMs = data.updatedAt?.toMillis?.() || 0;
      const lastReadMs = data.lastRead?.[user.uid]?.toMillis?.() || 0;
      const lastSenderId = data.lastSenderId || null;

      if (lastSenderId && lastSenderId !== user.uid && updatedAtMs > lastReadMs) {
        unreadCount += 1;
      }
    });

    setYeniMesajSayisi(unreadCount);
  });

  return () => unsubscribe();
}, [user?.uid]);


  const fetchFavoriler = async (uid: string) => {
    try {
      const snapshot = await getDocs(collection(db, "favoriler", uid, "items"));
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          favId: docSnap.id,
          ilanId: data.ilanId || docSnap.id,
          baslik: data.baslik || "Başlıksız İlan",
          coverUrl: data.coverUrl || DEFAULT_COVER,
          ucret: data.ucret || data.fiyat || 0,
        };
      });
      setFavoriler(items);
    } catch (err) {
      console.error("Favoriler çekilemedi:", err);
    }
  };

  const fetchStats = async (uid: string) => {
    try {
      const q = query(collection(db, "ilanlar"), where("sahipUid", "==", uid), where("status", "==", "approved"));
      const snapshot = await getDocs(q);

      setAktifIlanSayisi(snapshot.size);

      let views = 0;
snapshot.forEach((docSnap) => {
  const data = docSnap.data();
  views += Number(data.viewCount || data.goruntulenme || data.views || 0);
});
setToplamGoruntulenme(views);
    } catch (err) {
      console.error("İstatistikler çekilemedi:", err);
    }
  };

  const fetchActivities = async (uid: string) => {
  try {
    const q = query(
      collection(db, "ilanlar"),
      where("sahipUid", "==", uid)
    );

    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        baslik: data.baslik || "Başlıksız İlan",
        status: data.status || "pending",
        olusturmaTarihi: data.olusturmaTarihi || null,
        goruntulenme: Number(data.viewCount || 0),
      };
    });

    items.sort((a, b) => {
      const aTime = a.olusturmaTarihi?.seconds || 0;
      const bTime = b.olusturmaTarihi?.seconds || 0;
      return bTime - aTime;
    });

    setAktiviteler(items);
  } catch (err) {
    console.error("Aktiviteler çekilemedi:", err);
  }
};

  const removeFavorite = async (favId: string) => {
    if (!user?.uid) return;
    if (!confirm("Bu ilanı favorilerden kaldırmak istiyor musunuz?")) return;

    try {
      await deleteDoc(doc(db, "favoriler", user.uid, "items", favId));
      setFavoriler((prev) => prev.filter((f) => f.favId !== favId));
    } catch (err) {
      console.error("Favori kaldırma hatası:", err);
      alert("İşlem başarısız oldu.");
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: url });
      setPhoto(url);
    } catch (err) {
      console.error("Fotoğraf yüklenemedi:", err);
      alert("Fotoğraf güncellenemedi.");
    }
  };

  const NavLink = ({ href, icon: Icon, label, badge }: any) => (
    <Link
      href={href}
      className="group flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] text-gray-600 hover:bg-sky-50 hover:text-[#00AEEF] transition-all font-medium"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#00AEEF] transition-colors" />
        {label}
      </div>
      <div className="flex items-center gap-2">
        {badge && <span className="h-2 w-2 bg-[#00AEEF] rounded-full animate-pulse" />}
        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-10 h-10 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] text-center px-6">
        <div>
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t.errorTitle}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#00AEEF] text-white rounded-xl hover:bg-[#0099d6]"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-6">{t.loginRequired}</p>
          <Link href="/giris" className="px-8 py-4 bg-[#00AEEF] text-white rounded-2xl hover:bg-[#0099d6]">
          {t.login}  
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

     

      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* SOL SIDEBAR */}
            <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
              {/* Profil Kartı */}
              <div className="bg-white rounded-[35px] p-8 shadow-2xl shadow-gray-200/20 border border-gray-50 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={photo || DEFAULT_AVATAR}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                    alt="Profil"
                  />
                  <label className="absolute bottom-0 right-0 bg-[#00AEEF] p-2.5 rounded-full cursor-pointer shadow-lg border-2 border-white hover:scale-110 transition">
                    <Camera className="w-3.5 h-3.5 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-1 uppercase tracking-tight">{displayName}</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-6">{email}</p>

                <div className="space-y-3">
                  <Link
                    href="/ilan-ver"
                    className="flex items-center justify-center gap-2 w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-semibold text-[11px] uppercase tracking-[2px] shadow-xl shadow-orange-100 hover:translate-y-[-2px] transition-all"
                  >
                    <Plus className="w-4 h-4" /> {t.newListing}
                  </Link>
                  <button
                    onClick={() => signOut(auth)}
                    className="flex items-center justify-center gap-2 w-full text-red-500 font-semibold text-[11px] uppercase tracking-widest hover:opacity-70 transition py-2"
                  >
                    <LogOut className="w-4 h-4" /> {t.logout}
                  </button>
                </div>
              </div>

              {/* Menü */}
              <div className="bg-white rounded-[35px] p-4 shadow-2xl shadow-gray-200/20 border border-gray-50">
                <div className="space-y-6 py-2">
                  <div>
                    <h4 className="text-[9px] font-semibold text-gray-300 px-4 mb-3 uppercase tracking-[2px]">{t.listingManagement}</h4>
                    <NavLink href="/hesabim/yayinda" icon={CheckCircle} label={t.activeListings} />
                    <NavLink href="/hesabim/yayinda-olmayan" icon={Clock} label={t.inactiveListings} />
                    <NavLink href="/hesabim/suresi-dolan" icon={ShieldAlert} label={t.expiredListings} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-semibold text-gray-300 px-4 mb-3 uppercase tracking-[2px]">{t.communication}</h4>
                    <NavLink href="/hesabim/mesajlar" icon={MessageSquare} label={t.messages} badge={yeniMesajSayisi > 0} />
                    <NavLink href="/hesabim/bildirimler" icon={Bell} label={t.notifications} badge={yeniBildirimVar} />
<NavLink
  href="/hesabim/geri-bildirim"
  icon={AlertTriangle}
  label={t.support}
  badge={yeniDestekVar}
/>                  </div>
                  <div>
                    <h4 className="text-[9px] font-semibold text-gray-300 px-4 mb-3 uppercase tracking-[2px]">{t.accountSettings}</h4>
                    <NavLink href="/hesabim/profil" icon={User} label={t.profile} />
                    <NavLink href="/hesabim/ayarlar" icon={Settings} label={t.settings} />
                    <NavLink href="/hesabim/yardim" icon={HelpCircle} label={t.help} />
                  </div>
                </div>
              </div>
            </aside>

            {/* SAĞ İÇERİK */}
            <section className="lg:col-span-3 space-y-8">
              {/* İstatistikler */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[30px] border border-gray-50 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">{t.statsActive}</p>
                    <p className="text-2xl font-bold text-gray-900">{aktifIlanSayisi}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[30px] border border-gray-50 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">{t.statsMessages}</p>
                    <p className="text-2xl font-bold text-gray-900">{yeniMesajSayisi}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[30px] border border-gray-50 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">{t.statsViews}</p>
                    <p className="text-2xl font-bold text-gray-900">{toplamGoruntulenme.toLocaleString("tr-TR")}</p>
                  </div>
                </div>
              </div>

              {/* Tab ve Liste */}
              <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/20 border border-gray-50 overflow-hidden min-h-[600px]">
                <div className="flex bg-gray-50/50 border-b border-gray-50">
                  <button
                    onClick={() => setActiveTab("favoriler")}
                    className={`flex-1 py-6 text-[11px] font-semibold uppercase tracking-[2px] transition-all ${
                      activeTab === "favoriler" ? "text-[#00AEEF] bg-white border-b-3 border-[#00AEEF]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                  ❤️ {t.favorites}
                  </button>
                  <button
                    onClick={() => setActiveTab("aktivite")}
                    className={`flex-1 py-6 text-[11px] font-semibold uppercase tracking-[2px] transition-all ${
                      activeTab === "aktivite" ? "text-[#00AEEF] bg-white border-b-3 border-[#00AEEF]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    ⚡ {t.activity}
                  </button>
                </div>

                <div className="p-8">
                  {activeTab === "favoriler" ? (
                    favoriler.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-24 text-center">
                        <HeartOff className="w-12 h-12 text-gray-200 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">{t.noFavorites}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {favoriler.map((fav) => (
                          <div
                            key={fav.favId}
                            className="group bg-white border border-gray-100 rounded-[30px] overflow-hidden hover:shadow-xl transition-all duration-300"
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img src={fav.coverUrl} className="w-full h-full object-cover" alt={fav.baslik} />
                              <button
                                onClick={() => removeFavorite(fav.favId)}
                                className="absolute top-4 right-4 p-3 bg-white/90 rounded-full text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                              >
                                <HeartOff className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-5">
                              <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-3">{fav.baslik}</h3>
                              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="text-[#FF6B00] font-bold text-lg">{fav.ucret.toLocaleString(locale)} {currencySymbol}</span>
                                <Link href={`/ilan/${fav.ilanId}`} className="text-[#00AEEF] text-sm font-semibold hover:underline">
                                  {t.review}
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                                   ) : aktiviteler.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <LayoutDashboard className="w-16 h-16 text-gray-200 mb-6" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">{t.noActivity}</h3>
                        <p className="text-gray-500">{t.noActivityDesc}</p>
                      </div>
                  ) : (
                    <div className="space-y-4"> 
                      {aktiviteler.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-gray-100 rounded-[24px] p-5 hover:shadow-md transition"
                        >
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-base">{item.baslik}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Durum:{" "}
                                <span className="font-medium">
                                  {item.status === "approved"
                                   ? t.approved
                                    : item.status === "pending"
                                    ? "Onay Bekliyor"
                                    : item.status === "rejected"
                                    ? "Reddedildi"
                                    : item.status === "expired"
                                    ? "Süresi Doldu"
                                    : item.status}
                                </span>
                              </p>
                            </div>

                            <div className="text-sm text-gray-500">
                              Görüntülenme:{" "}
                              <span className="font-semibold text-gray-800">
                                {item.goruntulenme.toLocaleString(locale)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}