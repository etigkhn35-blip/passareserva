export type BlogPost = {
  id: string;
  title: string;
  desc: string;
  img: string;
  content: string; // HTML string
  metaTitle: string;
  metaDescription: string;
  metaDescriptionAlt?: string;
};

function formatContent(raw: string) {
  // satır satır al
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // ? ile biten satırları kalın yap
  const html = lines
    .map((line) => {
      if (line.endsWith("?")) {
        return `<strong>${line}</strong>`;
      }

      // Liste gibi görünen satırlar için ( - ile başlıyorsa )
      if (line.startsWith("- ")) {
        return `• ${line.replace("- ", "")}`;
      }

      return line;
    })
    .join("<br/><br/>");

  return html;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Tatil Devri Nedir? Tatilimi İptal Edemiyorum, Ne Yapmalıyım?",
    desc: "Otel, tur, tekne ve etkinlik rezervasyonlarını devrederek paranızın yanmasını önleyin.",
    img: "/images/blog-1.jpg",
    metaTitle:
      "Tatil Devri Nedir? Tatilimi İptal Edemiyorum, Ne Yapmalıyım? | TatiliniDevret",
    metaDescription:
      "Tatiliniz iptal oldu ama para iadesi alamıyor musunuz? Otel, tur, tekne ve etkinlik rezervasyonlarını devrederek tatilinizi paraya dönüştürün.",
    metaDescriptionAlt:
      "Tatilimi iptal edemiyorum diyorsanız çözüm burada. Kullanılmayan tatilleri güvenli şekilde devredin, paranız yanmasın.",
    content: formatContent(`
Tatil planları bazen değişir. Aylar öncesinden alınan bir otel rezervasyonu, tur paketi, tekne tatili veya etkinlik bileti…
Her şey hazırken bir anda iptal etmek zorunda kalabilirsiniz.

Tatilimi iptal edemiyorum, ne yapmalıyım?
Tatil parası geri gelir mi?
Otel iade yapmıyor, param yanacak mı?
Tur iptali para iadesi yok mu?

Eğer bu sorular sana tanıdık geliyorsa yalnız değilsin.

Tatil devri; kullanamayacağın bir rezervasyonu veya bileti başka bir kişiye belgeli şekilde devretmendir.

Bu sayede:
- Tatilin tamamen yanmaz
- Ödediğin paranın büyük kısmını kurtarabilirsin
- Devralan kişi aynı tatili daha uygun fiyata alır

Tatil devri neden bu kadar önemli?
Çünkü birçok tatil ürünü “iadesiz” ya da “kısmi iade” şartlarıyla satılır.

Özellikle şu durumlarda para iadesi alınamaz:
- İptal süresi geçmiş rezervasyonlar
- Kampanyalı ve erken rezervasyon fiyatları
- İadesiz otel rezervasyonları
- Etkinlik ve konser biletleri

Tatilini yakmak yerine devretmek en mantıklı çözümdür.

TatiliniDevret.com ile ne yapabilirsin?
- İlan verirsin
- Detayları yazarsın
- Alıcıyla iletişime geçersin
- Rezervasyonu belgeli şekilde devredersin

Tatilini yakma, devret.
Planlar değişebilir ama paran yanmak zorunda değil.
    `),
  },

  {
    id: "2",
    title: "Otel Rezervasyonu Devri Nasıl Yapılır? Bilmen Gereken Tüm Detaylar",
    desc: "Otel iptal etmiyorsa rezervasyonunu devrederek paranı kurtarabilirsin.",
    img: "/images/blog-2.jpg",
    metaTitle:
      "Otel Rezervasyonu Devri Nasıl Yapılır? Otel İptal Etmiyor mu? | TatiliniDevret",
    metaDescription:
      "Otele para verdiniz ama gidemiyor musunuz? Otel rezervasyonunuzu devrederek tatilinizi paraya dönüştürün. Tatiliniz yanmasın.",
    metaDescriptionAlt:
      "Otel rezervasyonu iptal edilemiyorsa çözüm burada. Tatilinizi güvenle devredin, paranızı kurtarın.",
    content: formatContent(`
Aylar öncesinden planladığınız bir otel tatili… Rezervasyon yapılmış, ödeme alınmış, belki erken rezervasyon indirimi bile yakalanmış olabilir.
Ancak hayat her zaman planladığımız gibi ilerlemez.

Otele para verdim ama gidemiyorum ne yapmalıyım?
Otel rezervasyonumu iptal edemiyorum.
Otel para iadesi yapmıyor, ne yapabilirim?
Param yanacak mı?

Eğer bu yazıyı okuyorsanız, bu durumla karşı karşıya olmanız çok muhtemeldir.

Otel rezervasyonu neden iptal edilemiyor?
Birçok otel ve konaklama tesisi iptal konusunda oldukça katıdır.
Özellikle:
- İptal süresi geçmiş rezervasyonlar
- Erken rezervasyon ve kampanyalı fiyatlar
- İadesiz (non-refundable) rezervasyonlar
çoğu zaman para iadesi yapılmadan iptal edilir.

Otel rezervasyonu devri nedir?
Otel rezervasyonu devri, kullanamayacağınız bir konaklamayı başka bir kullanıcıya belgeli şekilde devretmenizdir.

Bu sayede:
- Tatiliniz tamamen yanmaz
- Ödediğiniz paranın büyük bir kısmını kurtarabilirsiniz
- Tatili devralan kişi aynı otelde daha uygun fiyata konaklar

Otel rezervasyonu devri nasıl yapılır?
1. Rezervasyon bilgilerini hazırlayın.
2. TatiliniDevret.com’da ilan verin.
3. Satış fiyatını belirleyin.
4. Devri gerçekleştirin.

Otel para iadesi yapmıyorsa ne yapmalıyım?
Otel para iadesi yapmıyorsa seçenekleriniz sınırlıdır.
Rezervasyonu yakmak yerine devrederek ödediğiniz paranın büyük kısmını kurtarabilirsiniz.

Otel tatilini yakma, devret.
TatiliniDevret.com, otel rezervasyonlarını güvenli ve şeffaf şekilde devretmenizi sağlar.
    `),
  },

  {
    id: "3",
    title: "Tekne Tatili ve Mavi Yolculuk Devri Nedir? İptal Etme, Devret",
    desc: "Gulet, yat ve mavi yolculuk rezervasyonlarını devrederek paranı kurtar.",
    img: "/images/blog-3.jpg",
    metaTitle:
      "Tekne Tatili ve Mavi Yolculuk Devri Nedir? İptal Etme, Devret | TatiliniDevret",
    metaDescription:
      "Tekne tatiline gidemiyor musunuz? Mavi yolculuk ve gulet rezervasyonlarını devrederek tatilinizi paraya dönüştürün.",
    metaDescriptionAlt:
      "Mavi yolculuk iptal edilemiyorsa çözüm burada. Tekne tatilinizi devredin, paranız yanmasın.",
    content: formatContent(`
Tekne tatili ve mavi yolculuklar genellikle aylar öncesinden planlanan, yüksek bütçeli ve iptali en zor tatillerin başında gelir.
Son dakika iptal edildiğinde çoğu zaman para iadesi yapılmaz.

Mavi yolculuk iptal oldu ne yapmalıyım?
Tekne tatiline gidemiyorum param yanacak mı?
Gulet turu iptal edilemiyor.
Tekne rezervasyonu para iadesi yapmıyor.

Tekne tatilleri neden iptal edilemez?
Tekne ve mavi yolculuk tatilleri kişiye özel organize edilir.
Yakıt, personel, rota ve liman planlamaları önceden yapılır.
Bu nedenle özellikle son dakika iptallerinde çoğu tekne firması para iadesi yapmaz.

Tekne tatili ve mavi yolculuk devri nedir?
Tekne tatili devri, kullanamayacağınız gulet, yat veya mavi yolculuk rezervasyonunu başka bir kullanıcıya belgeli şekilde devretmenizdir.

Hangi tekne tatilleri devredilebilir?
- Gulet mavi yolculukları
- Haftalık tekne kiralamaları
- Özel yat tatilleri
- Bodrum, Marmaris ve Göcek çıkışlı turlar
- Kabin kiralama mavi yolculukları

Tekne tatili devri nasıl yapılır?
1. Rezervasyon bilgilerini hazırlayın.
2. TatiliniDevret.com’da ilan verin.
3. Satış fiyatını belirleyin.
4. Devri gerçekleştirin.

Mavi yolculuk devri yasal mı?
Belgeli olduğu sürece tekne tatili ve mavi yolculuk devri yasal ve güvenlidir.

Tekne tatilini yakma, devret.
    `),
  },

  {
    id: "4",
    title: "Villa, Airbnb ve Booking Rezervasyonu Devredilir mi? Gidemiyorsan Ne Yapmalısın?",
    desc: "Airbnb, Booking ve villa rezervasyonlarını devrederek tatilini paraya dönüştür.",
    img: "/images/blog-4.jpg",
    metaTitle: "Villa, Airbnb ve Booking Rezervasyonu Devredilir mi? | TatiliniDevret",
    metaDescription:
      "Airbnb, Booking veya villa tatiline gidemiyor musunuz? Rezervasyonunuzu devrederek tatilinizi paraya dönüştürün.",
    metaDescriptionAlt:
      "Villa tatili iptal edilemiyorsa çözüm burada. Rezervasyonunuzu devredin, paranız yanmasın.",
    content: formatContent(`
Villa tatilleri, Airbnb konaklamaları ve Booking üzerinden yapılan rezervasyonlar genellikle aylar öncesinden planlanır.
Ancak beklenmedik bir durum ortaya çıktığında bu rezervasyonlara gidilemeyebilir.

Airbnb rezervasyonuma gidemiyorum ne yapmalıyım?
Villa tatilimi iptal edemiyorum.
Booking para iadesi yapmıyor.
Airbnb iptal edilemiyor param yanacak mı?

Villa, Airbnb ve Booking rezervasyonları neden iptal edilemez?
İptal koşulları ev sahibine veya tesise göre değişir.
Birçok ilanda iadesiz veya kısmi iade seçeneği bulunur.
Özellikle son dakika iptallerinde para iadesi çoğu zaman yapılmaz.

Rezervasyon devri nedir?
Kullanamayacağınız villa, Airbnb veya Booking rezervasyonunu başka bir kullanıcıya belgeli şekilde devretmenizdir.

Airbnb rezervasyonu devredilebilir mi?
Çoğu zaman misafir bilgileri güncellenebilir.
Ev sahibi ile iletişim kurularak rezervasyon devri fiilen mümkündür.

Booking rezervasyonu devredilebilir mi?
Misafir bilgileri değiştirilebilir.

Villa tatili devri nasıl yapılır?
1. Rezervasyon bilgilerini hazırlayın.
2. TatiliniDevret.com’da ilan verin.
3. Satış fiyatını belirleyin.
4. Devri tamamlayın.

Airbnb’ye gidemiyorsan tatilin yanmasın.
    `),
  },

  {
    id: "5",
    title: "Tur ve Gezi Paketleri Devri Nedir? Uçaklı ve Uçaksız Turlar Nasıl Satılır?",
    desc: "Tur şirketi iade yapmıyorsa tur paketini devrederek paranı kurtar.",
    img: "/images/blog-5.jpg",
    metaTitle: "Tur ve Gezi Paketleri Devri Nedir? Tur İptal Edilemiyorsa Ne Yapılır?",
    metaDescription:
      "Tur iptal oldu ama para iadesi alamıyor musunuz? Uçaksız tur paketlerini devrederek tatilinizi paraya dönüştürün.",
    metaDescriptionAlt:
      "Tur şirketi para iadesi yapmıyorsa çözüm burada. Tur paketini devret, paran yanmasın.",
    content: formatContent(`
Bir tur satın aldınız. Belki aylar öncesinden, belki kampanyalı…
Ancak planlar değişti ve tura katılamıyorsunuz.

Tur iptal oldu ne yapmalıyım?
Tur şirketi para iadesi yapmıyor.
Uçaklı tura gidemiyorum param yanacak mı?
Gezi paketini iptal edemiyorum.

Tur paketleri neden iptal edilemez?
Tur şirketleri uçak, otel ve rehberlik hizmetlerini önceden planladığı için son dakika iptallerinde genellikle para iadesi yapmaz.
Birçok tur sözleşmesinde yüksek iptal kesintileri yer alır.

Tur devri nedir?
Kullanamayacağınız tur paketini başka bir kullanıcıya belgeli şekilde devretmenizdir.

Hangi turlar devredilebilir?
- Vizesiz turlar
- Kayak turları
- Kültür turları
- GAP ve Karadeniz turları
- Hafta sonu ve günübirlik turlar

Uçaklı tur devri yapılabilir mi?
Birçok uçaklı turda isim değişikliği mümkün değildir.
Uçak bileti isme özel olup devredilemez.

Tur tatilini yakma, devret.
    `),
  },

  {
    id: "6",
    title: "Konser, Festival ve Etkinlik Bileti Devri Nedir? Gidemiyorsan Biletin Yanmasın",
    desc: "Etkinlik biletini devrederek paranı kurtar, bilet boşa gitmesin.",
    img: "/images/blog-6.jpg",
    metaTitle: "Konser, Festival ve Etkinlik Bileti Devri Nedir? | TatiliniDevret",
    metaDescription:
      "Konser veya festival biletine gidemiyor musunuz? Etkinlik biletinizi devrederek paranızın yanmasını önleyin.",
    metaDescriptionAlt:
      "Etkinlik bileti iptal edilemiyorsa çözüm burada. Konser ve festival biletini devret, kaybetme.",
    content: formatContent(`
Aylar öncesinden alınmış bir konser bileti, festival girişi veya özel bir etkinlik…
Bazen planlar değişir ve katılmak mümkün olmaz.

Konser biletine gidemiyorum ne yapmalıyım?
Festival bileti iptal edilemiyor.
Etkinlik bileti para iadesi yok mu?
Konser biletimi satabilir miyim?

Etkinlik biletleri neden iptal edilemez?
Organizasyon giderleri önceden yapılır.
Bu nedenle çoğu organizatör iade veya iptal hakkı tanımaz.

Etkinlik bileti devri nedir?
Katılamayacağınız konser, festival veya etkinlik biletini başka bir kullanıcıya belgeli şekilde devretmenizdir.

Etkinlik bileti devri nasıl yapılır?
1. Bilet bilgilerini hazırlayın.
2. TatiliniDevret.com’da ilan verin.
3. Satış fiyatını belirleyin.
4. Devri tamamlayın.

Konserine gidemiyorsan biletin yanmasın.
    `),
  },

  {
    id: "7",
    title: "Workshop, Eğitim ve Atölye Biletleri Nasıl Devredilir? Gidemiyorsan Paran Yanmasın",
    desc: "Yoga, kahve, sanat, gastronomi eğitimlerini devrederek zararını azalt.",
    img: "/images/blog-7.jpg",
    metaTitle: "Workshop, Eğitim ve Atölye Biletleri Nasıl Devredilir? | TatiliniDevret",
    metaDescription:
      "Workshop veya eğitime gidemiyor musunuz? Eğitim biletinizi devrederek paranızın yanmasını önleyin.",
    metaDescriptionAlt:
      "Eğitim iptal edilemiyorsa çözüm burada. Workshop biletini devret, kaybetme.",
    content: formatContent(`
Bir workshop, eğitim programı veya atölye satın aldınız.
Ancak planlar değişti ve katılım sağlayamıyorsunuz.

Workshop’a gidemiyorum ne yapmalıyım?
Eğitim ücretimi geri alamıyorum.
Atölye iptal edilemiyor param yanacak mı?
Workshop biletimi satabilir miyim?

Workshop ve eğitimler neden iptal edilemez?
Kontenjanlar sınırlıdır.
Eğitmen, mekan ve içerik önceden planlanır.
Bu nedenle birçok organizasyon iade veya iptal hakkı tanımaz.

Workshop devri nedir?
Katılamayacağınız eğitim veya atölye kaydını başka bir kullanıcıya belgeli şekilde devretmenizdir.

Workshop bileti devri nasıl yapılır?
1. Eğitim bilgilerini hazırlayın.
2. TatiliniDevret.com’da ilan verin.
3. Satış fiyatını belirleyin.
4. Devri tamamlayın.

Eğitime gidemiyorsan paran yanmasın.
    `),
  },

  {
    id: "8",
    title: "Son Dakika Tatil ve Etkinlik Devri: Etkinliğe Az Kaldıysa Ne Yapmalı?",
    desc: "Son günler kala ilanını öne çıkar, boost kullan, satış ihtimalini artır.",
    img: "/images/blog-8.jpg",
    metaTitle: "Son Dakika Tatil ve Etkinlik Devri: Etkinliğe Az Kaldıysa Ne Yapmalı?",
    metaDescription:
      "Etkinliğe veya tatile son günler mi kaldı? Son dakika devri ve boost ile ilanını öne çıkar, satışı hızlandır.",
    metaDescriptionAlt:
      "Bilet veya tatil satılmıyor mu? Son dakika devri ile görünür ol, paran yanmasın.",
    content: formatContent(`
Bir etkinliğe, tatile ya da rezervasyona günler kaldı… Ancak hâlâ alıcı yok ve zaman hızla daralıyor.
Bu noktada panik yapmak yerine doğru adımları atmak gerekir.

Etkinliğe gidemiyorum son dakika ne yapmalıyım?
Konser bileti satılmıyor.
Tatiline az kaldı alıcı yok.
Son dakika bilet nasıl satılır?

Son dakika devri nedir?
Son dakika devri, tarihi yaklaşmış tatil, etkinlik veya rezervasyonların aciliyet avantajı kullanılarak devredilmesidir.

Etkinliğe kaç gün kala ne yapılmalı?
7 gün kala: %15–25 indirim idealdir.
3–5 gün kala: %25–35 indirim önerilir.
Son 48 saat: %35–45 indirim + boost önerilir.

Son dakika ilanları neden daha hızlı satılır?
Çünkü alıcı tarafında kaçırma korkusu oluşur.
Aynı tarih, aynı ürün, daha uygun fiyat hızlı karar verilmesini sağlar.

Boost nedir ve ne işe yarar?
Boost, ilanınızı üst sıralara taşıyarak daha fazla kişiye gösterilmesini sağlar.

Son günlerde yapılan en büyük hata
Beklemek.

Son dakika = doğru hamle
Doğru fiyatlama ve doğru görünürlükle hâlâ satış yapılabilir.
    `),
  },

  {
    id: "9",
    title: "Tatilini Devretmek Güvenli mi? Dolandırıcılıktan Nasıl Korunursun?",
    desc: "Belgeli ilan, şeffaf süreç ve güvenlik kontrol listesi.",
    img: "/images/blog-9.jpg",
    metaTitle: "Tatilini Devretmek Güvenli mi? Dolandırıcılıktan Nasıl Korunursun?",
    metaDescription:
      "Tatil devri güvenli mi diye mi düşünüyorsun? Belgeli ve güvenli tatil devri hakkında bilmen gereken her şey burada.",
    metaDescriptionAlt:
      "Tatil ve etkinlik devrinde dolandırılmamak için nelere dikkat etmelisin? Güvenli tatil devri rehberi.",
    content: formatContent(`
Tatilini devretmek fikri birçok kişi için mantıklı olsa da akla ilk gelen soru genellikle aynıdır: Güvenli mi?

Tatil devri güvenli mi?
Tatilini devretmek dolandırıcılık mı?
Bilet devrinde dolandırılır mıyım?
Param gider mi?

İnsanlar neden tatil devri konusunda endişeli?
- Sosyal medyada rastgele yapılan satışlar
- Sahte rezervasyon belgeleri
- Başkasına ait ekran görüntüleri
- Kapora alıp kaybolan kişiler

Tatil devri nedir, ne değildir?
Tatil devri şudur:
- Belgeli
- Şeffaf
- Gerçek rezervasyonlara dayalı

Tatil devri şu değildir:
- WhatsApp veya DM üzerinden kontrolsüz satış
- Belgesiz ilan
- Kimliği belirsiz kişilerle işlem

Tatil devri güvenli mi?
Evet, doğru platformda ve belgeli şekilde yapıldığında tatil devri güvenlidir.

Dolandırıcılıktan nasıl korunursun?
1. Belge görmeden ödeme yapma.
2. Aşırı ucuz fiyatlara şüpheyle yaklaş.
3. İlan detaylarını dikkatle oku.
4. Platform dışına çıkma.

TatiliniDevret.com güvenli mi?
TatiliniDevret.com, alıcı ve satıcıyı buluşturan aracı bir platformdur.

Tatilin yanmasın, güven de yanmasın.
    `),
  },
];
