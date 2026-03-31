"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebaseConfig";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import { 
  Camera, Search, User, LogOut, ChevronLeft, 
  Mail, Phone, ShieldCheck, Loader2, Save 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HesapBilgileriPage() {

  const { lang } = useLanguage();

  const t = {
    en: {
      search: "Search...",
      account: "My Account",
      logout: "Logout",

      title: "ACCOUNT SETTINGS",
      subtitle: "Manage your profile and contact information",

      login: "You must login",

      name: "Full Name",
      phone: "Mobile Phone",
      email: "Email Address",

      user: "User",
      status: "Membership Status: Active",

      security: "Account Security",
      securityDesc: "Your profile information is only shared when you communicate with other users.",

      save: "SAVE CHANGES",
      saving: "PROCESSING...",

      uploadError: "Photo upload failed",
      saveSuccess: "Information updated successfully",
      saveError: "Update failed"
    },

    pt: {
      search: "Pesquisar...",
      account: "Minha Conta",
      logout: "Sair",

      title: "CONFIGURAÇÕES DA CONTA",
      subtitle: "Gerencie seu perfil e informações",

      login: "Você precisa entrar",

      name: "Nome completo",
      phone: "Telefone",
      email: "E-mail",

      user: "Usuário",
      status: "Status da conta: Ativa",

      security: "Segurança da Conta",
      securityDesc: "Suas informações só são compartilhadas quando você se comunica com outros usuários.",

      save: "SALVAR ALTERAÇÕES",
      saving: "PROCESSANDO...",

      uploadError: "Erro ao enviar foto",
      saveSuccess: "Dados atualizados com sucesso",
      saveError: "Erro ao atualizar"
    }
  }[lang];

  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setDisplayName(u.displayName || "");
        setEmail(u.email || "");
        const docRef = doc(db, "users", u.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setPhone(data.phone || "");
          setPhoto(data.photoURL || u.photoURL || null);
        }
      }
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhoto(url);
      await updateProfile(user, { photoURL: url });
      await updateDoc(doc(db, "users", user.uid), { photoURL: url });
    } catch {
      alert(t.uploadError);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        {
          displayName,
          phone,
          photoURL: photo,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await updateProfile(user, { displayName });
      alert(t.saveSuccess);
    } catch {
      alert(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loadingAuth) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter shrink-0">
            passa<span className="text-[#00AEEF]">reserva</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-10 relative">
            <input 
              placeholder={t.search}
              className="w-full bg-gray-50 border border-gray-100 rounded-full px-5 py-2 text-[12px]"
            />
            <Search className="absolute right-4 top-2.5 w-3.5 h-3.5 text-gray-300" />
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <Link href="/hesabim" className="flex items-center gap-2 text-[11px] font-bold text-[#00AEEF] uppercase">
              <User className="w-4 h-4" /> {t.account}
            </Link>
            <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-red-500 font-bold text-[11px] uppercase">
              <LogOut className="w-4 h-4" /> {t.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="flex items-center gap-4 mb-10">
          <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow-sm border">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase">{t.title}</h1>
            <p className="text-[10px] text-gray-400 uppercase">{t.subtitle}</p>
          </div>
        </div>

        {!user ? (
          <div className="bg-white p-16 text-center">
            <p>{t.login}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">

            {/* LEFT */}
            <div>
              <img src={photo || "/defaults/avatar.png"} />
              <h3>{displayName || t.user}</h3>
              <p>{t.status}</p>
            </div>

            {/* RIGHT */}
            <div>

              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={t.name} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phone} />
              <input value={email} readOnly placeholder={t.email} />

              <button onClick={handleSave}>
                {saving ? t.saving : t.save}
              </button>

            </div>

          </div>
        )}
      </div>
    </main>
  );
}