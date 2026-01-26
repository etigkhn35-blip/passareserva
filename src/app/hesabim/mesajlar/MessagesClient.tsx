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
} from "firebase/firestore";

export default function MessagesClient() {
  const [meUid, setMeUid] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ADMIN_UID = "Presmt66LxdgLJQZareFD0Os7kL2";

  const formatDateTime = (ts: any) => {
  if (!ts) return "";

  const date =
    typeof ts?.toDate === "function" ? ts.toDate() : new Date(ts);

  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  /* 🔊 Bildirim sesi */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notify.mp3");
  }, []);

  /* 👤 Auth */
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setMeUid(user ? user.uid : null);
      setLoadingAuth(false);
    });
  }, []);

/* 💬 Sohbet listesi */
useEffect(() => {
  if (!meUid) return;

  const ADMIN_UID = "Presmt66LxdgLJQZareFD0Os7kL2";

  const q = query(
    collection(db, "messages"),
    where("participants", "array-contains", meUid)
  );

  const unsub = onSnapshot(q, async (snap) => {
    const list: any[] = [];

    for (const d of snap.docs) {
      const data = d.data();

      let displayName = "Kullanıcı";
      let isAdmin = false;

      // ✅ Admin sohbeti
      if (data.participants?.includes(ADMIN_UID)) {
        displayName = "Yönetici";
        isAdmin = true;
      } else {
        // 👤 Karşı taraf
        const otherUid = data.participants.find(
          (p: string) => p !== meUid
        );

        if (otherUid) {
          const uDoc = await getDoc(doc(db, "users", otherUid));
          if (uDoc.exists()) {
            const u = uDoc.data();
            displayName =
              `${u?.ad || ""} ${u?.soyad || ""}`.trim() ||
              u?.email ||
              "Kullanıcı";
          }
        }
      }

      list.push({
        id: d.id,
        displayName,
        isAdmin,
        unread:
          data.updatedAt?.toMillis?.() >
            (data.lastRead?.[meUid]?.toMillis?.() || 0) &&
          data.lastSenderId !== meUid,
        ...data,
        updatedAt: data.updatedAt || data.createdAt,
      });
    }

    list.sort(
      (a, b) =>
        (b.updatedAt?.toMillis?.() || 0) -
        (a.updatedAt?.toMillis?.() || 0)
    );

    setChats(list);
  });

  return () => unsub();
}, [meUid]);


  /* 📬 Chat aç */
  const openChat = async (chat: any) => {
    setSelectedChat(chat);

    // 👁️ Okundu işaretle
    await updateDoc(doc(db, "messages", chat.id), {
      [`lastRead.${meUid}`]: serverTimestamp(),
    });

    const q = query(
      collection(db, "messages", chat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setMessages(list);
    });
  };

  /* ✉️ Mesaj gönder */
  const sendMessage = async () => {
    if (!selectedChat || !newMessage.trim() || !meUid) return;

    await addDoc(collection(db, "messages", selectedChat.id, "messages"), {
      senderId: meUid,
      text: newMessage.trim(),
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "messages", selectedChat.id), {
      lastMessage: newMessage.trim(),
      lastSenderId: meUid,
      updatedAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  if (loadingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor…</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[320px,1fr] gap-6">

        {/* 📂 Sol */}
        <div className="bg-white rounded-2xl shadow p-4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Mesajlarım</h2>

          <ul className="space-y-2">
            {chats.map((c) => (
              <li
                key={c.id}
                onClick={() => openChat(c)}
                className={`p-3 rounded-xl border cursor-pointer ${
                  selectedChat?.id === c.id ? "bg-blue-50 border-blue-400" : ""
                }`}
              >
                
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{c.ilanBaslik || "Sohbet"}</p>
                  {c.unread && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
                

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">{c.displayName}</span>

{c.isAdmin && (
  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
                      Yönetici
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 💬 Sağ */}
        <div className="bg-white rounded-2xl shadow flex flex-col h-[80vh]">
          {selectedChat ? (
            <>
              <div className="p-4 border-b font-semibold">
                {selectedChat.ilanBaslik || "Sohbet"}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
  <div
    key={m.id}
    className={`flex ${
      m.senderId === meUid ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
        m.senderId === meUid
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-900"
      }`}
    >
      <div>{m.text}</div>

      {/* ✅ Tarih - Saat */}
      <div
        className={`text-[11px] mt-1 text-right ${
          m.senderId === meUid ? "text-white/70" : "text-gray-500"
        }`}
      >
        {formatDateTime(m.createdAt)}
      </div>
    </div>
  </div>
))}
              </div>

              <div className="p-3 border-t flex gap-3">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border rounded-full px-4 py-2"
                  placeholder="Mesaj..."
                />
                <button
                  onClick={sendMessage}
                  className="px-5 py-2 bg-blue-600 text-white rounded-full"
                >
                  Gönder
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Sohbet seçin
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
