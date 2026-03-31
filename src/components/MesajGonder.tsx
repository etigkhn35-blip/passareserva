"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MesajGonder({
  receiverId,
}: {
  receiverId: string;
}) {
  const { lang } = useLanguage();
  const router = useRouter();

  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 🌍 TRANSLATIONS
  const translations = {
    en: {
      placeholder: "Write your message...",
      send: "Send",
      sending: "Sending...",
      loginRequired: "You must login to send a message.",
      error: "Error sending message!",
      success: "Message sent!",
    },
    pt: {
      placeholder: "Escreva sua mensagem...",
      send: "Enviar",
      sending: "Enviando...",
      loginRequired: "Você precisa fazer login.",
      error: "Erro ao enviar mensagem!",
      success: "Mensagem enviada!",
    },
  };

  const t = translations[lang as keyof typeof translations];

  const handleSend = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert(t.loginRequired);
      router.push("/giris");
      return;
    }

    if (!text.trim()) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "messages"), {
        senderId: user.uid,
        receiverId,
        text,
        createdAt: serverTimestamp(),
        read: false,
      });

      setText("");
      alert(t.success);
    } catch (err) {
      console.error(err);
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder}
        className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        <Send size={16} />
        {loading ? t.sending : t.send}
      </button>
    </div>
  );
}