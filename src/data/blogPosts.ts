export type BlogPost = {
  id: string;
  title: string;
  desc: string;
  img: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Tatilini Devretmek Güvenli mi? 7 İpucu",
    desc: "Devir sürecinde dikkat etmen gereken kritik noktalar.",
    img: "/images/blog-1.jpg",
    content: `
Tatil devri yaparken güvenli kalmak için şu adımları mutlaka uygula:

1) Kimlik doğrulama iste
2) Ödemeyi kayıtlı şekilde yap
3) Sözleşme oluştur
4) Rezervasyon teyidi al
5) İlan ekran görüntüsü al
6) Telefonla teyit et
7) Şüpheli durumlarda vazgeç
`,
  },

  {
    id: "2",
    title: "Erken Rezervasyon İptalinde Para Nasıl Kurtarılır?",
    desc: "İptal koşulları + alternatif çözümler.",
    img: "/images/blog-2.jpg",
    content: `
Erken rezervasyon iptallerinde para kaybını azaltmak için:

1) İptal politikasını kontrol et
2) Otel ile direkt görüş
3) Tarih değişikliği iste
4) Devir seçeneğini değerlendir
5) Kısmi iade / voucher tekliflerini karşılaştır
`,
  },

  {
    id: "3",
    title: "Villa, Otel, Bungalow: Hangisi Daha Avantajlı?",
    desc: "Bütçe ve deneyime göre doğru seçimi yap.",
    img: "/images/blog-3.jpg",
    content: `
Villa mı otel mi bungalow mu seçerken şunlara bak:

- Kişi sayısı
- Bütçe
- Mahremiyet ihtiyacı
- Kahvaltı / yemek dahil mi
- Ulaşım kolaylığı
`,
  },

  {
    id: "4",
    title: "Tatil Devrinde Sözleşme Şartları",
    desc: "Alıcı & satıcı için kritik maddeler.",
    img: "/images/blog-4.jpg",
    content: `
Tatil devri sözleşmesinde mutlaka olmalı:

1) Rezervasyon bilgileri
2) İsim değişikliği şartları
3) Ödeme şekli
4) İptal / iade durumu
5) Tarafların kimlik bilgileri
`,
  },

  {
    id: "5",
    title: "Bütçe Dostu Tatil Tüyoları",
    desc: "İndirimli ilanları doğru zamanda yakala.",
    img: "/images/blog-5.jpg",
    content: `
Bütçe dostu tatil için:

- Erken rezervasyon fırsatlarını takip et
- Son dakika devredilen ilanları kontrol et
- Hafta içi konaklama seç
- Alternatif lokasyonları değerlendir
`,
  },

  {
    id: "6",
    title: "Dolandırıcılığa Karşı 9 Güvenlik Kontrolü",
    desc: "Ödeme ve kimlik süreçlerinde dikkat.",
    img: "/images/blog-6.jpg",
    content: `
Dolandırıcılığa karşı 9 kontrol:

1) Kimlik doğrula
2) IBAN isim eşleşmesini kontrol et
3) WhatsApp ekran görüntüsüne güvenme
4) Kapora tuzağına düşme
5) Şüpheli linklere tıklama
6) Dekontu sakla
7) Yazılı anlaşma yap
8) Otelden teyit al
9) İçine sinmiyorsa iptal et
`,
  },

  {
    id: "7",
    title: "Tatil Devri Nedir? Yeni Nesil Tatil",
    desc: "Kullanılmayan rezervasyonları değerlendirme rehberi.",
    img: "/images/blog-7.jpg",
    content: `
Tatil devri, kullanılamayan rezervasyonların başka bir kişiye devredilmesidir.

Bu sayede:
- Satıcı parasını kurtarır
- Alıcı daha uygun fiyata tatil yapar
`,
  },

  {
    id: "8",
    title: "Konaklama Devirlerinde Sık Yapılan Hatalar",
    desc: "Bu hatalardan kaçın, paran boşa gitmesin.",
    img: "/images/blog-8.jpg",
    content: `
Konaklama devrinde sık yapılan hatalar:

- Rezervasyon detaylarını kontrol etmemek
- Yazılı anlaşma yapmamak
- İsim değişikliği yapılabilir mi sormamak
- İptal şartlarını okumamak
`,
  },

  {
    id: "9",
    title: "Tatilini Devretmenin Avantajları",
    desc: "Hem alıcı hem satıcı için kazan-kazan modeli.",
    img: "/images/blog-9.jpg",
    content: `
Tatilini devretmenin avantajları:

✅ Satıcı için: para yanmaz  
✅ Alıcı için: uygun fiyatla tatil  
✅ Herkes için: kazan-kazan modeli
`,
  },
];