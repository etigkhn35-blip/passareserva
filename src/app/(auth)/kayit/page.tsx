"use client";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useLanguage } from "@/context/LanguageContext";

/* ---------------- LANGUAGE ---------------- */
const translations = {
  en: {
    title: "Create Account",
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    register: "Register",
    loading: "Registering...",
    haveAccount: "Already have an account?",
    login: "Login",
    success:
      "Registration successful! Please verify your email before logging in.",
    phoneError: "Phone must start with 05 and be 11 digits.",
    phoneUsed: "This phone number is already used.",
    emailUsed: "This email is already used.",
    invalidEmail: "Invalid email format.",
    weakPassword: "Password must be at least 6 characters.",
    error: "An error occurred.",
  },
  pt: {
    title: "Criar Conta",
    name: "Nome completo",
    email: "Email",
    phone: "Telefone",
    password: "Senha",
    register: "Registrar",
    loading: "Registrando...",
    haveAccount: "Já tem uma conta?",
    login: "Entrar",
    success:
      "Registro concluído! Verifique seu email antes de entrar.",
    phoneError: "Telefone deve começar com 05 e ter 11 dígitos.",
    phoneUsed: "Este telefone já está em uso.",
    emailUsed: "Este email já está em uso.",
    invalidEmail: "Email inválido.",
    weakPassword: "Senha deve ter pelo menos 6 caracteres.",
    error: "Ocorreu um erro.",
  },
};

export default function RegisterPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [form, setForm] = useState({
    adSoyad: "",
    email: "",
    telefon: "",
    sifre: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!/^05\d{9}$/.test(form.telefon)) {
        throw new Error(t.phoneError);
      }

      const phoneQuery = query(
        collection(db, "users"),
        where("telefon", "==", form.telefon)
      );

      const phoneSnap = await getDocs(phoneQuery);
      if (!phoneSnap.empty) {
        throw new Error(t.phoneUsed);
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.sifre
      );

      await updateProfile(user, {
        displayName: form.adSoyad,
      });

      await setDoc(doc(db, "users", user.uid), {
        adSoyad: form.adSoyad,
        email: form.email,
        telefon: form.telefon,
        role: "user",
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date(),
      });

      await sendEmailVerification(user);

      setMessage("✅ " + t.success);
    } catch (err: any) {
      let errorMsg = t.error;

      if (err.code === "auth/email-already-in-use") {
        errorMsg = t.emailUsed;
      } else if (err.code === "auth/invalid-email") {
        errorMsg = t.invalidEmail;
      } else if (err.code === "auth/weak-password") {
        errorMsg = t.weakPassword;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setMessage("⚠️ " + errorMsg);
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

          <input
            name="adSoyad"
            required
            value={form.adSoyad}
            onChange={handleChange}
            placeholder={t.name}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder={t.email}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="tel"
            name="telefon"
            required
            value={form.telefon}
            onChange={handleChange}
            placeholder="05xx xxx xx xx"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="password"
            name="sifre"
            required
            value={form.sifre}
            onChange={handleChange}
            placeholder={t.password}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00AEEF] text-white py-2 rounded-lg font-semibold"
          >
            {loading ? t.loading : t.register}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm bg-gray-50 p-2 rounded">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          {t.haveAccount}{" "}
          <Link href="/giris" className="text-[#00AEEF]">
            {t.login}
          </Link>
        </p>
      </div>
    </main>
  );
}