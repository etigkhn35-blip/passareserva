"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebaseConfig";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Query,
  DocumentData,
} from "firebase/firestore";

type Favori = {
  id: string;        // doküman id (genelde ilanId ile aynı)
  ilanId: string;
  baslik: string;
  coverUrl: string;
  fiyat: number;
  createdAt?: any;
};

const DEFAULT_IMG = "/defaults/default.jpg";

export default function FavorilerPage() {
  const [user, loadingUser] = useAuthState(auth);

  const [items, setItems] = useState<Favori[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Kullanıcı UID hazırsa path’i üret
  const favColRef = useMemo(() => {
    if (!user?.uid) return null;
    return collection(db, "favoriler", user.uid, "items");
  }, [user?.uid]);

  useEffect(() => {
    if (loadingUser) return;

    // kullanıcı yoksa
    if (!user || !favColRef) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrMsg(null);

    // 1) Önce orderBy ile dene (createdAt varsa)
    let q: Query<DocumentData>;
    try {
      q = query(favColRef, orderBy("createdAt", "desc"));
    } catch {
      // çok nadir ama güvenli olsun
      q = query(favColRef);
    }

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Favori[] = snap.docs.map((d) => {
          const v = d.data() as any;

          return {
            id: d.id,
            ilanId: String(v.ilanId || d.id),
            baslik: String(v.baslik || "-"),
            coverUrl: String(v.coverUrl || DEFAULT_IMG),
            fiyat: Number(v.fiyat || 0),
            createdAt: v.createdAt,
          };
        });

        setItems(data);
        setLoading(false);
      },
      async (error) => {
        // orderBy createdAt yüzünden index/rules/createdAt eksikliği hatası gelirse:
        console.error("Favoriler snapshot hatası:", error);

        // 2) Fallback: orderBy olmadan tekrar oku (createdAt yoksa sorun çözülür)
        const unsub2 = onSnapshot(
          query(favColRef),
          (snap2) => {
            const data2: Favori[] = snap2.docs.map((d) => {
              const v = d.data() as any;
              return {
                id: d.id,
                ilanId: String(v.ilanId || d.id),
                baslik: String(v.baslik || "-"),
                coverUrl: String(v.coverUrl || DEFAULT_IMG),
                fiyat: Number(v.fiyat || 0),
                createdAt: v.createdAt,
              };
            });

            // createdAt’a göre client-side sırala (varsa)
            data2.sort((a, b) => {
              const ta = a.createdAt?.toMillis?.() ?? 0;
              const tb = b.createdAt?.toMillis?.() ?? 0;
              return tb - ta;
            });

            setItems(data2);
            setLoading(false);
          },
          (error2) => {
            console.error("Favoriler fallback hatası:", error2);
            setErrMsg("Favoriler okunamadı (rules veya proje ayarı).");
            setLoading(false);
          }
        );

        // ilk unsub yerine fallback unsub döndürmek için:
        return () => unsub2();
      }
    );

    return () => unsub();
  }, [user, loadingUser, favColRef]);

  if (loadingUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Favorilerinizi görmek için lütfen giriş yapın.
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {errMsg}
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">❤️ Favorilerim ({items.length})</h1>

      {items.length === 0 ? (
        <div className="text-gray-500">
          Henüz favori eklemediniz. İlan detay sayfasından ⭐ butonuna tıklayarak ekleyebilirsiniz.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((fav) => (
            <Link
              key={fav.id}
              href={`/ilan/${fav.ilanId}`}
              className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={fav.coverUrl || DEFAULT_IMG}
                alt={fav.baslik}
                className="w-full h-44 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_IMG;
                }}
              />
              <div className="p-3">
                <div className="font-medium text-sm line-clamp-2">{fav.baslik}</div>
                <div className="text-blue-600 font-semibold mt-1">
                  {fav.fiyat.toLocaleString("tr-TR")} ₺
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
