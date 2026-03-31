"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { 
  ChevronLeft, MessageSquare, Send, Clock, 
  AlertCircle, History, LifeBuoy, Loader2, Search, Trash2
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

type DestekTalebi = {
  id: string;
  baslik: string;
  mesaj: string;
  email: string;
  adSoyad?: string;
  userUid: string;
  durum: "beklemede" | "yanıtlandı";
  okundu: boolean;
  olusturmaTarihi?: Timestamp | null;
  yanit?: string;
  yanitTarihi?: Timestamp | null;
};

const formatDate = (t?: Timestamp | null) => {
  if (!t) return "-";
  try {
    const d = t.toDate();
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "-";
  }
};

export default function GeriBildirimPage() {

  const { lang } = useLanguage();

  const t = {
    en: {
      login: "YOU MUST LOGIN",
      title: "SUPPORT & FEEDBACK",
      subtitle: "Your requests and history",
      history: "REQUEST HISTORY",
      empty: "No requests yet",
      send: "SEND",
      placeholderTitle: "Subject Title",
      placeholderMsg: "Write your message...",
      success: "Your request has been sent successfully.",
      select: "Select a request",
      noChat: "No messages yet",
      reply: "Write your reply...",
      delete: "Delete",
      confirm: "Are you sure you want to delete?",
      deleteError: "Delete failed",
      sendError: "Message could not be sent",
      newReq: "New Issue or Suggestion",
      newReqDesc: "Send message directly to our team",
      pending: "Pending",
      answered: "Answered",
      newReply: "New Reply",
      user: "User", // en
    },
    pt: {
      login: "VOCÊ PRECISA FAZER LOGIN",
      title: "SUPORTE & FEEDBACK",
      subtitle: "Seus pedidos e histórico",
      history: "HISTÓRICO",
      empty: "Nenhum pedido ainda",
      send: "ENVIAR",
      placeholderTitle: "Título",
      placeholderMsg: "Escreva sua mensagem...",
      success: "Solicitação enviada com sucesso.",
      select: "Selecione um pedido",
      noChat: "Nenhuma mensagem ainda",
      reply: "Digite sua resposta...",
      delete: "Excluir",
      confirm: "Tem certeza?",
      deleteError: "Erro ao excluir",
      sendError: "Mensagem não enviada",
      newReq: "Nova solicitação",
      newReqDesc: "Envie mensagem para nossa equipe",
      pending: "Pendente",
      answered: "Respondido",
      newReply: "Nova resposta",
      user: "Usuário", // pt
    }
  }[lang];

  const [user, setUser] = useState<any>(null);
  const [baslik, setBaslik] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [talepler, setTalepler] = useState<DestekTalebi[]>([]);
  const [selected, setSelected] = useState<DestekTalebi | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleOpenTalep = async (t: DestekTalebi) => {
  setSelected(t);

  if (t.durum === "yanıtlandı" && !t.okundu) {
    await updateDoc(doc(db, "destek_talepleri", t.id), {
      okundu: true,
    });
  }
};

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "destek_talepleri"),
      where("userUid", "==", user.uid),
      orderBy("olusturmaTarihi", "desc")
    );
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DestekTalebi));
      setTalepler(data);
      setLoadingData(false);
    });
  }, [user?.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !baslik.trim() || !mesaj.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "destek_talepleri"), {
        userUid: user.uid,
        adSoyad: user.displayName || t.user,
        email: user.email,
        baslik: baslik.trim(),
        mesaj: mesaj.trim(),
        durum: "beklemede",
        okundu: false,
        olusturmaTarihi: serverTimestamp(),
      });

      setSuccess(t.success);
      setBaslik("");
      setMesaj("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTalep = async (id: string) => {
    if (!confirm(t.confirm)) return;
    try {
      await deleteDoc(doc(db, "destek_talepleri", id));
      setSelected(null);
    } catch {
      alert(t.deleteError);
    }
  };

  if (!user && !loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Link href="/login">{t.login}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow">
  <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
    
    <div className="flex items-center gap-5 mb-10">
      <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-sky-50 transition-all group">
        <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF]" />
      </Link>
      <div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight uppercase">
          {t.title}
        </h1>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[1.5px] mt-1">
          {t.subtitle}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

      {/* SOL */}
      <aside className="lg:col-span-4">
        <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-200/20 overflow-hidden flex flex-col h-[700px]">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4" /> {t.history}
            </h3>
            <span className="bg-sky-50 text-[#00AEEF] text-[10px] font-bold px-3 py-1 rounded-full">
              {talepler.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {loadingData ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 text-sky-200 animate-spin" />
              </div>
            ) : talepler.length === 0 ? (
              <div className="py-20 text-center">
                <LifeBuoy className="w-10 h-10 text-gray-100 mx-auto mb-4" />
                <p className="text-xs text-gray-400 font-medium italic">
                  {t.empty}
                </p>
              </div>
            ) : (
              talepler.map((tItem) => (
                <button
                  key={tItem.id}
                  onClick={() => handleOpenTalep(tItem)}
                  className={`w-full text-left p-5 rounded-[28px] border-2 transition-all duration-300 group relative ${
                    selected?.id === tItem.id
                      ? "border-[#00AEEF] bg-sky-50/30 shadow-lg shadow-sky-100/50"
                      : "border-transparent bg-gray-50/50 hover:bg-white hover:border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                      tItem.durum === "yanıtlandı"
                        ? (tItem.okundu ? "bg-green-100 text-green-600" : "bg-[#FF6B00] text-white animate-pulse")
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {tItem.durum === "yanıtlandı"
                        ? (tItem.okundu ? t.answered : t.newReply)
                        : t.pending}
                    </span>
                    <Clock className="w-3.5 h-3.5 text-gray-300" />
                  </div>

                  <p className={`text-[13px] font-semibold truncate mb-1 ${selected?.id === tItem.id ? "text-[#00AEEF]" : "text-gray-800"}`}>
                    {tItem.baslik}
                  </p>

                  <p className="text-[10px] text-gray-400 font-medium uppercase">
                    {formatDate(tItem.olusturmaTarihi)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* SAĞ */}
      <div className="lg:col-span-8 space-y-8">

        {/* FORM */}
        <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-200/20 p-10 relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
            <MessageSquare className="w-40 h-40" />
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00AEEF] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-sky-100">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                  {t.newReq}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  {t.newReqDesc}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <input
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                placeholder={t.placeholderTitle}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4"
              />

              <textarea
                value={mesaj}
                onChange={(e) => setMesaj(e.target.value)}
                placeholder={t.placeholderMsg}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-5"
              />
            </div>

            <button>{t.send}</button>
          </form>
        </div>

        {/* DETAY */}
        {!selected && (
          <p>{t.select}</p>
        )}

      </div>
    </div>
  </div>
</main>
      <Footer />
    </div>
  );
}