"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

type DestekTalebi = {
  id: string;
  baslik: string;
  mesaj: string;
  email: string;
  adSoyad?: string;
  userUid: string;
  durum: "beklemede" | "yanıtlandı";
  okundu: boolean;
  olusturmaTarihi?: Timestamp | null;
  yanit?: string;
  yanitTarihi?: Timestamp | null;
};

const formatDate = (t?: Timestamp | null) => {
  if (!t) return "-";
  try {
    return t.toDate().toLocaleString("tr-TR");
  } catch {
    return "-";
  }
};

export default function GeriBildirimPage() {
  const [user, setUser] = useState<any>(null);

  const [baslik, setBaslik] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [talepler, setTalepler] = useState<DestekTalebi[]>([]);
  const [selected, setSelected] = useState<DestekTalebi | null>(null);

  // 🔹 Kullanıcı oturumu kontrolü
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Kullanıcının destek taleplerini dinle
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "destek_talepleri"),
      where("userUid", "==", user.uid),
      orderBy("olusturmaTarihi", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data() as any;
        return {
          id: d.id,
          baslik: raw?.baslik ?? "",
          mesaj: raw?.mesaj ?? "",
          email: raw?.email ?? "",
          adSoyad: raw?.adSoyad ?? "",
          userUid: raw?.userUid ?? "",
          durum: raw?.durum ?? "beklemede",
          okundu: raw?.okundu ?? false,
          olusturmaTarihi: raw?.olusturmaTarihi ?? null,
          yanit: raw?.yanit ?? "",
          yanitTarihi: raw?.yanitTarihi ?? null,
        } as DestekTalebi;
      });

      setTalepler(data);

      // seçili talep silinmişse reset
      if (selected) {
        const still = data.find((x) => x.id === selected.id);
        if (!still) setSelected(null);
        else setSelected(still);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  // 🔹 Form gönderme işlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Giriş yapmadan bildirim gönderemezsiniz.");
      return;
    }

    if (!baslik.trim() || !mesaj.trim()) {
      alert("Lütfen başlık ve mesaj alanlarını doldurun.");
      return;
    }

    setLoading(true);
    setSuccess(null);

    try {
      // 1) Destek kaydı
      await addDoc(collection(db, "destek_talepleri"), {
        userUid: user.uid,
        adSoyad: user.displayName || "Anonim Kullanıcı",
        email: user.email,
        baslik: baslik.trim(),
        mesaj: mesaj.trim(),
        durum: "beklemede",
        okundu: false,
        olusturmaTarihi: serverTimestamp(),
      });

      // 2) Admin bildirimi (admin panel zil)
      await addDoc(collection(db, "notifications"), {
        type: "destek",
        title: baslik.trim(),
        message: mesaj.trim(),
        userUid: user.uid,
        toUserUid: "admin",
        read: false,
        createdAt: serverTimestamp(),
      });

      setSuccess("✅ Bildiriminiz başarıyla gönderildi. En kısa sürede incelenecektir.");
      setBaslik("");
      setMesaj("");
    } catch (err) {
      console.error("❌ Bildirim gönderim hatası:", err);
      setSuccess("❌ Bildiriminiz gönderilemedi, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Yanıtı açınca okundu yap
  const handleOpenTalep = async (t: DestekTalebi) => {
    setSelected(t);

    // sadece yanıt varsa okundu true yapalım
    if (t.durum === "yanıtlandı" && !t.okundu) {
      try {
        await updateDoc(doc(db, "destek_talepleri", t.id), {
          okundu: true,
        });
      } catch (e) {
        console.error("okundu update hata:", e);
      }
    }
  };

  // 🔹 Giriş yapılmamışsa yönlendirme
  if (!user)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-gray-700">
        <p className="text-center mb-3">Bu sayfayı kullanmak için giriş yapmalısınız.</p>
        <Link
          href="/giris"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
        >
          Giriş Yap
        </Link>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1100px] mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          💬 Sorun / Öneri Bildirimi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SOL: Talepler listesi */}
          <aside className="bg-white border rounded-2xl shadow-sm p-4 max-h-[520px] overflow-y-auto">
            <h2 className="font-semibold text-gray-800 mb-3">📌 Taleplerim</h2>

            {talepler.length === 0 ? (
              <p className="text-sm text-gray-500">Henüz bir talebiniz yok.</p>
            ) : (
              <div className="space-y-2">
                {talepler.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleOpenTalep(t)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      selected?.id === t.id
                        ? "border-primary bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {t.baslik || "(Başlıksız)"}
                      </p>

                      {t.durum === "yanıtlandı" ? (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            t.okundu ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {t.okundu ? "Yanıtlandı" : "Yeni Yanıt"}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          Beklemede
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(t.olusturmaTarihi)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* ORTA+SAĞ: Detay */}
          <section className="md:col-span-2 space-y-6">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border rounded-2xl shadow-sm p-6 space-y-5"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  value={baslik}
                  onChange={(e) => setBaslik(e.target.value)}
                  placeholder="Kısa bir başlık yazın (ör. Ödeme sorunu)"
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Mesajınız
                </label>
                <textarea
                  rows={5}
                  value={mesaj}
                  onChange={(e) => setMesaj(e.target.value)}
                  placeholder="Yaşadığınız sorunu veya önerinizi detaylıca yazın..."
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-semibold py-2 rounded-lg transition ${
                  loading ? "bg-gray-400" : "bg-primary hover:bg-accent"
                }`}
              >
                {loading ? "Gönderiliyor..." : "Gönder"}
              </button>

              {success && (
                <p
                  className={`mt-4 text-sm font-medium ${
                    success.startsWith("✅") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {success}
                </p>
              )}
            </form>

            {/* Detay panel */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              {!selected ? (
                <p className="text-gray-500 text-sm text-center">
                  Soldan bir talep seçerek detayını ve varsa yanıtı görebilirsin.
                </p>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {selected.baslik}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(selected.olusturmaTarihi)}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selected.durum === "yanıtlandı"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selected.durum === "yanıtlandı" ? "Yanıtlandı" : "Beklemede"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="font-semibold text-gray-700 mb-1">Mesajın:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {selected.mesaj}
                    </p>
                  </div>

                  <hr className="my-5" />

                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Admin Yanıtı:</p>

                    {selected.yanit ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-gray-800 whitespace-pre-line">
                          {selected.yanit}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(selected.yanitTarihi)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Henüz yanıt gelmedi. Talebin inceleniyor.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
