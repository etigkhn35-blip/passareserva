"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db, storage } from "@/lib/firebaseConfig";
import { onAuthStateChanged, updateProfile, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import {
  Bell,
  Moon,
  Volume2,
  Mail,
  Save,
  ChevronLeft,
  Settings as SettingsIcon,
  ShieldCheck,
  Eye,
  Loader2,
  CheckCircle2,
  Monitor,
  Camera,
  LogOut,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const DEFAULT_AVATAR = "/defaults/avatar.png";

type UserSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  soundAlerts: boolean;
};

const DEFAULT_SETTINGS: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  darkMode: false,
  soundAlerts: true,
};

export default function AyarlarPage() {
  const { lang } = useLanguage();

  const t = {
    en: {
      mustLogin: "YOU MUST LOGIN",

      title: "SYSTEM SETTINGS",
      subtitle: "Customize your experience",

      notif: "NOTIFICATION PREFERENCES",
      email: "Email Notifications",
      emailDesc: "Listing updates and offers",

      web: "Web Notifications",
      webDesc: "Browser alerts and permissions",
      unsupported: "Not supported",
      granted: "Granted",
      denied: "Denied",
      default: "Not requested",

      sound: "Sound Alerts",
      soundDesc: "System and message sounds",

      theme: "APPEARANCE & THEME",
      dark: "Dark Mode",
      darkDesc: "Switch browser appearance to dark mode",

      logout: "LOG OUT",

      syncTitle: "SYNCHRONIZED EXPERIENCE",
      syncDesc:
        "Your settings are stored on our cloud servers and restored with your account.",

      success: "SAVED SUCCESSFULLY",
      save: "SAVE CHANGES",

      errorLoad: "Settings could not be loaded",
      errorPermission: "Notification permission failed",
      errorSave: "Error while saving settings",
      errorPhoto: "Photo upload failed",
      errorLogout: "Logout failed",

      user: "User",
    },

    pt: {
      mustLogin: "VOCÊ PRECISA FAZER LOGIN",

      title: "CONFIGURAÇÕES DO SISTEMA",
      subtitle: "Personalize sua experiência",

      notif: "PREFERÊNCIAS DE NOTIFICAÇÃO",
      email: "Notificações por Email",
      emailDesc: "Atualizações de anúncios e ofertas",

      web: "Notificações Web",
      webDesc: "Alertas do navegador e permissões",
      unsupported: "Não suportado",
      granted: "Permitido",
      denied: "Negado",
      default: "Não solicitado",

      sound: "Alertas Sonoros",
      soundDesc: "Sons do sistema e mensagens",

      theme: "APARÊNCIA E TEMA",
      dark: "Modo Escuro",
      darkDesc: "Ativa o modo escuro",

      logout: "SAIR",

      syncTitle: "EXPERIÊNCIA SINCRONIZADA",
      syncDesc:
        "Suas configurações são armazenadas em nossos servidores e restauradas com sua conta.",

      success: "SALVO COM SUCESSO",
      save: "SALVAR ALTERAÇÕES",

      errorLoad: "Erro ao carregar configurações",
      errorPermission: "Erro ao solicitar permissão",
      errorSave: "Erro ao salvar configurações",
      errorPhoto: "Erro ao enviar foto",
      errorLogout: "Erro ao sair",

      user: "Usuário",
    },
  }[lang];

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [photo, setPhoto] = useState<string>(DEFAULT_AVATAR);
  const [pushPermission, setPushPermission] = useState<
    NotificationPermission | "unsupported"
  >("unsupported");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushPermission(Notification.permission);
    } else {
      setPushPermission("unsupported");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(u);
      setPhoto(u.photoURL || DEFAULT_AVATAR);
      await loadSettings(u.uid);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyDarkMode(settings.darkMode);
  }, [settings.darkMode]);

  const applyDarkMode = (enabled: boolean) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    if (enabled) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  };

  const loadSettings = async (uid: string) => {
    setLoading(true);

    try {
      const refDoc = doc(db, "userSettings", uid);
      const snap = await getDoc(refDoc);

      if (snap.exists()) {
        const data = snap.data() as Partial<UserSettings>;
        setSettings({
          emailNotifications:
            data.emailNotifications ??
            DEFAULT_SETTINGS.emailNotifications,
          pushNotifications:
            data.pushNotifications ??
            DEFAULT_SETTINGS.pushNotifications,
          darkMode: data.darkMode ?? DEFAULT_SETTINGS.darkMode,
          soundAlerts: data.soundAlerts ?? DEFAULT_SETTINGS.soundAlerts,
        });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error(t.errorLoad, err);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const requestBrowserNotificationPermission = async (): Promise<
    NotificationPermission | "unsupported"
  > => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    try {
      const result = await Notification.requestPermission();
      setPushPermission(result);
      return result;
    } catch (err) {
      console.error(t.errorPermission, err);
      return Notification.permission;
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);

      let finalPushValue = settings.pushNotifications;

      if (settings.pushNotifications) {
        const permission =
          await requestBrowserNotificationPermission();

        if (permission !== "granted") {
          finalPushValue = false;
          setSettings((prev) => ({
            ...prev,
            pushNotifications: false,
          }));
        }
      }

      const payload: UserSettings = {
        ...settings,
        pushNotifications: finalPushValue,
      };

      await setDoc(doc(db, "userSettings", user.uid), payload, {
        merge: true,
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(t.errorSave, err);
      alert(t.errorSave);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const storageRef = ref(
        storage,
        `profile_photos/${user.uid}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: url });
      setPhoto(url);
    } catch (err) {
      console.error(t.errorPhoto, err);
      alert(t.errorPhoto);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (err) {
      console.error(t.errorLogout, err);
      alert(t.errorLogout);
    }
  };

  const displayName = useMemo(() => {
    if (!user) return t.user;
    return (
      user.displayName ||
      user.email?.split("@")[0] ||
      t.user
    );
  }, [user, t]);

  const emailText = useMemo(() => {
    return user?.email || "";
  }, [user]);

  const Toggle = ({
    checked,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${
        checked
          ? "bg-[#00AEEF] shadow-lg shadow-sky-100"
          : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Link
          href="/giris"
          className="bg-[#00AEEF] text-white px-8 py-4 rounded-2xl font-semibold text-xs uppercase tracking-widest shadow-xl shadow-sky-100 hover:scale-105 transition-transform"
        >
          {t.mustLogin}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

     <main className="flex-grow">
  <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-5">
        <Link
          href="/hesabim"
          className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-sky-50 transition-all group"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF]" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight uppercase">
            {t.title}
          </h1>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[2px] mt-1">
            {t.subtitle}
          </p>
        </div>
      </div>
      <SettingsIcon className="w-10 h-10 text-gray-100 hidden md:block" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-10">
      <div className="space-y-8">

        {/* NOTIFICATION */}
        <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-200/20 overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#00AEEF]" />
            </div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
              {t.notif}
            </h2>
          </div>

          <div className="p-4 md:p-8 space-y-2">

            {/* EMAIL */}
            <div className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[30px] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-[15px]">{t.email}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {t.emailDesc}
                  </p>
                </div>
              </div>
              <Toggle
                checked={settings.emailNotifications}
                onChange={(val) => setSettings((prev) => ({ ...prev, emailNotifications: val }))}
              />
            </div>

            {/* WEB */}
            <div className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[30px] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Eye className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-[15px]">{t.web}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {t.webDesc}
                  </p>
                  <p className="text-[10px] text-gray-300 mt-1">
                    {lang === "en" ? "Permission:" : "Permissão:"}{" "}
                    {pushPermission === "unsupported"
                      ? t.unsupported
                      : pushPermission === "granted"
                      ? t.granted
                      : pushPermission === "denied"
                      ? t.denied
                      : t.default}
                  </p>
                </div>
              </div>
              <Toggle
                checked={settings.pushNotifications}
                onChange={(val) => setSettings((prev) => ({ ...prev, pushNotifications: val }))}
                disabled={pushPermission === "unsupported"}
              />
            </div>

            {/* SOUND */}
            <div className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[30px] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Volume2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-[15px]">{t.sound}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {t.soundDesc}
                  </p>
                </div>
              </div>
              <Toggle
                checked={settings.soundAlerts}
                onChange={(val) => setSettings((prev) => ({ ...prev, soundAlerts: val }))}
              />
            </div>
          </div>
        </div>

        {/* THEME */}
        <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-200/20 overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
              {t.theme}
            </h2>
          </div>

          <div className="p-4 md:p-8">
            <div className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[30px] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-[15px]">{t.dark}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {t.darkDesc}
                  </p>
                </div>
              </div>
              <Toggle
                checked={settings.darkMode}
                onChange={(val) => setSettings((prev) => ({ ...prev, darkMode: val }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <aside className="space-y-8">
        <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-gray-200/20 border border-gray-50 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img
              src={photo || DEFAULT_AVATAR}
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
              alt="Profile"
            />
            <label className="absolute bottom-0 right-0 bg-[#00AEEF] p-2.5 rounded-full cursor-pointer shadow-lg border-2 border-white hover:scale-110 transition">
              <Camera className="w-3.5 h-3.5 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>

          <h3 className="font-semibold text-gray-900 text-base mb-1">{displayName}</h3>
          <p className="text-[10px] text-gray-400 font-semibold tracking-widest mb-6">{emailText}</p>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full text-red-500 font-semibold text-[11px] uppercase tracking-widest hover:opacity-70 transition py-2"
          >
            <LogOut className="w-4 h-4" /> {t.logout}
          </button>
        </div>

        <div className="bg-[#00AEEF] rounded-[40px] p-10 text-white shadow-xl shadow-sky-100 group relative overflow-hidden">
          <ShieldCheck className="w-12 h-12 mb-8 opacity-80" />
          <h4 className="font-bold text-sm uppercase tracking-[2px] mb-6 relative z-10">
            {t.syncTitle}
          </h4>
          <p className="text-xs opacity-90 leading-relaxed font-medium relative z-10">
            {t.syncDesc}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {showSuccess && (
            <div className="flex items-center gap-3 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {t.success}
              </span>
            </div>
          )}

          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center justify-center gap-4 w-full bg-[#FF6B00] text-white py-6 rounded-[30px] font-bold text-[13px] uppercase tracking-[3px]"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <>
              <Save className="w-5 h-5" />
              {t.save}
            </>}
          </button>
        </div>
      </aside>
    </div>
  </div>
</main>

      <Footer />
    </div>
  );
}