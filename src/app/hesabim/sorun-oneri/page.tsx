"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { 
  ChevronLeft, Send, ShieldCheck, Headphones, Loader2, 
  CheckCircle2, Info, MessageSquare
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function DestekTalebiPage() {
  const [user, setUser] = useState<any>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const { lang } = useLanguage();

  const t = {
    en: {
      title: "HELP & SUPPORT",
      subtitle: "Customer Experience Center",

      loginRequired: "You must log in to continue",
      login: "LOGIN",

      successTitle: "Your request has been received!",
      successDesc: "Our support team will contact you shortly. Please check your messages.",

      newRequest: "CREATE NEW REQUEST",

      formTitle: "New Support Request",
      formDesc: "How can we help you?",

      subject: "Subject",
      subjectPlaceholder: "Example: Listing approval or payment issue",

      message: "Your Message",
      messagePlaceholder: "Please describe your issue in detail...",

      send: "SEND REQUEST",

      quick: "Quick Contact",
      quickDesc: "Your requests are reviewed 24/7 by our expert team. Average response time:",
      response: "45 Minutes",

      faq: "Frequently Asked",
      faqList: [
        "When will my listing be approved?",
        "How does refund work?",
        "About account security"
      ],
      viewAll: "VIEW ALL"
    },

    pt: {
      title: "AJUDA E SUPORTE",
      subtitle: "Centro de Experiência do Cliente",

      loginRequired: "Você precisa fazer login para continuar",
      login: "ENTRAR",

      successTitle: "Sua solicitação foi recebida!",
      successDesc: "Nossa equipe entrará em contato em breve. Verifique suas mensagens.",

      newRequest: "CRIAR NOVA SOLICITAÇÃO",

      formTitle: "Nova Solicitação de Suporte",
      formDesc: "Como podemos ajudar?",

      subject: "Assunto",
      subjectPlaceholder: "Exemplo: Aprovação de anúncio ou pagamento",

      message: "Sua Mensagem",
      messagePlaceholder: "Por favor descreva seu problema em detalhes...",

      send: "ENVIAR",

      quick: "Contato Rápido",
      quickDesc: "Suas solicitações são analisadas 24/7 por nossa equipe. Tempo médio:",
      response: "45 Minutos",

      faq: "Perguntas Frequentes",
      faqList: [
        "Quando meu anúncio será aprovado?",
        "Como funciona o reembolso?",
        "Segurança da conta"
      ],
      viewAll: "VER TODOS"
    },
  }[lang];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    
    setSending(true);
    const currentUser = auth.currentUser;
    const email = currentUser?.email || "";
    const adSoyad = currentUser?.displayName || email.split("@")[0] || "User";

    try {
      const talepRef = await addDoc(collection(db, "destek_talepleri"), {
        baslik: subject.trim(),
        mesaj: message.trim(),
        email,
        adSoyad,
        userUid: currentUser?.uid || null,
        durum: "pending",
        olusturmaTarihi: serverTimestamp(),
      });

      await addDoc(collection(db, "notifications"), {
        type: "support",
        title: "New Support Request",
        message: subject.trim(),
        refCollection: "destek_talepleri",
        refId: talepRef.id,
        path: `/admin/destek-talepleri?open=${talepRef.id}`,
        read: false,
        createdAt: serverTimestamp(),
        toUserUid: "Presmt66LxdgLJQZareFD0Os7kL2",
      });

      setSent(true);
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  if (loadingAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="flex items-center gap-5 mb-10">
          <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-sky-50 transition-all group">
            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF]" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 uppercase">{t.title}</h1>
            <p className="text-[10px] text-gray-400 uppercase mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-10">
          
          <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden relative">
            {!user ? (
              <div className="p-20 text-center">
                <Headphones className="w-8 h-8 mx-auto mb-6 text-gray-200"/>
                <p className="text-sm text-gray-400 uppercase">{t.loginRequired}</p>
                <Link href="/login" className="mt-6 inline-block text-[#00AEEF] text-xs uppercase border-b">{t.login}</Link>
              </div>
            ) : sent ? (
              <div className="p-20 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-6"/>
                <h2>{t.successTitle}</h2>
                <p>{t.successDesc}</p>
                <button onClick={()=>setSent(false)}>{t.newRequest}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <input placeholder={t.subjectPlaceholder} value={subject} onChange={(e)=>setSubject(e.target.value)} />
                <textarea placeholder={t.messagePlaceholder} value={message} onChange={(e)=>setMessage(e.target.value)} />
                <button>{sending ? "..." : t.send}</button>
              </form>
            )}
          </div>

          <div>
            <h4>{t.quick}</h4>
            <p>{t.quickDesc}</p>
            <p>{t.response}</p>

            <h4>{t.faq}</h4>
            {t.faqList.map((f,i)=><p key={i}>{f}</p>)}

            <Link href="/sss">{t.viewAll}</Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}