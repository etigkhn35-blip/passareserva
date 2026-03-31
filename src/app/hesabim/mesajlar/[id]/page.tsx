"use client";

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
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { 
  Send, MessageSquare, ChevronLeft, 
  ShieldCheck, MoreVertical, CheckCheck, Loader2 
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

type Chat = {
  id: string;
  adTitle?: string;
  users?: string[];
  updatedAt?: any;
  lastMessage?: string;
  lastSenderId?: string;
  displayName?: string;
};

type Msg = {
  id: string;
  senderId: string;
  receiverId?: string;
  text: string;
  createdAt?: any;
  read?: boolean;
};

export default function MesajlarPage() {
  
  const { lang } = useLanguage();

  const t = {
    en: {
      title: "MESSAGES",
      subtitle: "Conversations with listing owners and support",

      chatList: "Chat List",
      empty: "No chat history",

      user: "User",
      admin: "Admin",

      defaultListing: "Listing Conversation",
      details: "Details",

      placeholder: "Type your message...",
      notSelected: "No conversation selected",

      newMessage: "New message"
    },
    pt: {
      title: "MENSAGENS",
      subtitle: "Conversas com proprietários e suporte",

      chatList: "Lista de Conversas",
      empty: "Sem histórico",

      user: "Usuário",
      admin: "Administrador",

      defaultListing: "Conversa do Anúncio",
      details: "Detalhes",

      placeholder: "Digite sua mensagem...",
      notSelected: "Nenhuma conversa selecionada",

      newMessage: "Nova mensagem"
    }
  }[lang];

  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedChatUnsubRef = useRef<null | (() => void)>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();

  const allChats = chats;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? u : null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const qChats = query(
      collection(db, "conversations"),
      where("users", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(qChats, async (snap) => {
      const list = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data() as any;
          const otherUid = data.users?.find((p: string) => p !== user.uid);

          let displayName = t.user;

          if (otherUid === "Presmt66LxdgLJQZareFD0Os7kL2") {
            displayName = t.admin;
          } else if (otherUid) {
            try {
              const userSnap = await getDoc(doc(db, "users", otherUid));
              if (userSnap.exists()) {
                const u = userSnap.data() as any;

                if (u.adSoyad) {
                  const parts = u.adSoyad.trim().split(/\s+/);
                  const ad = parts[0] || "";
                  const soyad = parts.length > 1 ? parts[parts.length - 1] : "";
                  displayName = `${ad}${soyad ? ` ${soyad[0].toUpperCase()}.` : ""}`;
                } else if (u.displayName) {
                  displayName = u.displayName;
                } else if (u.email) {
                  displayName = u.email.split("@")[0];
                }
              }
            } catch (err) {
              console.error("Name fetch error:", err);
            }
          }

          return {
            id: d.id,
            ...data,
            displayName,
          };
        })
      );

      setChats(list as Chat[]);
    });

    return () => unsub();
  }, [user, lang]);

  useEffect(() => {
    if (!id || allChats.length === 0 || selectedChat) return;

    const targetChat = allChats.find((c) => c.id === String(id));
    if (targetChat) {
      setSelectedChat(targetChat);
    }
  }, [id, allChats, selectedChat]);

  const openChat = (chat: Chat) => {
    setSelectedChat(chat);

    const qMsgs = query(
      collection(db, "conversations", chat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(qMsgs, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Msg[];
      setMessages(list);
    });
  };

  useEffect(() => {
    if (!selectedChat) return;
    if (selectedChatUnsubRef.current) selectedChatUnsubRef.current();
    selectedChatUnsubRef.current = openChat(selectedChat);
    return () => {
      if (selectedChatUnsubRef.current) {
        selectedChatUnsubRef.current();
        selectedChatUnsubRef.current = null;
      }
    };
  }, [selectedChat?.id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const text = newMessage.trim();
    setNewMessage("");

    const receiverId = selectedChat.users?.find((p) => p !== user.uid);
    if (!receiverId) return;

    await addDoc(collection(db, "conversations", selectedChat.id, "messages"), {
      senderId: user.uid,
      receiverId,
      text,
      createdAt: serverTimestamp(),
      read: false,
    });

    await setDoc(
      doc(db, "conversations", selectedChat.id),
      {
        lastMessage: text,
        lastSenderId: user.uid,
        updatedAt: serverTimestamp(),
        users: selectedChat.users || [],
        adTitle: selectedChat.adTitle || t.defaultListing,
      },
      { merge: true }
    );

    await addDoc(collection(db, "users", receiverId, "notifications"), {
      title: t.newMessage,
      message: text.slice(0, 80),
      type: "message",
      read: false,
      createdAt: serverTimestamp(),
      chatId: selectedChat.id,
    });
  };

  const labelForChat = (c: Chat) => {
    return c.displayName || t.user;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-10 h-10 text-[#00AEEF] animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans">
      <Header />
      <audio ref={audioRef} src="/sounds/new-message.mp3" preload="auto" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="flex items-center gap-5 mb-10">
          <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </Link>
          <div>
            <h1 className="text-2xl font-[600] uppercase">{t.title}</h1>
            <p className="text-[11px] text-gray-500 uppercase mt-0.5">{t.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] bg-white rounded-[40px] shadow-2xl h-[750px]">
          
          <div className="border-r flex flex-col">
            <div className="p-8 border-b">
              <h2 className="text-[11px] uppercase">{t.chatList}</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!user || chats.length === 0 ? (
                <div className="p-12 text-center opacity-30">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3" />
                  <p className="text-[10px] uppercase">{t.empty}</p>
                </div>
              ) : (
                chats.map((c) => (
                  <div key={c.id} onClick={() => setSelectedChat(c)}>
                    {c.adTitle || t.defaultListing}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-6 border-b">
                  {selectedChat.adTitle || t.details}
                </div>

                <div className="flex-1 overflow-y-auto p-10">
                  {messages.map((m) => (
                    <div key={m.id}>{m.text}</div>
                  ))}
                </div>

                <div className="p-8 border-t">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t.placeholder}
                  />
                  <button onClick={sendMessage}>
                    <Send />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                {t.notSelected}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}