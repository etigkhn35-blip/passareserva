"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import {
  Trash2,
  PlayCircle,
  Edit3,
  AlertCircle,
  Clock,
  FileText,
  CheckCircle,
  ChevronLeft,
  Loader2,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

/* ---------------- LANGUAGE ---------------- */
const translations = {
  en: {
    title: "INACTIVE LISTINGS",
    subtitle: "Your passive, draft and expired listings",

    loginRequired: "You must log in to view this page.",
    login: "Login",

    empty: "You have no inactive or expired listings.",
    back: "Go to Dashboard",

    lastPrice: "LAST PRICE",

    activate: "Republish",
    edit: "Edit",
    delete: "Delete",

    paused: "Paused",
    rejected: "Rejected",
    draft: "Draft",

    confirmActivate: "You will be redirected to payment page. Continue?",
    confirmDelete: "Are you sure you want to delete this listing?",
    errorRedirect: "Redirect failed.",
  },
  pt: {
    title: "ANÚNCIOS INATIVOS",
    subtitle: "Seus anúncios inativos, rascunhos e expirados",

    loginRequired: "Você precisa fazer login.",
    login: "Entrar",

    empty: "Você não tem anúncios inativos.",
    back: "Voltar ao painel",

    lastPrice: "ÚLTIMO PREÇO",

    activate: "Publicar novamente",
    edit: "Editar",
    delete: "Excluir",

    paused: "Pausado",
    rejected: "Rejeitado",
    draft: "Rascunho",

    confirmActivate: "Você será redirecionado para pagamento. Continuar?",
    confirmDelete: "Tem certeza que deseja excluir?",
    errorRedirect: "Erro ao redirecionar.",
  },
};

export default function YayindaOlmayanlarPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const currencySymbol = lang === "pt" ? "R$" : "$";

  const [meUid, setMeUid] = useState<string | null>(null);
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setMeUid(user ? user.uid : null);
      if (user) await fetchIlanlar(user.uid);
      else setLoading(false);
    });
    return () => unsub();
  }, []);

  const fetchIlanlar = async (uid: string) => {
    try {
      const now = new Date();

      const snap = await getDocs(
        query(collection(db, "ilanlar"), where("sahipUid", "==", uid))
      );

      const all = snap.docs.map((d) => {
        const data = d.data() as any;
        const expireDate = data.systemExpireDate?.toDate
          ? data.systemExpireDate.toDate()
          : new Date(data.systemExpireDate);

        return { id: d.id, ...data, expireDate };
      });

      const filtered = all.filter((ilan) => {
        const expired = ilan.expireDate && ilan.expireDate < now;
        const passive = ["paused", "rejected", "draft"].includes(ilan.status);
        return passive || expired;
      });

      setIlanlar(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = (id: string) => {
    if (!confirm(t.confirmActivate)) return;
    router.push(`/odeme/yeni-ilan/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      await deleteDoc(doc(db, "ilanlar", id));
      setIlanlar((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">

          {/* HEADER */}
          <div className="flex items-center gap-5 mb-10">
            <Link href="/hesabim" className="p-3 bg-white rounded-2xl shadow border hover:bg-sky-50">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold uppercase">{t.title}</h1>
              <p className="text-xs text-gray-400 mt-1 uppercase">{t.subtitle}</p>
            </div>
          </div>

          {/* LOGIN */}
          {!meUid ? (
            <div className="bg-white p-20 text-center rounded-3xl shadow">
              <p className="mb-6">{t.loginRequired}</p>
              <Link href="/giris" className="bg-[#00AEEF] text-white px-6 py-3 rounded-xl">
                {t.login}
              </Link>
            </div>
          ) : ilanlar.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-3xl shadow">
              <CheckCircle className="w-10 h-10 mx-auto text-green-400 mb-4" />
              <p>{t.empty}</p>
              <Link href="/hesabim" className="text-[#00AEEF] mt-4 inline-block">
                {t.back}
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ilanlar.map((ilan) => (
                <div key={ilan.id} className="bg-white rounded-3xl shadow overflow-hidden">

                  {/* IMAGE */}
                  <img
                    src={ilan.coverUrl || "/defaults/default.jpg"}
                    className="h-48 w-full object-cover grayscale"
                  />

                  <div className="p-6">
                    <h3 className="font-semibold mb-2">{ilan.baslik}</h3>

                    {/* STATUS */}
                    <div className="mb-3 text-xs">
                      {ilan.status === "paused" && t.paused}
                      {ilan.status === "rejected" && t.rejected}
                      {ilan.status === "draft" && t.draft}
                    </div>

                    {/* PRICE */}
                    <p className="text-[#FF6B00] font-bold text-lg mb-4">
                      {ilan.ucret
                        ? `${ilan.ucret.toLocaleString(locale)} ${currencySymbol}`
                        : "---"}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                      <button onClick={() => handleActivate(ilan.id)}>
                        <PlayCircle />
                      </button>

                      <Link href={`/ilan-duzenle/${ilan.id}`}>
                        <Edit3 />
                      </Link>

                      <button onClick={() => handleDelete(ilan.id)}>
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}