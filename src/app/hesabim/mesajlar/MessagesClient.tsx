"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = false;

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Send, MessageSquare, ChevronLeft, 
  ShieldCheck, MoreVertical, CheckCheck, Trash2, Loader2, Clock, AlertTriangle
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

// 🌍 FORMAT
const formatDateTime = (t?: Timestamp | null, locale?: string) => {
  if (!t) return "-";
  try {
    const d = t.toDate();
    return d.toLocaleDateString(locale || "en-US") + " " + d.toLocaleTimeString(locale || "en-US", { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "-";
  }
};

export default function MessagesClient() {
  const { lang } = useLanguage();

  const t = {
    en: {
      title: "MESSAGES",
      subtitle: "Listing conversations and support",

      chats: "CHATS",
      empty: "No messages yet.",

      conversation: "Conversation",

      type: "Type your message...",
      select: "Select a conversation",

      deleteTitle: "Are you sure you want to delete this chat?",
      deleteDesc: "This conversation will be permanently deleted.",
      cancel: "Cancel",
      confirm: "Yes, Delete"
    },

    pt: {
      title: "MENSAGENS",
      subtitle: "Conversas e suporte",

      chats: "CONVERSAS",
      empty: "Nenhuma mensagem ainda.",

      conversation: "Conversa",

      type: "Digite sua mensagem...",
      select: "Selecione uma conversa",

      deleteTitle: "Tem certeza que deseja excluir esta conversa?",
      deleteDesc: "Esta conversa será excluída permanentemente.",
      cancel: "Cancelar",
      confirm: "Sim, excluir"
    }
  }[lang];

  const { id } = useParams();
  const [meUid, setMeUid] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      setMeUid(user ? user.uid : null);
      setLoadingAuth(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (loadingAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
      <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center border-l-4 border-[#FF6B00]">
            <AlertTriangle className="mx-auto text-[#FF6B00] mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-950 mb-2">{t.deleteTitle}</h3>
            <p className="text-sm text-gray-600 mb-6">{t.deleteDesc}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-100 py-3 rounded-xl">{t.cancel}</button>
              <button className="flex-1 bg-red-600 text-white py-3 rounded-xl">{t.confirm}</button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
          
          <div className="flex items-center gap-5 mb-10">
            <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold uppercase">{t.title}</h1>
              <p className="text-[10px] text-gray-400 uppercase mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            
            <aside className="lg:col-span-4">
              <div className="bg-white rounded-[40px] shadow-2xl p-6">
                <h3 className="text-[11px] uppercase mb-4">{t.chats}</h3>

                {chats.length === 0 ? (
                  <p className="text-xs text-gray-400">{t.empty}</p>
                ) : (
                  chats.map(c => (
                    <button key={c.id} onClick={()=>setSelectedChat(c)} className="block w-full text-left">
                      {c.displayName}
                    </button>
                  ))
                )}
              </div>
            </aside>

            <div className="lg:col-span-8 bg-white rounded-[40px] shadow-2xl flex flex-col h-[600px]">
              {selectedChat ? (
                <>
                  <div className="p-6 border-b">{selectedChat.displayName}</div>

                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map(m=>(
                      <div key={m.id}>{m.text}</div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    <input
                      value={newMessage}
                      onChange={(e)=>setNewMessage(e.target.value)}
                      placeholder={t.type}
                    />
                    <button><Send /></button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  {t.select}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}