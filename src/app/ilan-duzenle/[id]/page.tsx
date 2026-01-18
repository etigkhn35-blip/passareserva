"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function IlanDuzenlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [ucret, setUcret] = useState<number>(0);
  const [orjinalFiyat, setOrjinalFiyat] = useState<number>(0);

  const [il, setIl] = useState("");
  const [ilce, setIlce] = useState("");

  const [girisTarihi, setGirisTarihi] = useState("");
  const [cikisTarihi, setCikisTarihi] = useState("");

  const [kategori, setKategori] = useState("");
  const [altKategori, setAltKategori] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        const ref = doc(db, "ilanlar", String(id));
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("İlan bulunamadı!");
          router.push("/hesabim");
          return;
        }

        const data = snap.data() as any;

        setBaslik(data.baslik || "");
        setAciklama(data.aciklama || "");
        setUcret(Number(data.ucret || 0));
        setOrjinalFiyat(Number(data.orjinalFiyat || 0));

        setIl(data.il || "");
        setIlce(data.ilce || "");

        setGirisTarihi(data.girisTarihi || "");
        setCikisTarihi(data.cikisTarihi || "");

        setKategori(data.kategori || "");
        setAltKategori(data.altKategori || "");
      } catch (err) {
        console.error("İlan çekme hatası:", err);
        alert("İlan bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id, router]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const ref = doc(db, "ilanlar", String(id));

      await updateDoc(ref, {
        baslik,
        aciklama,
        ucret: Number(ucret),
        orjinalFiyat: Number(orjinalFiyat),
        il,
        ilce,
        girisTarihi,
        cikisTarihi,
        kategori,
        altKategori,
        updatedAt: new Date(),
      });

      alert("✅ İlan güncellendi!");
      router.push("/hesabim");
    } catch (err) {
      console.error("İlan güncelleme hatası:", err);
      alert("❌ Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        İlan yükleniyor...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">✏️ İlan Düzenle</h1>

        <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
          <div>
            <label className="block font-semibold mb-1">Başlık</label>
            <input
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Başlık gir"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Açıklama</label>
            <textarea
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
              placeholder="Açıklama gir"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">İlan Fiyatı (₺)</label>
              <input
                type="number"
                value={ucret}
                onChange={(e) => setUcret(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Orjinal Fiyat (₺)</label>
              <input
                type="number"
                value={orjinalFiyat}
                onChange={(e) => setOrjinalFiyat(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">İl</label>
              <input
                value={il}
                onChange={(e) => setIl(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">İlçe</label>
              <input
                value={ilce}
                onChange={(e) => setIlce(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Giriş Tarihi</label>
              <input
                type="date"
                value={girisTarihi}
                onChange={(e) => setGirisTarihi(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Çıkış Tarihi</label>
              <input
                type="date"
                value={cikisTarihi}
                onChange={(e) => setCikisTarihi(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Kategori</label>
              <input
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Alt Kategori</label>
              <input
                value={altKategori}
                onChange={(e) => setAltKategori(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "💾 Kaydet"}
            </button>

            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border font-semibold hover:bg-gray-50"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
