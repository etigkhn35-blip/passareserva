"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { updateProfile, updateEmail, updatePassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  User, ChevronLeft, Mail, Phone, Lock, Save, 
  AlertCircle, CheckCircle2, Loader2, ShieldCheck
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const { lang } = useLanguage();

  const t = {
    en: {
      title: "PROFILE SETTINGS",
      subtitle: "Account Security and Contact Information",
      login: "YOU MUST LOGIN",

      processing: "Processing changes...",
      success: "Your profile has been updated successfully.",
      error: "Error: Please log in again and try.",

      name: "Full Name",
      email: "Email Address",
      phone: "Phone",

      passwordTitle: "Update Password",
      passwordPlaceholder: "Enter your new password (optional)",
      passwordNote: "* Password must be at least 6 characters.",

      save: "SAVE CHANGES",

      security: "Account Security",
      securityDesc: "After changing your email or password, the system may require you to log in again for security.",

      status: "Profile Status",
      verified: "Verified Account"
    },

    pt: {
      title: "CONFIGURAÇÕES DE PERFIL",
      subtitle: "Segurança da Conta e Informações de Contato",
      login: "VOCÊ PRECISA FAZER LOGIN",

      processing: "Processando alterações...",
      success: "Seu perfil foi atualizado com sucesso.",
      error: "Erro: faça login novamente e tente.",

      name: "Nome Completo",
      email: "Email",
      phone: "Telefone",

      passwordTitle: "Atualizar Senha",
      passwordPlaceholder: "Digite sua nova senha (opcional)",
      passwordNote: "* A senha deve ter pelo menos 6 caracteres.",

      save: "SALVAR ALTERAÇÕES",

      security: "Segurança da Conta",
      securityDesc: "Após alterar seu e-mail ou senha, você pode precisar fazer login novamente por segurança.",

      status: "Status do Perfil",
      verified: "Conta Verificada"
    }
  }[lang];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");

        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setPhone(data.phone || "");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      setMessage({ type: 'info', text: t.processing });

      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      if (password.length >= 6) {
        await updatePassword(user, password);
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        adSoyad: displayName,
        email,
        phone,
      });

      setMessage({ type: 'success', text: t.success });
      setPassword("");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: t.error });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
      <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
      <Link href="/login" className="bg-[#00AEEF] text-white px-8 py-4 rounded-2xl font-semibold text-xs uppercase tracking-widest shadow-xl shadow-sky-100 hover:scale-105 transition-transform">
        {t.login}
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
          
          <div className="flex items-center gap-5 mb-12">
            <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-sky-50 transition-all group">
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF]" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight uppercase">{t.title}</h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[2px] mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="relative">
            {message && (
              <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-[25px] flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-500 min-w-[320px] ${
                message.type === 'success' ? 'bg-green-500 text-white' : 
                message.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#00AEEF] text-white'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
              
              <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-200/20 overflow-hidden order-2 lg:order-1">
                <div className="p-8 md:p-14 space-y-10">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">
                        <User className="w-3.5 h-3.5 text-[#00AEEF]" /> {t.name}
                      </label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-[14px] outline-none focus:ring-2 focus:ring-sky-100 focus:bg-white transition-all font-semibold text-gray-700 shadow-sm"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">
                        <Mail className="w-3.5 h-3.5 text-[#00AEEF]" /> {t.email}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-[14px] outline-none focus:ring-2 focus:ring-sky-100 focus:bg-white transition-all font-semibold text-gray-700 shadow-sm"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">
                        <Phone className="w-3.5 h-3.5 text-[#00AEEF]" /> {t.phone}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90"
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-[14px] outline-none focus:ring-2 focus:ring-sky-100 focus:bg-white transition-all font-semibold text-gray-700 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="p-8 bg-orange-50/30 rounded-[30px] border border-orange-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform pointer-events-none">
                      <Lock className="w-20 h-20 text-orange-500" />
                    </div>
                    <div className="relative z-10 space-y-5">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-[#FF6B00] uppercase tracking-[2px] ml-1">
                        {t.passwordTitle}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.passwordPlaceholder}
                        className="w-full bg-white border border-orange-100/50 rounded-2xl px-6 py-4 text-[14px] outline-none focus:ring-2 focus:ring-orange-200 transition-all font-semibold shadow-sm"
                      />
                      <p className="text-[9px] text-orange-400 font-medium uppercase tracking-wider ml-1">
                        {t.passwordNote}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-3 bg-[#00AEEF] hover:bg-[#0094cc] text-white font-semibold text-[13px] uppercase tracking-[2px] py-5 rounded-2xl shadow-xl shadow-sky-100 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <> {t.save} <Save className="w-4 h-4" /></>}
                    </button>
                  </div>
                </div>
              </form>

              <aside className="space-y-6 order-1 lg:order-2">
                <div className="bg-[#00AEEF] rounded-[35px] p-8 text-white shadow-xl shadow-sky-100 group relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-32 h-32" />
                  </div>
                  <ShieldCheck className="w-10 h-10 mb-6 opacity-80" />
                  <h4 className="font-semibold text-sm uppercase tracking-widest mb-4">{t.security}</h4>
                  <p className="text-xs opacity-90 leading-relaxed font-medium relative z-10">
                    {t.securityDesc}
                  </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{t.status}</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-gray-700">{t.verified}</span>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}