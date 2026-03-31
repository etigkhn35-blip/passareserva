"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ---------------- LANGUAGE ---------------- */
const translations = {
  en: {
    title: "Login",
    email: "Email",
    password: "Password",
    remember: "Remember me",
    forgot: "Forgot password?",
    loginBtn: "Login with Email",
    loading: "Logging in...",
    or: "OR",
    google: "Continue with Google",
    noAccount: "Don't have an account?",
    register: "Sign up",
    resetTitle: "Enter your email",
    resetBtn: "Send Reset Email",
    resetSuccess: "Password reset email sent.",
    resetError: "Email not found.",
    verify: "Please verify your email.",
    invalid: "Invalid email or password.",
  },
  pt: {
    title: "Entrar",
    email: "Email",
    password: "Senha",
    remember: "Lembrar-me",
    forgot: "Esqueceu a senha?",
    loginBtn: "Entrar com Email",
    loading: "Entrando...",
    or: "OU",
    google: "Continuar com Google",
    noAccount: "Não tem conta?",
    register: "Criar conta",
    resetTitle: "Digite seu email",
    resetBtn: "Enviar email",
    resetSuccess: "Email de redefinição enviado.",
    resetError: "Email não encontrado.",
    verify: "Verifique seu email.",
    invalid: "Email ou senha inválidos.",
  },
};

export default function GirisPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      alert(t.resetTitle);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert(t.resetSuccess);
      setShowReset(false);
    } catch {
      alert(t.resetError);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        sifre
      );

      const user = userCred.user;

      if (!user.emailVerified) {
        await auth.signOut();
        setError(t.verify);
        return;
      }

      if (user.email === "info@tatilinidevret.com") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      setError(t.invalid);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          adSoyad: user.displayName || "",
          email: user.email,
          role: user.email === "info@tatilinidevret.com" ? "admin" : "user",
          provider: "google",
          emailVerified: true,
          phoneVerified: false,
          createdAt: serverTimestamp(),
        });
      }

      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">

        {/* LOGO */}
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-[#00AEEF]">passa</span>
            <span className="text-[#FF6B00]">reserva</span>
          </Link>
        </div>

        <h1 className="text-center text-2xl font-semibold mb-6">
          {t.title}
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t.password}
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>{t.remember}</span>
            </label>

            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-blue-600"
            >
              {t.forgot}
            </button>
          </div>

          {error && <p className="text-center text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold bg-[#00AEEF]"
          >
            {loading ? t.loading : t.loginBtn}
          </button>
        </form>

        <div className="text-center my-5 text-sm text-gray-500">{t.or}</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border py-2 rounded flex items-center justify-center gap-2"
        >
          <img src="/icons/google.svg" className="w-5 h-5" alt="Google" />
          {t.google}
        </button>

        {showReset && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <p className="text-sm mb-2">{t.resetTitle}</p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <button
              onClick={handleResetPassword}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
            >
              {t.resetBtn}
            </button>
          </div>
        )}

        <p className="text-center text-sm mt-4">
          {t.noAccount}{" "}
          <Link href="/kayit" className="text-blue-600">
            {t.register}
          </Link>
        </p>
      </div>
    </main>
  );
}