"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

/* ---------------- LANGUAGE ---------------- */
const translations = {
  en: {
    title: "Forgot Password",
    email: "Email address",
    placeholder: "example@mail.com",
    send: "Send Reset Email",
    sending: "Sending...",
    success:
      "Password reset link has been sent. Please check your inbox and spam folder.",
    notFound: "No user found with this email.",
    invalid: "Invalid email address.",
    error: "Failed to send reset email. Please try again.",
    back: "Back to Login",
  },
  pt: {
    title: "Esqueceu a Senha",
    email: "Endereço de email",
    placeholder: "exemplo@mail.com",
    send: "Enviar email",
    sending: "Enviando...",
    success:
      "Link de redefinição enviado. Verifique sua caixa de entrada e spam.",
    notFound: "Nenhum usuário encontrado com este email.",
    invalid: "Email inválido.",
    error: "Falha ao enviar email. Tente novamente.",
    back: "Voltar ao Login",
  },
};

export default function SifremiUnuttumPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage("📩 " + t.success);
      setEmail("");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setMessage("❌ " + t.notFound);
      } else if (err.code === "auth/invalid-email") {
        setMessage("❌ " + t.invalid);
      } else {
        setMessage("❌ " + t.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {/* LOGO */}
        <h1 className="text-center text-2xl font-bold mb-6">
          <span className="text-[#00AEEF]">passa</span>
          <span className="text-[#FF6B00]">reserva</span>
        </h1>

        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
          {t.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <label className="block text-sm font-medium text-gray-700">
            {t.email}
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00AEEF] text-white py-2 rounded-lg font-semibold"
          >
            {loading ? t.sending : t.send}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm bg-gray-50 p-3 rounded-lg border">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link href="/giris" className="text-[#00AEEF]">
            ← {t.back}
          </Link>
        </p>
      </div>
    </main>
  );
}